import { faker } from "@faker-js/faker";

import { ProductReviewRating } from "../../../../../src/contexts/shop/product_reviews/domain/ProductReviewRating";

export class ProductReviewRatingMother {
	static create(value?: number): ProductReviewRating {
		return new ProductReviewRating(value ?? faker.number.int({ min: 1, max: 5 }));
	}
}
