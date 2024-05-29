import { Primitives } from "@codelytv/primitives-type";

import { ProductId } from "../../products/domain/ProductId";
import { UserId } from "../../users/domain/UserId";
import { ProductReviewComment } from "./ProductReviewComment";
import { ProductReviewId } from "./ProductReviewId";
import { ProductReviewRating } from "./ProductReviewRating";

export class ProductReview {
	constructor(
		public readonly id: ProductReviewId,
		public readonly userId: UserId,
		public readonly productId: ProductId,
		public readonly rating: ProductReviewRating,
		public readonly comment: ProductReviewComment,
	) {}

	static fromPrimitives(primitives: Primitives<ProductReview>): ProductReview {
		return new ProductReview(
			new ProductReviewId(primitives.id),
			new UserId(primitives.userId),
			new ProductId(primitives.productId),
			new ProductReviewRating(primitives.rating),
			new ProductReviewComment(primitives.comment),
		);
	}

	static create(
		id: string,
		userId: string,
		productId: string,
		rating: number,
		comment: string,
	): ProductReview {
		return ProductReview.fromPrimitives({
			id,
			userId,
			productId,
			rating,
			comment,
		});
	}

	toPrimitives(): Primitives<ProductReview> {
		return {
			id: this.id.value,
			userId: this.userId.value,
			productId: this.productId.value,
			rating: this.rating.value,
			comment: this.comment.value,
		};
	}
}
