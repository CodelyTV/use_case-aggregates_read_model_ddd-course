import { Money } from "../../../shared/domain/Money";
import { ProductId } from "./ProductId";
import { ProductImageUrls } from "./ProductImageUrls";
import { ProductName } from "./ProductName";
import { ProductTopReview, ProductTopReviewPrimitives } from "./ProductTopReview";

export type ProductPrimitives = {
	id: string;
	name: string;
	price: {
		amount: number;
		currency: "EUR" | "USD";
	};
	imageUrls: string[];
	latestTopReviews: ProductTopReviewPrimitives[];
};

export class Product {
	constructor(
		public readonly id: ProductId,
		public readonly name: ProductName,
		public readonly price: Money,
		public readonly imageUrls: ProductImageUrls,
		public readonly latestTopReviews: ProductTopReview[],
	) {}

	static create(id: string, name: string, price: Money, imageUrls: string[]): Product {
		return Product.fromPrimitives({
			id,
			name,
			price,
			imageUrls,
			latestTopReviews: [],
		});
	}

	static fromPrimitives(primitives: ProductPrimitives): Product {
		return new Product(
			new ProductId(primitives.id),
			new ProductName(primitives.name),
			primitives.price,
			ProductImageUrls.fromPrimitives(primitives.imageUrls),
			primitives.latestTopReviews.map((review) => ProductTopReview.fromPrimitives(review)),
		);
	}

	toPrimitives(): ProductPrimitives {
		return {
			id: this.id.value,
			name: this.name.value,
			price: this.price,
			imageUrls: this.imageUrls.toPrimitives(),
			latestTopReviews: this.latestTopReviews.map((review) => review.toPrimitives()),
		};
	}
}
