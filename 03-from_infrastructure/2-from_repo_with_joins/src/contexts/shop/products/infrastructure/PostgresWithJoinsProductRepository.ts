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
	latest_top_reviews: {
		userName: string;
		userProfilePictureUrl: string;
		reviewRating: number;
		reviewComment: string;
	}[];
};

export class PostgresWithJoinsProductRepository implements ProductRepository {
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
	SELECT 
	    p.id,
	    p.name,
	    p.price_amount AS amount,
	    p.price_currency AS currency,
	    p.image_urls,
	    COALESCE(
	        json_agg(
	            json_build_object(
	                'userName', u.name,
	                'userProfilePictureUrl', u.profile_picture,
	                'reviewRating', r.rating,
	                'reviewComment', r.comment
	            ) ORDER BY r.rating DESC
	        ) FILTER (WHERE r.id IS NOT NULL AND r.rating >= 4), '[]'
	    ) AS latest_top_reviews
	FROM 
	    shop.products p
	LEFT JOIN 
	    shop.product_reviews r ON p.id = r.product_id
	LEFT JOIN 
	    shop.users u ON r.user_id = u.id
	WHERE p.id = '${id.value}'
	GROUP BY 
	    p.id;
		`;

		const product = await this.connection.searchOne<DatabaseProduct>(query);

		if (!product) {
			return null;
		}

		return Product.fromPrimitives({
			id: product.id,
			name: product.name,
			price: {
				amount: product.amount,
				currency: product.currency,
			},
			imageUrls: product.image_urls,
			latestTopReviews: product.latest_top_reviews,
		});
	}

	async searchAll(): Promise<Product[]> {
		const query = `
            SELECT 
                p.id,
                p.name,
                p.price_amount AS amount,
                p.price_currency AS currency,
                p.image_urls,
                COALESCE(
                    json_agg(
                        json_build_object(
                            'userName', u.name,
                            'userProfilePictureUrl', u.profile_picture,
                            'reviewRating', r.rating,
                            'reviewComment', r.comment
                        ) ORDER BY r.rating DESC
                    ) FILTER (WHERE r.id IS NOT NULL AND r.rating >= 4), '[]'
                ) AS latest_top_reviews
            FROM 
                shop.products p
            LEFT JOIN 
                shop.product_reviews r ON p.id = r.product_id
            LEFT JOIN 
                shop.users u ON r.user_id = u.id
            GROUP BY 
                p.id;
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
				latestTopReviews: product.latest_top_reviews,
			}),
		);
	}
}
