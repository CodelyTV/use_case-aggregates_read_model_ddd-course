import { ProductReviewsByUserSearcher } from "../../../../../../src/contexts/shop/product_reviews/application/search_by_user_id/ProductReviewsByUserSearcher";
import { UserIdMother } from "../../../users/domain/UserIdMother";
import { ProductReviewMother } from "../../domain/ProductReviewMother";
import { MockProductReviewRepository } from "../../infrastructure/MockProductReviewRepository";

describe("ProductReviewsByUserSearcher should", () => {
	const repository = new MockProductReviewRepository();
	const searcher = new ProductReviewsByUserSearcher(repository);

	it("returns empty when there are no reviews", async () => {
		const userId = UserIdMother.create();

		repository.shouldSearchByUser(userId, []);

		expect(await searcher.search(userId.value)).toEqual([]);
	});

	it("returns existing reviews", async () => {
		const userId = UserIdMother.create();
		const existingReviews = ProductReviewMother.multipleForUser(userId);

		repository.shouldSearchByUser(userId, existingReviews);

		expect(await searcher.search(userId.value)).toEqual(
			existingReviews.map((review) => review.toPrimitives()),
		);
	});
});
