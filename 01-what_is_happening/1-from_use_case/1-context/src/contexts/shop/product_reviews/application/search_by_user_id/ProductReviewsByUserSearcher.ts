import { Primitives } from "@codelytv/primitives-type";

import { UserId } from "../../../users/domain/UserId";
import { ProductReview } from "../../domain/ProductReview";
import { ProductReviewRepository } from "../../domain/ProductReviewRepository";

export class ProductReviewsByUserSearcher {
	constructor(private readonly repository: ProductReviewRepository) {}

	async search(userId: string): Promise<Primitives<ProductReview>[]> {
		return (await this.repository.searchByUser(new UserId(userId))).map((review) =>
			review.toPrimitives(),
		);
	}
}
