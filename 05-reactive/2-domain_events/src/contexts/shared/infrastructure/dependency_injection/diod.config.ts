import { ContainerBuilder } from "diod";

import { SendWelcomeEmailOnUserRegistered } from "../../../retention/email/application/send_welcome_email/SendWelcomeEmailOnUserRegistered";
import { WelcomeEmailSender } from "../../../retention/email/application/send_welcome_email/WelcomeEmailSender";
import { EmailSender } from "../../../retention/email/domain/EmailSender";
import { FakeEmailSender } from "../../../retention/email/infrastructure/FakeEmailSender";
import { UpdateLastActivityDateOnUserUpdated } from "../../../retention/user/application/update_last_activity_date/UpdateLastActivityDateOnUserUpdated";
import { UserLastActivityUpdater } from "../../../retention/user/application/update_last_activity_date/UserLastActivityUpdater";
import { RetentionUserRepository } from "../../../retention/user/domain/RetentionUserRepository";
import { PostgresRetentionUserRepository } from "../../../retention/user/infrastructure/PostgresRetentionUserRepository";
import { ProductReviewCreator } from "../../../shop/product_reviews/application/create/ProductReviewCreator";
import { ProductReviewRepository } from "../../../shop/product_reviews/domain/ProductReviewRepository";
import { PostgresProductReviewRepository } from "../../../shop/product_reviews/infrastructure/PostgresProductReviewRepository";
import { ProductFinder } from "../../../shop/products/application/find/ProductFinder";
import { ProductLatestTopReviewsUpdater } from "../../../shop/products/application/update_latest_top_reviews/ProductLatestTopReviewsUpdater";
import { UpdateLatestTopReviewsOnProductReviewCreated } from "../../../shop/products/application/update_latest_top_reviews/UpdateLatestTopReviewsOnProductReviewCreated";
import { DomainProductFinder } from "../../../shop/products/domain/DomainProductFinder";
import { ProductRepository } from "../../../shop/products/domain/ProductRepository";
import { PostgresProductRepository } from "../../../shop/products/infrastructure/PostgresProductRepository";
import { UserFinder } from "../../../shop/users/application/find/UserFinder";
import { UserRepository } from "../../../shop/users/domain/UserRepository";
import { PostgresUserRepository } from "../../../shop/users/infrastructure/PostgresUserRepository";
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

builder.registerAndUse(ProductReviewCreator);
builder.register(ProductReviewRepository).use(PostgresProductReviewRepository);
builder.registerAndUse(UserFinder);
builder.registerAndUse(ProductFinder);

builder.registerAndUse(UpdateLatestTopReviewsOnProductReviewCreated).addTag("subscriber");
builder.registerAndUse(ProductLatestTopReviewsUpdater);
builder.register(ProductRepository).use(PostgresProductRepository);
builder.registerAndUse(DomainProductFinder);
builder.register(UserRepository).use(PostgresUserRepository);

export const container = builder.build();
