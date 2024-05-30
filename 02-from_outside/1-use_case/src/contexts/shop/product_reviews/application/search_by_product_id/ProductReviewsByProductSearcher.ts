import { Primitives } from "@codelytv/primitives-type";

import { ProductId } from "../../../products/domain/ProductId";
import { ProductReview } from "../../domain/ProductReview";
import { ProductReviewRepository } from "../../domain/ProductReviewRepository";

export class ProductReviewsByProductSearcher {
	constructor(private readonly repository: ProductReviewRepository) {}

	async search(productId: string): Promise<Primitives<ProductReview>[]> {
		return (await this.repository.searchByProduct(new ProductId(productId))).map((review) =>
			review.toPrimitives(),
		);
	}
}
