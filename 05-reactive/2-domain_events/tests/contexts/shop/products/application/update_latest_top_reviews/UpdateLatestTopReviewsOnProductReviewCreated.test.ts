import { ProductLatestTopReviewsUpdater } from "../../../../../../src/contexts/shop/products/application/update_latest_top_reviews/ProductLatestTopReviewsUpdater";
import { UpdateLatestTopReviewsOnProductReviewCreated } from "../../../../../../src/contexts/shop/products/application/update_latest_top_reviews/UpdateLatestTopReviewsOnProductReviewCreated";
import { DomainProductFinder } from "../../../../../../src/contexts/shop/products/domain/DomainProductFinder";
import { ProductDoesNotExistError } from "../../../../../../src/contexts/shop/products/domain/ProductDoesNotExistError";
import { UserFinder } from "../../../../../../src/contexts/shop/users/application/find/UserFinder";
import { ProductReviewCreatedDomainEventMother } from "../../../product_reviews/domain/ProductReviewCreatedDomainEventMother";
import { UserMother } from "../../../users/domain/UserMother";
import { MockUserRepository } from "../../../users/infrastructure/MockUserRepository";
import { ProductIdMother } from "../../domain/ProductIdMother";
import { ProductMother } from "../../domain/ProductMother";
import { MockProductRepository } from "../../infrastructure/MockProductRepository";

describe("UpdateLatestTopReviewsOnProductReviewCreated should", () => {
	const repository = new MockProductRepository();
	const userRepository = new MockUserRepository();
	const subscriber = new UpdateLatestTopReviewsOnProductReviewCreated(
		new ProductLatestTopReviewsUpdater(
			new DomainProductFinder(repository),
			new UserFinder(userRepository),
			repository,
		),
	);

	it("throws an error updating a non existing product", async () => {
		const event = ProductReviewCreatedDomainEventMother.create();

		repository.shouldSearchAndReturnNull(ProductIdMother.create(event.productId));

		await expect(subscriber.on(event)).rejects.toThrow(
			new ProductDoesNotExistError(event.productId),
		);
	});

	it("not add a non top review", async () => {
		const event = ProductReviewCreatedDomainEventMother.create({ rating: 3 });

		const product = ProductMother.create({ id: event.productId });

		repository.shouldSearch(product);

		await subscriber.on(event);
	});

	it("add a top review", async () => {
		const event = ProductReviewCreatedDomainEventMother.create({ rating: 5 });

		const product = ProductMother.create({ id: event.productId });
		const user = UserMother.create({ id: event.userId });

		const productWithReview = ProductMother.create({
			...product.toPrimitives(),
			latestTopReviews: [
				{
					userName: user.name.value,
					userProfilePictureUrl: user.profilePicture.value,
					reviewRating: event.rating,
					reviewComment: event.comment,
				},
			],
		});

		repository.shouldSearch(product);
		userRepository.shouldSearch(user);
		repository.shouldSave(productWithReview);

		await subscriber.on(event);
	});
});
