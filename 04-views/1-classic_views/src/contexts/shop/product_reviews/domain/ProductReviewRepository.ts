import { ProductId } from "../../products/domain/ProductId";
import { UserId } from "../../users/domain/UserId";
import { ProductReview } from "./ProductReview";

export interface ProductReviewRepository {
	save(review: ProductReview): Promise<void>;

	searchByProduct(productId: ProductId): Promise<ProductReview[]>;

	searchByUser(userId: UserId): Promise<ProductReview[]>;
}
