import { ProductSearcher } from "../../../../../../src/contexts/shop/products/application/search/ProductSearcher";
import { ProductIdMother } from "../../domain/ProductIdMother";
import { ProductMother } from "../../domain/ProductMother";
import { MockProductRepository } from "../../infrastructure/MockProductRepository";

describe("ProductSearcher should", () => {
	const repository = new MockProductRepository();
	const searcher = new ProductSearcher(repository);

	it("returns null searching a non existing product", async () => {
		const productId = ProductIdMother.create();

		repository.shouldSearchAndReturnNull(productId);

		expect(await searcher.search(productId.value)).toBeNull();
	});

	it("find an existing product", async () => {
		const existingProduct = ProductMother.create();

		repository.shouldSearch(existingProduct);

		expect(await searcher.search(existingProduct.id.value)).toEqual(existingProduct.toPrimitives());
	});
});
