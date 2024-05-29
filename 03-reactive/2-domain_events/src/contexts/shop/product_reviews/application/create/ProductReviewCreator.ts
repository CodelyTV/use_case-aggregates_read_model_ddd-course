import { EventBus } from "../../../../shared/domain/event/EventBus";
import { ProductFinder } from "../../../products/application/find/ProductFinder";
import { ProductDoesNotExistError } from "../../../products/domain/ProductDoesNotExistError";
import { UserFinder } from "../../../users/application/find/UserFinder";
import { UserDoesNotExistError } from "../../../users/domain/UserDoesNotExistError";
import { ProductReview } from "../../domain/ProductReview";
import { ProductReviewRepository } from "../../domain/ProductReviewRepository";

export type ProductReviewCreatorErrors = UserDoesNotExistError | ProductDoesNotExistError;

export class ProductReviewCreator {
	constructor(
		private readonly userFinder: UserFinder,
		private readonly productFinder: ProductFinder,
		private readonly repository: ProductReviewRepository,
		private readonly eventBus: EventBus,
	) {}

	async create(
		id: string,
		userId: string,
		productId: string,
		rating: number,
		comment: string,
	): Promise<void> {
		await this.ensureUserExists(userId);
		await this.ensureProductExists(productId);

		const review = ProductReview.create(id, userId, productId, rating, comment);

		await this.repository.save(review);
		await this.eventBus.publish(review.pullDomainEvents());
	}

	private async ensureUserExists(userId: string): Promise<void> {
		await this.userFinder.find(userId);
	}

	private async ensureProductExists(userId: string): Promise<void> {
		await this.productFinder.find(userId);
	}
}
