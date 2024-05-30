import { givenThereIsAProduct } from "../../../../contexts/shared/infrastructure/playwright/Givens";
import { PlaywrightRequest } from "../../../../contexts/shared/infrastructure/playwright/PlaywrightRequest";
import { test } from "../../../../contexts/shared/infrastructure/playwright/PlaywrightTest";
import { ProductMother } from "../../../../contexts/shop/products/domain/ProductMother";

test.describe("Get product", () => {
	test("get an existing product", async ({ request }) => {
		const product = ProductMother.create();
		const primitives = product.toPrimitives();

		await givenThereIsAProduct(product);

		await PlaywrightRequest(request).getExpecting(`/api/shop/products/${primitives.id}`, 200, {
			id: primitives.id,
			name: primitives.name,
			price: {
				amount: primitives.price.amount.toString(),
				currency: primitives.price.currency,
			},
			imageUrls: primitives.imageUrls,
		});
	});
});
