import { ProductReviewsByProductSearcher } from "../../../product_reviews/application/search_by_product_id/ProductReviewsByProductSearcher";
import { UserFinder } from "../../../users/application/find/UserFinder";
import { ProductPrimitives } from "../../domain/Product";
import { ProductDoesNotExistError } from "../../domain/ProductDoesNotExistError";
import { ProductId } from "../../domain/ProductId";
import { ProductRepository } from "../../domain/ProductRepository";

type ProductPrimitivesWithLatest = ProductPrimitives & {
	latestTopReviews: {
		userName: string;
		userProfilePictureUrl: string;
		reviewRating: number;
		reviewComment: string;
	}[];
};

export class ProductFinder {
	constructor(
		private readonly repository: ProductRepository,
		private readonly reviewsSearcher: ProductReviewsByProductSearcher,
		private readonly userFinder: UserFinder,
	) {}

	async find(id: string): Promise<ProductPrimitivesWithLatest | null> {
		const product = await this.repository.search(new ProductId(id));

		if (product === null) {
			throw new ProductDoesNotExistError(id);
		}

		const reviews = await this.reviewsSearcher.search(id);
		const topReviews = reviews.filter((review) => review.rating >= 4).slice(0, 3);

		const reviewsWithUserData = topReviews.map(async (review) => {
			const user = await this.userFinder.find(review.userId);

			return {
				userName: user.name,
				userProfilePictureUrl: user.profilePicture,
				reviewRating: review.rating,
				reviewComment: review.comment,
			};
		});

		return {
			...product.toPrimitives(),
			latestTopReviews: await Promise.all(reviewsWithUserData),
		};
	}
}
