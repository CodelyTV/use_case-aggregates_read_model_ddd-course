import { ProductReviewsByProductSearcher } from "../../../../../../src/contexts/shop/product_reviews/application/search_by_product_id/ProductReviewsByProductSearcher";
import { ProductFinder } from "../../../../../../src/contexts/shop/products/application/find/ProductFinder";
import { ProductDoesNotExistError } from "../../../../../../src/contexts/shop/products/domain/ProductDoesNotExistError";
import { UserFinder } from "../../../../../../src/contexts/shop/users/application/find/UserFinder";
import { ProductReviewMother } from "../../../product_reviews/domain/ProductReviewMother";
import { MockProductReviewRepository } from "../../../product_reviews/infrastructure/MockProductReviewRepository";
import { UserMother } from "../../../users/domain/UserMother";
import { MockUserRepository } from "../../../users/infrastructure/MockUserRepository";
import { ProductIdMother } from "../../domain/ProductIdMother";
import { ProductMother } from "../../domain/ProductMother";
import { MockProductRepository } from "../../infrastructure/MockProductRepository";

describe("ProductFinder should", () => {
	const repository = new MockProductRepository();
	const reviewRepository = new MockProductReviewRepository();
	const userRepository = new MockUserRepository();

	const finder = new ProductFinder(
		repository,
		new ProductReviewsByProductSearcher(reviewRepository),
		new UserFinder(userRepository),
	);

	it("throw an error finding a non existing product", async () => {
		const productId = ProductIdMother.create();

		const expectedError = new ProductDoesNotExistError(productId.value);

		repository.shouldSearchAndReturnNull(productId);

		await expect(finder.find(productId.value)).rejects.toThrow(expectedError);
	});

	it("find an existing product", async () => {
		const product = ProductMother.create();

		const user1 = UserMother.create();
		const user2 = UserMother.create();
		const user3 = UserMother.create();

		const review1 = ProductReviewMother.create({
			productId: product.id.value,
			userId: user1.id.value,
			rating: 5,
		});
		const review2 = ProductReviewMother.create({
			productId: product.id.value,
			userId: user2.id.value,
			rating: 4.5,
		});
		const review3 = ProductReviewMother.create({
			productId: product.id.value,
			userId: user3.id.value,
			rating: 3,
		});

		repository.shouldSearch(product);
		reviewRepository.shouldSearchByProduct(product.id, [review1, review2, review3]);
		userRepository.shouldSearch(user1);
		userRepository.shouldSearch(user2);

		expect(await finder.find(product.id.value)).toEqual({
			...product.toPrimitives(),
			latestTopReviews: [
				{
					userName: user1.name.value,
					userProfilePictureUrl: user1.profilePicture.value,
					reviewRating: review1.rating.value,
					reviewComment: review1.comment.value,
				},

				{
					userName: user2.name.value,
					userProfilePictureUrl: user2.profilePicture.value,
					reviewRating: review2.rating.value,
					reviewComment: review2.comment.value,
				},
			],
		});
	});
});
