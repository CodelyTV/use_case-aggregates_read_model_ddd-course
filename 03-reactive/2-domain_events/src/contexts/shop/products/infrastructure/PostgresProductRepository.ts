import { Service } from "diod";

import { PostgresConnection } from "../../../shared/infrastructure/PostgresConnection";
import { Product } from "../domain/Product";
import { ProductId } from "../domain/ProductId";
import { ProductRepository } from "../domain/ProductRepository";

type DatabaseProduct = {
	id: string;
	name: string;
	price_amount: number;
	price_currency: "EUR" | "USD";
	image_urls: string[];
	latest_top_reviews: {
		userName: string;
		userProfilePictureUrl: string;
		reviewRating: number;
		reviewComment: string;
	}[];
};

@Service()
export class PostgresProductRepository implements ProductRepository {
	constructor(private readonly connection: PostgresConnection) {}

	async save(product: Product): Promise<void> {
		const productPrimitives = product.toPrimitives();

		await this.connection.execute(`
			INSERT INTO shop.products (id, name, price_amount, price_currency, image_urls, latest_top_reviews)
			VALUES (
				'${product.id.value}',
				'${product.name.value}',
				${product.price.amount},
				'${product.price.currency}',
				'{${product.imageUrls
					.toPrimitives()
					.map((url: string) => `"${url}"`)
					.join(",")}}',
				'${JSON.stringify(productPrimitives.latestTopReviews)}'
		   )
		   ON CONFLICT (id) DO UPDATE 
		   SET 
				name = EXCLUDED.name,
				price_amount = EXCLUDED.price_amount,
				price_currency = EXCLUDED.price_currency,
				image_urls = EXCLUDED.image_urls,
				latest_top_reviews = EXCLUDED.latest_top_reviews;
		`);
	}

	async search(id: ProductId): Promise<Product | null> {
		const query = `
SELECT id, name, price_amount, price_currency, image_urls, latest_top_reviews
FROM shop.products
WHERE id = '${id.value}';
		`;

		const product = await this.connection.searchOne<DatabaseProduct>(query);

		if (!product) {
			return null;
		}

		console.log(product);

		return Product.fromPrimitives({
			id: product.id,
			name: product.name,
			price: {
				amount: product.price_amount,
				currency: product.price_currency,
			},
			imageUrls: product.image_urls,
			latestTopReviews: product.latest_top_reviews ?? [],
		});
	}

	async searchAll(): Promise<Product[]> {
		const query = `
SELECT id, name, price_amount, price_currency, image_urls, latest_top_reviews
FROM shop.products;
		`;

		const result = await this.connection.searchAll<DatabaseProduct>(query);

		return result.map((product) =>
			Product.fromPrimitives({
				id: product.id,
				name: product.name,
				price: {
					amount: product.price_amount,
					currency: product.price_currency,
				},
				imageUrls: product.image_urls,
				latestTopReviews: product.latest_top_reviews ?? [],
			}),
		);
	}
}
