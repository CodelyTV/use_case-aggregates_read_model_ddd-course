import { ProductId } from "../../products/domain/ProductId";
import { UserId } from "../../users/domain/UserId";
import { ProductReview } from "./ProductReview";

export abstract class ProductReviewRepository {
	abstract save(review: ProductReview): Promise<void>;

	abstract searchByProduct(productId: ProductId): Promise<ProductReview[]>;

	abstract searchByUser(userId: UserId): Promise<ProductReview[]>;
}
