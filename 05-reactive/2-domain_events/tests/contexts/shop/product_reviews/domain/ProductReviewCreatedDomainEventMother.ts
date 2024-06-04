import { Primitives } from "@codelytv/primitives-type";

import { ProductReview } from "../../../../../src/contexts/shop/product_reviews/domain/ProductReview";
import { ProductReviewCreatedDomainEvent } from "../../../../../src/contexts/shop/product_reviews/domain/ProductReviewCreatedDomainEvent";
import { ProductIdMother } from "../../products/domain/ProductIdMother";
import { UserIdMother } from "../../users/domain/UserIdMother";
import { ProductReviewCommentMother } from "./ProductReviewCommentMother";
import { ProductReviewIdMother } from "./ProductReviewIdMother";
import { ProductReviewRatingMother } from "./ProductReviewRatingMother";

export class ProductReviewCreatedDomainEventMother {
	static create(params?: Partial<Primitives<ProductReview>>): ProductReviewCreatedDomainEvent {
		const primitives: Primitives<ProductReview> = {
			id: ProductReviewIdMother.create().value,
			userId: UserIdMother.create().value,
			productId: ProductIdMother.create().value,
			rating: ProductReviewRatingMother.create().value,
			comment: ProductReviewCommentMother.create().value,
			...params,
		};

		return new ProductReviewCreatedDomainEvent(
			primitives.id,
			primitives.userId,
			primitives.productId,
			primitives.rating,
			primitives.comment,
		);
	}
}
