import { ContainerBuilder } from "diod";

import { EventBus } from "../../domain/event/EventBus";
import { UuidGenerator } from "../../domain/UuidGenerator";
import { DomainEventFailover } from "../event_bus/failover/DomainEventFailover";
import { RabbitMqConnection } from "../event_bus/rabbitmq/RabbitMqConnection";
import { RabbitMqEventBus } from "../event_bus/rabbitmq/RabbitMqEventBus";
import { OfficialUuidGenerator } from "../OfficialUuidGenerator";
import { PostgresConnection } from "../PostgresConnection";

const builder = new ContainerBuilder();

builder.register(UuidGenerator).use(OfficialUuidGenerator);

builder.registerAndUse(PostgresConnection);

builder.registerAndUse(RabbitMqConnection);
builder.registerAndUse(DomainEventFailover);
builder.register(EventBus).use(RabbitMqEventBus);

export const container = builder.build();
