import { faker } from "@faker-js/faker";

import {
	Product,
	ProductPrimitives,
} from "../../../../../src/contexts/shop/products/domain/Product";
import { ProductIdMother } from "./ProductIdMother";
import { ProductNameMother } from "./ProductNameMother";

export class ProductMother {
	static create(params?: Partial<ProductPrimitives>): Product {
		const primitives: ProductPrimitives = {
			id: ProductIdMother.create().value,
			name: ProductNameMother.create().value,
			price: {
				amount: faker.number.float({ min: 1, max: 1000, multipleOf: 10 }),
				currency: faker.helpers.arrayElement(["USD", "EUR"]),
			},
			imageUrls: faker.helpers.multiple(() => faker.image.url(), {
				count: { min: 1, max: 5 },
			}),
			latestTopReviews: [],
			...params,
		};

		return Product.fromPrimitives(primitives);
	}

	static multiple(): Product[] {
		return faker.helpers.multiple(() => ProductMother.create(), {
			count: { min: 1, max: 5 },
		});
	}
}
