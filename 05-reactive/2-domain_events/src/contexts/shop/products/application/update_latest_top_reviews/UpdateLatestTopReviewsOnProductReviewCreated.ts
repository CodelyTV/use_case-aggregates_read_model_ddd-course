import { Service } from "diod";

import { DomainEventClass } from "../../../../shared/domain/event/DomainEventClass";
import { DomainEventSubscriber } from "../../../../shared/domain/event/DomainEventSubscriber";
import { ProductReviewCreatedDomainEvent } from "../../../product_reviews/domain/ProductReviewCreatedDomainEvent";
import { ProductLatestTopReviewsUpdater } from "./ProductLatestTopReviewsUpdater";

@Service()
export class UpdateLatestTopReviewsOnProductReviewCreated
	implements DomainEventSubscriber<ProductReviewCreatedDomainEvent>
{
	constructor(private readonly updater: ProductLatestTopReviewsUpdater) {}

	async on(event: ProductReviewCreatedDomainEvent): Promise<void> {
		console.log(`   Review rating: ${event.rating}`);

		await this.updater.update(event.productId, event.userId, event.rating, event.comment);
	}

	subscribedTo(): DomainEventClass[] {
		return [ProductReviewCreatedDomainEvent];
	}

	name(): string {
		return "shop.products.update_latest_top_reviews_on_product_review_created";
	}
}
