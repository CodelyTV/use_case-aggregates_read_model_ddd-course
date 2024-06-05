import {
	givenThereIsAProduct,
	givenThereIsAProductReview,
	givenThereIsAUser,
} from "../../../../contexts/shared/infrastructure/playwright/Givens";
import { PlaywrightRequest } from "../../../../contexts/shared/infrastructure/playwright/PlaywrightRequest";
import { test } from "../../../../contexts/shared/infrastructure/playwright/PlaywrightTest";
import { ProductReviewMother } from "../../../../contexts/shop/product_reviews/domain/ProductReviewMother";
import { ProductMother } from "../../../../contexts/shop/products/domain/ProductMother";
import { UserMother } from "../../../../contexts/shop/users/domain/UserMother";

test.describe("Get product", () => {
	test("get an existing product", async ({ request }) => {
		const user1 = UserMother.create();
		const user2 = UserMother.create();
		const product = ProductMother.create();
		const primitives = product.toPrimitives();

		const review1 = ProductReviewMother.create({
			userId: user1.id.value,
			productId: product.id.value,
			rating: 5,
		});
		const review2 = ProductReviewMother.create({
			userId: user2.id.value,
			productId: product.id.value,
			rating: 4.5,
		});
		const reviewWithLowRating = ProductReviewMother.create({
			userId: user2.id.value,
			productId: product.id.value,
			rating: 3,
		});

		await givenThereIsAUser(user1);
		await givenThereIsAUser(user2);

		await givenThereIsAProduct(product);

		await givenThereIsAProductReview(request, review1);
		await givenThereIsAProductReview(request, review2);
		await givenThereIsAProductReview(request, reviewWithLowRating);

		// Not needed because rabbit is faster than the following http call
		// await new Promise((resolve) => setTimeout(resolve, 1000));

		await PlaywrightRequest(request).getExpecting(`/api/shop/products/${primitives.id}`, 200, {
			id: primitives.id,
			name: primitives.name,
			price: {
				amount: primitives.price.amount,
				currency: primitives.price.currency,
			},
			imageUrls: primitives.imageUrls,
			latestTopReviews: [
				{
					userName: user2.name.value,
					userProfilePictureUrl: user2.profilePicture.value,
					reviewRating: review2.rating.value,
					reviewComment: review2.comment.value,
				},
				{
					userName: user1.name.value,
					userProfilePictureUrl: user1.profilePicture.value,
					reviewRating: review1.rating.value,
					reviewComment: review1.comment.value,
				},
			],
		});
	});
});
