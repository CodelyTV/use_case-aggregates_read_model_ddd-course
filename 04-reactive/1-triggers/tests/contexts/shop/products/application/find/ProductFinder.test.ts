import { ProductFinder } from "../../../../../../src/contexts/shop/products/application/find/ProductFinder";
import { ProductDoesNotExistError } from "../../../../../../src/contexts/shop/products/domain/ProductDoesNotExistError";
import { ProductIdMother } from "../../domain/ProductIdMother";
import { ProductMother } from "../../domain/ProductMother";
import { MockProductRepository } from "../../infrastructure/MockProductRepository";

describe("ProductFinder should", () => {
	const repository = new MockProductRepository();
	const finder = new ProductFinder(repository);

	it("throw an error finding a non existing product", async () => {
		const productId = ProductIdMother.create();

		const expectedError = new ProductDoesNotExistError(productId.value);

		repository.shouldSearchAndReturnNull(productId);

		await expect(finder.find(productId.value)).rejects.toThrow(expectedError);
	});

	it("find an existing product", async () => {
		const existingProduct = ProductMother.create();

		repository.shouldSearch(existingProduct);

		expect(await finder.find(existingProduct.id.value)).toEqual(existingProduct.toPrimitives());
	});
});
