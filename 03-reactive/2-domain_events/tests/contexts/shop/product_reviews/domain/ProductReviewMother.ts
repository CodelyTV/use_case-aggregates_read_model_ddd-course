import { Primitives } from "@codelytv/primitives-type";
import { faker } from "@faker-js/faker";

import { ProductReview } from "../../../../../src/contexts/shop/product_reviews/domain/ProductReview";
import { UserId } from "../../../../../src/contexts/shop/users/domain/UserId";
import { ProductIdMother } from "../../products/domain/ProductIdMother";
import { UserIdMother } from "../../users/domain/UserIdMother";
import { ProductReviewCommentMother } from "./ProductReviewCommentMother";
import { ProductReviewIdMother } from "./ProductReviewIdMother";
import { ProductReviewRatingMother } from "./ProductReviewRatingMother";

export class ProductReviewMother {
	static create(params?: Partial<Primitives<ProductReview>>): ProductReview {
		const primitives: Primitives<ProductReview> = {
			id: ProductReviewIdMother.create().value,
			userId: UserIdMother.create().value,
			productId: ProductIdMother.create().value,
			rating: ProductReviewRatingMother.create().value,
			comment: ProductReviewCommentMother.create().value,
			...params,
		};

		return ProductReview.fromPrimitives(primitives);
	}

	static forUser(userId: UserId): ProductReview {
		return ProductReviewMother.create({ userId: userId.value });
	}

	static multipleForUser(userId: UserId): ProductReview[] {
		return faker.helpers.multiple(() => ProductReviewMother.forUser(userId), {
			count: { min: 1, max: 5 },
		});
	}
}
