import { ProductReview } from "../../../../../src/contexts/shop/product_reviews/domain/ProductReview";
import { ProductReviewRepository } from "../../../../../src/contexts/shop/product_reviews/domain/ProductReviewRepository";
import { ProductId } from "../../../../../src/contexts/shop/products/domain/ProductId";
import { UserId } from "../../../../../src/contexts/shop/users/domain/UserId";

export class MockProductReviewRepository implements ProductReviewRepository {
	private readonly mockSave = jest.fn();
	private readonly mockSearchByProduct = jest.fn();
	private readonly mockSearchByUser = jest.fn();

	async save(review: ProductReview): Promise<void> {
		expect(this.mockSave).toHaveBeenCalledWith(review.toPrimitives());

		return Promise.resolve();
	}

	async searchByProduct(productId: ProductId): Promise<ProductReview[]> {
		expect(this.mockSearchByProduct).toHaveBeenCalledWith(productId);

		return this.mockSearchByProduct() as Promise<ProductReview[]>;
	}

	async searchByUser(userId: UserId): Promise<ProductReview[]> {
		expect(this.mockSearchByUser).toHaveBeenCalledWith(userId);

		return this.mockSearchByUser() as Promise<ProductReview[]>;
	}

	shouldSave(review: ProductReview): void {
		this.mockSave(review.toPrimitives());
	}

	shouldSearchByProduct(productId: ProductId, reviews: ProductReview[]): void {
		this.mockSearchByProduct(productId);
		this.mockSearchByProduct.mockReturnValueOnce(reviews);
	}

	shouldSearchByUser(userId: UserId, reviews: ProductReview[]): void {
		this.mockSearchByUser(userId);
		this.mockSearchByUser.mockReturnValueOnce(reviews);
	}
}
