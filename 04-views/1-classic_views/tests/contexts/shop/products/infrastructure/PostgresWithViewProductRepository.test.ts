import { PostgresConnection } from "../../../../../src/contexts/shared/infrastructure/PostgresConnection";
import { PostgresProductReviewRepository } from "../../../../../src/contexts/shop/product_reviews/infrastructure/PostgresProductReviewRepository";
import { PostgresWithViewProductRepository } from "../../../../../src/contexts/shop/products/infrastructure/PostgresWithViewProductRepository";
import { PostgresUserRepository } from "../../../../../src/contexts/shop/users/infrastructure/PostgresUserRepository";
import { ProductReviewMother } from "../../product_reviews/domain/ProductReviewMother";
import { UserMother } from "../../users/domain/UserMother";
import { ProductIdMother } from "../domain/ProductIdMother";
import { ProductMother } from "../domain/ProductMother";

describe("PostgresWithViewProductRepository should", () => {
	const connection = new PostgresConnection();

	const repository = new PostgresWithViewProductRepository(connection);

	const userRepository = new PostgresUserRepository(connection);
	const reviewRepository = new PostgresProductReviewRepository(connection);

	beforeEach(async () => {
		await connection.truncateAll();
	});

	it("save a product", async () => {
		const product = ProductMother.create();

		await repository.save(product);
	});

	it("return null searching a non existing product", async () => {
		const nonExistingProductId = ProductIdMother.create();

		expect(await repository.search(nonExistingProductId)).toBeNull();
	});

	it("return and existing product", async () => {
		const product = ProductMother.create();

		await repository.save(product);

		expect(await repository.search(product.id)).toEqual(product);
	});

	it("return and existing product with its top reviews", async () => {
		const productId = ProductIdMother.create();

		const user = UserMother.create();

		const topReview = ProductReviewMother.create({
			productId: productId.value,
			userId: user.id.value,
			rating: 4.5,
		});
		const lowReview = ProductReviewMother.create({
			productId: productId.value,
			userId: user.id.value,
			rating: 2.3,
		});

		const product = ProductMother.create({
			id: productId.value,
			latestTopReviews: [
				{
					userName: user.name.value,
					userProfilePictureUrl: user.profilePicture.value,
					reviewRating: topReview.rating.value,
					reviewComment: topReview.comment.value,
				},
			],
		});

		await repository.save(product);
		await userRepository.save(user);
		await reviewRepository.save(topReview);
		await reviewRepository.save(lowReview);

		expect(await repository.search(product.id)).toEqual(product);
	});
});
