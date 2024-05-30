import {
	givenThereIsAProduct,
	givenThereIsAProductReview,
	givenThereIsAUser,
} from "../../../../contexts/shared/infrastructure/playwright/Givens";
import { PlaywrightRequest } from "../../../../contexts/shared/infrastructure/playwright/PlaywrightRequest";
import { expect, test } from "../../../../contexts/shared/infrastructure/playwright/PlaywrightTest";
import { ProductReviewMother } from "../../../../contexts/shop/product_reviews/domain/ProductReviewMother";
import { ProductMother } from "../../../../contexts/shop/products/domain/ProductMother";
import { UserMother } from "../../../../contexts/shop/users/domain/UserMother";

test.describe("Get product reviews by product", () => {
	test("get existing product reviews", async ({ request }) => {
		const user = UserMother.create();
		const product = ProductMother.create();
		const anotherProduct = ProductMother.create();

		const review1 = ProductReviewMother.create({
			productId: product.id.value,
			userId: user.id.value,
		});
		const review1Primitives = review1.toPrimitives();

		const review2 = ProductReviewMother.create({
			productId: product.id.value,
			userId: user.id.value,
		});
		const review2Primitives = review2.toPrimitives();

		const reviewForAnotherProduct = ProductReviewMother.create({
			productId: anotherProduct.id.value,
			userId: user.id.value,
		});

		await givenThereIsAUser(user);
		await givenThereIsAProduct(product);
		await givenThereIsAProduct(anotherProduct);

		await givenThereIsAProductReview(review1);
		await givenThereIsAProductReview(review2);
		await givenThereIsAProductReview(reviewForAnotherProduct);

		const response = await PlaywrightRequest(request).get(
			`/api/shop/product_reviews?product_id=${product.id.value}`,
		);

		const responseBody = await response.json();

		expect(response.status()).toBe(200);

		expect(responseBody).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					id: review1Primitives.id,
					userId: review1Primitives.userId,
					productId: review1Primitives.productId,
					rating: review1Primitives.rating,
					comment: review1Primitives.comment,
				}),
				expect.objectContaining({
					id: review2Primitives.id,
					userId: review2Primitives.userId,
					productId: review2Primitives.productId,
					rating: review2Primitives.rating,
					comment: review2Primitives.comment,
				}),
			]),
		);
	});
});
