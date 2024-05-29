import { DomainEventFailover } from "../../../../contexts/shared/infrastructure/event_bus/failover/DomainEventFailover";
import { RabbitMqConnection } from "../../../../contexts/shared/infrastructure/event_bus/rabbitmq/RabbitMqConnection";
import { RabbitMqEventBus } from "../../../../contexts/shared/infrastructure/event_bus/rabbitmq/RabbitMqEventBus";
import { HttpNextResponse } from "../../../../contexts/shared/infrastructure/http/HttpNextResponse";
import { PostgresConnection } from "../../../../contexts/shared/infrastructure/PostgresConnection";

export async function POST(): Promise<Response> {
	const eventBus = new RabbitMqEventBus(
		new RabbitMqConnection(),
		new DomainEventFailover(new PostgresConnection()),
	);

	await eventBus.publishFromFailover();

	return HttpNextResponse.created();
}
