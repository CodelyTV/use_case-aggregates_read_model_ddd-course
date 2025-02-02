import { Collection } from "../../../shared/domain/Collection";
import { ProductImageUrl } from "./ProductImageUrl";

export class ProductImageUrls extends Collection<ProductImageUrl> {
	static fromPrimitives(imageUrls: string[]): ProductImageUrls {
		return new ProductImageUrls(imageUrls.map((imageUrl) => new ProductImageUrl(imageUrl)));
	}

	toPrimitives(): string[] {
		return this.value.map((imageUrl) => imageUrl.value);
	}
}
