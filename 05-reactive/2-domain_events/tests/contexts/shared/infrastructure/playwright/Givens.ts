import type { APIRequestContext } from "playwright-core";

import { PostgresConnection } from "../../../../../src/contexts/shared/infrastructure/PostgresConnection";
import { ProductReview } from "../../../../../src/contexts/shop/product_reviews/domain/ProductReview";
import { Product } from "../../../../../src/contexts/shop/products/domain/Product";
import { PostgresProductRepository } from "../../../../../src/contexts/shop/products/infrastructure/PostgresProductRepository";
import { User } from "../../../../../src/contexts/shop/users/domain/User";
import { PostgresUserRepository } from "../../../../../src/contexts/shop/users/infrastructure/PostgresUserRepository";
import { PlaywrightRequest } from "./PlaywrightRequest";

const connection = new PostgresConnection();
const userRepository = new PostgresUserRepository(connection);
const productRepository = new PostgresProductRepository(connection);

export async function givenThereIsAUser(user: User): Promise<void> {
	await userRepository.save(user);
}

export async function givenThereIsAProduct(product: Product): Promise<void> {
	await productRepository.save(product);
}

export async function givenThereIsAProductReview(
	request: APIRequestContext,
	review: ProductReview,
): Promise<void> {
	await PlaywrightRequest(request).put(`/api/shop/product_reviews/${review.id.value}`, {
		userId: review.userId.value,
		productId: review.productId.value,
		rating: review.rating.value,
		comment: review.comment.value,
	});
}
