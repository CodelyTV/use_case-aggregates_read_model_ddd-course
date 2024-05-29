import { faker } from "@faker-js/faker";

import { ProductReviewComment } from "../../../../../src/contexts/shop/product_reviews/domain/ProductReviewComment";

export class ProductReviewCommentMother {
	static create(value?: string): ProductReviewComment {
		return new ProductReviewComment(value ?? faker.string.alphanumeric());
	}
}
