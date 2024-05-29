import { PostgresConnection } from "../../../shared/infrastructure/PostgresConnection";
import { ProductReviewRepository } from "../../product_reviews/domain/ProductReviewRepository";
import { UserDoesNotExistError } from "../../users/domain/UserDoesNotExistError";
import { UserRepository } from "../../users/domain/UserRepository";
import { Product } from "../domain/Product";
import { ProductId } from "../domain/ProductId";
import { ProductRepository } from "../domain/ProductRepository";

type DatabaseProduct = {
	id: string;
	name: string;
	amount: number;
	currency: "EUR" | "USD";
	image_urls: string[];
};

export class PostgresWithOtherRepositoriesProductRepository implements ProductRepository {
	constructor(
		private readonly connection: PostgresConnection,
		private readonly reviewRepository: ProductReviewRepository,
		private readonly userRepository: UserRepository,
	) {}

	async save(product: Product): Promise<void> {
		await this.connection.execute(`
INSERT INTO shop.products (id, name, price_amount, price_currency, image_urls)
VALUES (
	'${product.id.value}',
	'${product.name.value}',
	${product.price.amount},
	'${product.price.currency}',
	'{${product.imageUrls
		.toPrimitives()
		.map((url: string) => `"${url}"`)
		.join(",")}}'
)
`);
	}

	async search(id: ProductId): Promise<Product | null> {
		const query = `
	SELECT
		id,
		name,
		price_amount as amount,
		price_currency as currency,
		image_urls
	FROM shop.products
	WHERE id='${id.value}'
	GROUP BY id
  `;

		const product = await this.connection.searchOne<DatabaseProduct>(query);

		if (!product) {
			return null;
		}

		const reviewsWithUserData = await this.searchLatestTopReviews(id);

		return Product.fromPrimitives({
			id: product.id,
			name: product.name,
			price: {
				amount: product.amount,
				currency: product.currency,
			},
			imageUrls: product.image_urls,
			latestTopReviews: reviewsWithUserData,
		});
	}

	async searchAll(): Promise<Product[]> {
		const query = `
            SELECT
                id,
                name,
                price_amount as amount,
                price_currency as currency,
                image_urls
            FROM shop.products
            GROUP BY id
	`;

		const result = await this.connection.searchAll<DatabaseProduct>(query);

		const products = result.map(async (product) =>
			Product.fromPrimitives({
				id: product.id,
				name: product.name,
				price: {
					amount: product.amount,
					currency: product.currency,
				},
				imageUrls: product.image_urls,
				latestTopReviews: await this.searchLatestTopReviews(new ProductId(product.id)),
			}),
		);

		return await Promise.all(products);
	}

	private async searchLatestTopReviews(id: ProductId) {
		const reviews = await this.reviewRepository.searchByProduct(id);
		const topReviews = reviews.filter((review) => review.rating.value >= 4).slice(0, 3);

		const reviewsWithUserData = topReviews.map(async (review) => {
			const user = await this.userRepository.search(review.userId);

			if (!user) {
				throw new UserDoesNotExistError(review.userId.value);
			}

			return {
				userName: user.name.value,
				userProfilePictureUrl: user.profilePicture.value,
				reviewRating: review.rating.value,
				reviewComment: review.comment.value,
			};
		});

		return await Promise.all(reviewsWithUserData);
	}
}
