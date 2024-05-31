import { ProductReviewsByProductSearcher } from "../../../../../../src/contexts/shop/product_reviews/application/search_by_product_id/ProductReviewsByProductSearcher";
import { ProductIdMother } from "../../../products/domain/ProductIdMother";
import { ProductReviewMother } from "../../domain/ProductReviewMother";
import { MockProductReviewRepository } from "../../infrastructure/MockProductReviewRepository";

describe("ProductReviewsByProductSearcher should", () => {
	const repository = new MockProductReviewRepository();
	const searcher = new ProductReviewsByProductSearcher(repository);

	it("returns empty when there are no reviews", async () => {
		const productId = ProductIdMother.create();

		repository.shouldSearchByProduct(productId, []);

		expect(await searcher.search(productId.value)).toEqual([]);
	});

	it("returns existing reviews", async () => {
		const productId = ProductIdMother.create();
		const existingReviews = ProductReviewMother.multipleForUser(productId);

		repository.shouldSearchByProduct(productId, existingReviews);

		expect(await searcher.search(productId.value)).toEqual(
			existingReviews.map((review) => review.toPrimitives()),
		);
	});
});
