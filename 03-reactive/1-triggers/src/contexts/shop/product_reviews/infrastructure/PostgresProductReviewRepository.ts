import { PostgresConnection } from "../../../shared/infrastructure/PostgresConnection";
import { ProductId } from "../../products/domain/ProductId";
import { UserId } from "../../users/domain/UserId";
import { ProductReview } from "../domain/ProductReview";
import { ProductReviewRepository } from "../domain/ProductReviewRepository";

type DatabaseProductReview = {
	id: string;
	user_id: string;
	product_id: string;
	rating: number;
	comment: string;
};

export class PostgresProductReviewRepository implements ProductReviewRepository {
	constructor(private readonly connection: PostgresConnection) {}

	async save(review: ProductReview): Promise<void> {
		const query = `
		INSERT INTO shop.product_reviews (id, user_id, product_id, rating, comment)
		VALUES (
			'${review.id.value}',
			'${review.userId.value}',
			'${review.productId.value}',
			${review.rating.value},
			'${review.comment.value}'
		);`;

		await this.connection.execute(query);
	}

	async searchByProduct(productId: ProductId): Promise<ProductReview[]> {
		const query = `
		SELECT
			r.id,
			r.user_id ,
			r.product_id ,
			r.rating,
			r.comment
		FROM shop.product_reviews r
		WHERE r.product_id = '${productId.value}'
		ORDER BY r.rating DESC
	`;

		const result = await this.connection.searchAll<DatabaseProductReview>(query);

		return result.map((productReview) =>
			ProductReview.fromPrimitives({
				id: productReview.id,
				userId: productReview.user_id,
				productId: productReview.product_id,
				rating: productReview.rating,
				comment: productReview.comment,
			}),
		);
	}

	async searchByUser(userId: UserId): Promise<ProductReview[]> {
		const query = `
		SELECT
			r.id,
			r.user_id as userId,
			r.product_id as productId,
			r.rating,
			r.comment
		FROM shop.product_reviews r
		WHERE r.user_id = '${userId.value}'
	`;

		const result = await this.connection.searchAll<DatabaseProductReview>(query);

		return result.map((productReview) =>
			ProductReview.fromPrimitives({
				id: productReview.id,
				userId: productReview.user_id,
				productId: productReview.product_id,
				rating: productReview.rating,
				comment: productReview.comment,
			}),
		);
	}
}
