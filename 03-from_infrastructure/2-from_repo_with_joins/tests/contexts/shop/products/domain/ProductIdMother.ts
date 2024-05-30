import { faker } from "@faker-js/faker";

import { ProductId } from "../../../../../src/contexts/shop/products/domain/ProductId";

export class ProductIdMother {
	static create(value?: string): ProductId {
		return new ProductId(value ?? faker.string.uuid());
	}
}
