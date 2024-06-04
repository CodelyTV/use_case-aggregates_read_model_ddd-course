import { PostgresConnection } from "../../../shared/infrastructure/PostgresConnection";
import { Product } from "../domain/Product";
import { ProductId } from "../domain/ProductId";
import { ProductRepository } from "../domain/ProductRepository";

type DatabaseProduct = {
	id: string;
	name: string;
	amount: string;
	currency: "EUR" | "USD";
	image_urls: string[];
	latest_top_reviews: {
		userName: string;
		userProfilePictureUrl: string;
		reviewRating: number;
		reviewComment: string;
	}[];
};

export class PostgresWithMaterializedViewProductRepository implements ProductRepository {
	constructor(private readonly connection: PostgresConnection) {}

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
SELECT id, name, amount, currency, image_urls, latest_top_reviews
FROM shop.product_with_reviews_materialized
WHERE id = '${id.value}';
		`;

		const product = await this.connection.searchOne<DatabaseProduct>(query);

		if (!product) {
			return null;
		}

		return Product.fromPrimitives({
			id: product.id,
			name: product.name,
			price: {
				amount: parseFloat(product.amount),
				currency: product.currency,
			},
			imageUrls: product.image_urls,
			latestTopReviews: product.latest_top_reviews,
		});
	}

	async searchAll(): Promise<Product[]> {
		const query = `
SELECT id, name, amount, currency, image_urls, latest_top_reviews
FROM shop.product_with_reviews_materialized;
		`;

		const result = await this.connection.searchAll<DatabaseProduct>(query);

		return result.map((product) =>
			Product.fromPrimitives({
				id: product.id,
				name: product.name,
				price: {
					amount: parseFloat(product.amount),
					currency: product.currency,
				},
				imageUrls: product.image_urls,
				latestTopReviews: product.latest_top_reviews,
			}),
		);
	}
}
