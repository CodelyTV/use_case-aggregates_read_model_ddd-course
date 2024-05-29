import { faker } from "@faker-js/faker";

import { ProductReviewId } from "../../../../../src/contexts/shop/product_reviews/domain/ProductReviewId";

export class ProductReviewIdMother {
	static create(value?: string): ProductReviewId {
		return new ProductReviewId(value ?? faker.string.uuid());
	}
}
