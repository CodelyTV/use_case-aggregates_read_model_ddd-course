import { Service } from "diod";

import { UserFinder } from "../../../users/application/find/UserFinder";
import { DomainProductFinder } from "../../domain/DomainProductFinder";
import { ProductRepository } from "../../domain/ProductRepository";

@Service()
export class ProductLatestTopReviewsUpdater {
	private readonly minRatingForTopReview = 4;

	constructor(
		private readonly finder: DomainProductFinder,
		private readonly userFinder: UserFinder,
		private readonly repository: ProductRepository,
	) {}

	async update(productId: string, userId: string, rating: number, comment: string): Promise<void> {
		const product = await this.finder.find(productId);

		if (rating >= this.minRatingForTopReview) {
			const user = await this.userFinder.find(userId);

			product.addLatestTopReviews(user.name, user.profilePicture, rating, comment);

			await this.repository.save(product);
		}
	}
}
