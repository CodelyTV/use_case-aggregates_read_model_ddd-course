/* eslint-disable no-console,@typescript-eslint/ban-ts-comment */
import "reflect-metadata";

import { ConsumeMessage } from "amqplib";

import { DomainEvent } from "../../contexts/shared/domain/event/DomainEvent";
import { DomainEventClass } from "../../contexts/shared/domain/event/DomainEventClass";
import { DomainEventSubscriber } from "../../contexts/shared/domain/event/DomainEventSubscriber";
import { container } from "../../contexts/shared/infrastructure/dependency_injection/diod.config";
import { DomainEventJsonDeserializer } from "../../contexts/shared/infrastructure/event_bus/DomainEventJsonDeserializer";
import { RabbitMqConnection } from "../../contexts/shared/infrastructure/event_bus/rabbitmq/RabbitMqConnection";

const connection = new RabbitMqConnection();
const maxRetries = 3;

const subscribers = container
	.findTaggedServiceIdentifiers<DomainEventSubscriber<DomainEvent>>("subscriber")
	.map((id) => container.get(id));

const eventMapping = new Map<string, DomainEventClass>();

subscribers.forEach((subscriber) => {
	subscriber.subscribedTo().forEach((eventClass) => {
		eventMapping.set(eventClass.eventName, eventClass);
	});
});

const deserializer = new DomainEventJsonDeserializer(eventMapping);

async function main(): Promise<void> {
	await connection.connect();

	await Promise.all(
		subscribers.map((subscriber) => connection.consume(subscriber.name(), consume(subscriber))),
	);
}

function consume(subscriber: DomainEventSubscriber<DomainEvent>) {
	return async function (message: ConsumeMessage): Promise<void> {
		const content = message.content.toString();
		const domainEvent = deserializer.deserialize(content);

		console.log("📥 Consuming domain event", domainEvent.eventName);

		try {
			await subscriber.on(domainEvent);
		} catch (error) {
			await handleError(message, subscriber.name(), error as Error);
		} finally {
			await connection.ack(message);
		}
	};
}

async function handleError(
	message: ConsumeMessage,
	queueName: string,
	error: Error,
): Promise<void> {
	console.log(`Error consuming ${message.fields.routingKey}`, error.message);

	if (hasBeenRedeliveredTooMuch(message)) {
		console.log(`--- To dead letter`);
		await connection.publishToDeadLetter(message, queueName);
	} else {
		console.log(`--- To retry`);
		await connection.publishToRetry(message, queueName);
	}
}

function hasBeenRedeliveredTooMuch(message: ConsumeMessage): boolean {
	if (hasBeenRedelivered(message)) {
		// @ts-ignore
		const count = parseInt(message.properties.headers["redelivery_count"], 10);

		return count >= maxRetries;
	}

	return false;
}

function hasBeenRedelivered(message: ConsumeMessage): boolean {
	// @ts-ignore
	return message.properties.headers["redelivery_count"] !== undefined;
}

main().catch(console.error);
