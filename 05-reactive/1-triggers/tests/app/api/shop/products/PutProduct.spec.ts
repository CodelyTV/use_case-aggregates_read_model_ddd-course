import { PlaywrightRequest } from "../../../../contexts/shared/infrastructure/playwright/PlaywrightRequest";
import { expect, test } from "../../../../contexts/shared/infrastructure/playwright/PlaywrightTest";
import { ProductMother } from "../../../../contexts/shop/products/domain/ProductMother";

test.describe("Put product", () => {
	test("create a valid product", async ({ request }) => {
		const product = ProductMother.create().toPrimitives();

		const response = await PlaywrightRequest(request).put(`/api/shop/products/${product.id}`, {
			name: product.name,
			price_amount: product.price.amount,
			price_currency: product.price.currency,
			image_urls: product.imageUrls,
		});

		expect(response.status()).toBe(201);
	});
});
