import { ContainerBuilder } from "diod";

import { SendWelcomeEmailOnUserRegistered } from "../../../retention/email/application/send_welcome_email/SendWelcomeEmailOnUserRegistered";
import { WelcomeEmailSender } from "../../../retention/email/application/send_welcome_email/WelcomeEmailSender";
import { EmailSender } from "../../../retention/email/domain/EmailSender";
import { FakeEmailSender } from "../../../retention/email/infrastructure/FakeEmailSender";
import { UpdateLastActivityDateOnUserUpdated } from "../../../retention/user/application/update_last_activity_date/UpdateLastActivityDateOnUserUpdated";
import { UserLastActivityUpdater } from "../../../retention/user/application/update_last_activity_date/UserLastActivityUpdater";
import { RetentionUserRepository } from "../../../retention/user/domain/RetentionUserRepository";
import { PostgresRetentionUserRepository } from "../../../retention/user/infrastructure/PostgresRetentionUserRepository";
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

builder.registerAndUse(SendWelcomeEmailOnUserRegistered).addTag("subscriber");
builder.registerAndUse(WelcomeEmailSender);
builder.register(EmailSender).use(FakeEmailSender);

builder.registerAndUse(UpdateLastActivityDateOnUserUpdated).addTag("subscriber");
builder.registerAndUse(UserLastActivityUpdater);
builder.register(RetentionUserRepository).use(PostgresRetentionUserRepository);

export const container = builder.build();
