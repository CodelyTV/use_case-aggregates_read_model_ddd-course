import {
	givenThereIsAProduct,
	givenThereIsAUser,
} from "../../../../contexts/shared/infrastructure/playwright/Givens";
import { PlaywrightRequest } from "../../../../contexts/shared/infrastructure/playwright/PlaywrightRequest";
import { test } from "../../../../contexts/shared/infrastructure/playwright/PlaywrightTest";
import { ProductReviewMother } from "../../../../contexts/shop/product_reviews/domain/ProductReviewMother";
import { ProductMother } from "../../../../contexts/shop/products/domain/ProductMother";
import { UserMother } from "../../../../contexts/shop/users/domain/UserMother";

test.describe("Put product review", () => {
	test("create a valid product review", async ({ request }) => {
		const review = ProductReviewMother.create().toPrimitives();

		await givenThereIsAUser(UserMother.create({ id: review.userId }));
		await givenThereIsAProduct(ProductMother.create({ id: review.productId }));

		await PlaywrightRequest(request).put(`/api/shop/product_reviews/${review.id}`, {
			userId: review.userId,
			productId: review.productId,
			rating: review.rating,
			comment: review.comment,
		});
	});
});
