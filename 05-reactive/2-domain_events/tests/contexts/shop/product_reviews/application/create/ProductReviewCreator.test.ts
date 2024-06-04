import { ProductReviewCreator } from "../../../../../../src/contexts/shop/product_reviews/application/create/ProductReviewCreator";
import { ProductFinder } from "../../../../../../src/contexts/shop/products/application/find/ProductFinder";
import { ProductDoesNotExistError } from "../../../../../../src/contexts/shop/products/domain/ProductDoesNotExistError";
import { UserFinder } from "../../../../../../src/contexts/shop/users/application/find/UserFinder";
import { UserDoesNotExistError } from "../../../../../../src/contexts/shop/users/domain/UserDoesNotExistError";
import { MockEventBus } from "../../../../shared/infrastructure/MockEventBus";
import { ProductMother } from "../../../products/domain/ProductMother";
import { MockProductRepository } from "../../../products/infrastructure/MockProductRepository";
import { UserMother } from "../../../users/domain/UserMother";
import { MockUserRepository } from "../../../users/infrastructure/MockUserRepository";
import { ProductReviewCreatedDomainEventMother } from "../../domain/ProductReviewCreatedDomainEventMother";
import { ProductReviewMother } from "../../domain/ProductReviewMother";
import { MockProductReviewRepository } from "../../infrastructure/MockProductReviewRepository";

describe("ProductReviewCreator should", () => {
	const userRepository = new MockUserRepository();
	const productRepository = new MockProductRepository();
	const repository = new MockProductReviewRepository();
	const eventBus = new MockEventBus();

	const creator = new ProductReviewCreator(
		new UserFinder(userRepository),
		new ProductFinder(productRepository),
		repository,
		eventBus,
	);

	it("throws an error creating a review with a non existing user", async () => {
		const review = ProductReviewMother.create();
		const reviewPrimitives = review.toPrimitives();

		userRepository.shouldSearchAndReturnNull(review.userId);

		await expect(
			creator.create(
				reviewPrimitives.id,
				reviewPrimitives.userId,
				reviewPrimitives.productId,
				reviewPrimitives.rating,
				reviewPrimitives.comment,
			),
		).rejects.toThrow(new UserDoesNotExistError(reviewPrimitives.userId));
	});

	it("throws an error creating a review for a non existing product", async () => {
		const review = ProductReviewMother.create();
		const reviewPrimitives = review.toPrimitives();

		const user = UserMother.create({ id: reviewPrimitives.userId });

		userRepository.shouldSearch(user);
		productRepository.shouldSearchAndReturnNull(review.productId);

		await expect(
			creator.create(
				reviewPrimitives.id,
				reviewPrimitives.userId,
				reviewPrimitives.productId,
				reviewPrimitives.rating,
				reviewPrimitives.comment,
			),
		).rejects.toThrow(new ProductDoesNotExistError(reviewPrimitives.productId));
	});

	it("create a valid review", async () => {
		const review = ProductReviewMother.create();
		const reviewPrimitives = review.toPrimitives();

		const user = UserMother.create({ id: reviewPrimitives.userId });
		const product = ProductMother.create({ id: reviewPrimitives.productId });

		const expectedEvent = ProductReviewCreatedDomainEventMother.create({
			id: reviewPrimitives.id,
			userId: reviewPrimitives.userId,
			productId: reviewPrimitives.productId,
			rating: reviewPrimitives.rating,
			comment: reviewPrimitives.comment,
		});

		userRepository.shouldSearch(user);
		productRepository.shouldSearch(product);

		repository.shouldSave(review);
		eventBus.shouldPublish([expectedEvent]);

		await creator.create(
			reviewPrimitives.id,
			reviewPrimitives.userId,
			reviewPrimitives.productId,
			reviewPrimitives.rating,
			reviewPrimitives.comment,
		);
	});
});
