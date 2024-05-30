import { Primitives } from "@codelytv/primitives-type";

import { AggregateRoot } from "../../../shared/domain/AggregateRoot";
import { ProductId } from "../../products/domain/ProductId";
import { UserId } from "../../users/domain/UserId";
import { ProductReviewComment } from "./ProductReviewComment";
import { ProductReviewCreatedDomainEvent } from "./ProductReviewCreatedDomainEvent";
import { ProductReviewId } from "./ProductReviewId";
import { ProductReviewRating } from "./ProductReviewRating";

export class ProductReview extends AggregateRoot {
	constructor(
		public readonly id: ProductReviewId,
		public readonly userId: UserId,
		public readonly productId: ProductId,
		public readonly rating: ProductReviewRating,
		public readonly comment: ProductReviewComment,
	) {
		super();
	}

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
		const review = ProductReview.fromPrimitives({
			id,
			userId,
			productId,
			rating,
			comment,
		});

		review.record(new ProductReviewCreatedDomainEvent(id, userId, productId, rating, comment));

		return review;
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
