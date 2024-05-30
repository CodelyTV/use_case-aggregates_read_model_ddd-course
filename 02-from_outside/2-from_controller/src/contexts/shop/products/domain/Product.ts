import { Money } from "../../../shared/domain/Money";
import { ProductId } from "./ProductId";
import { ProductImageUrls } from "./ProductImageUrls";
import { ProductName } from "./ProductName";

export type ProductPrimitives = {
	id: string;
	name: string;
	price: {
		amount: number;
		currency: "EUR" | "USD";
	};
	imageUrls: string[];
};

export class Product {
	public readonly id: ProductId;
	public readonly name: ProductName;
	public readonly price: Money;
	public readonly imageUrls: ProductImageUrls;

	constructor(id: string, name: string, price: Money, imageUrls: string[]) {
		this.id = new ProductId(id);
		this.name = new ProductName(name);
		this.price = price;
		this.imageUrls = ProductImageUrls.fromPrimitives(imageUrls);
	}

	static create(id: string, name: string, price: Money, imageUrls: string[]): Product {
		return new Product(id, name, price, imageUrls);
	}

	static fromPrimitives(primitives: ProductPrimitives): Product {
		return new Product(primitives.id, primitives.name, primitives.price, primitives.imageUrls);
	}

	toPrimitives(): ProductPrimitives {
		return {
			id: this.id.value,
			name: this.name.value,
			price: {
				amount: this.price.amount,
				currency: this.price.currency,
			},
			imageUrls: this.imageUrls.toPrimitives(),
		};
	}
}
