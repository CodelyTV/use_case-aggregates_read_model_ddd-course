import { PostgresConnection } from "../../../shared/infrastructure/PostgresConnection";
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

export class PostgresProductRepository implements ProductRepository {
	constructor(private readonly connection: PostgresConnection) {}

	async search(id: ProductId): Promise<Product | null> {
		const query = `
	SELECT
		id,
		name,
		price_amount as amount,
		price_currency as currency,
		image_urls as imageUrls
	FROM shop.products
	WHERE id='${id.value}'
	GROUP BY id
  `;

		const result = await this.connection.searchOne<DatabaseProduct>(query);

		if (!result) {
			return null;
		}

		return new Product(
			result.id,
			result.name,
			{
				amount: result.amount,
				currency: result.currency,
			},
			result.image_urls,
		);
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

		return result.map((product) =>
			Product.fromPrimitives({
				id: product.id,
				name: product.name,
				price: {
					amount: product.amount,
					currency: product.currency,
				},
				imageUrls: product.image_urls,
			}),
		);
	}
}
