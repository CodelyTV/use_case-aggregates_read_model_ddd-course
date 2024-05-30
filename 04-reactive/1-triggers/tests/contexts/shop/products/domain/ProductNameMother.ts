import { faker } from "@faker-js/faker";

import { ProductName } from "../../../../../src/contexts/shop/products/domain/ProductName";

export class ProductNameMother {
	static create(value?: string): ProductName {
		return new ProductName(value ?? faker.string.alphanumeric());
	}
}
