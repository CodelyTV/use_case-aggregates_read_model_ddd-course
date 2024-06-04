import { PostgresConnection } from "../../../../../src/contexts/shared/infrastructure/PostgresConnection";
import { PostgresProductRepository } from "../../../../../src/contexts/shop/products/infrastructure/PostgresProductRepository";
import { ProductIdMother } from "../domain/ProductIdMother";
import { ProductMother } from "../domain/ProductMother";

describe("PostgresProductRepository should", () => {
	const repository = new PostgresProductRepository(new PostgresConnection());

	beforeEach(async () => {
		await new PostgresConnection().truncateAll();
	});

	it("save a product", async () => {
		const product = ProductMother.create();

		await repository.save(product);
	});

	it("return null searching a non existing product", async () => {
		const nonExistingProductId = ProductIdMother.create();

		expect(await repository.search(nonExistingProductId)).toBeNull();
	});

	it("return and existing product", async () => {
		const product = ProductMother.create();

		await repository.save(product);

		expect(await repository.search(product.id)).toEqual(product);
	});
});
