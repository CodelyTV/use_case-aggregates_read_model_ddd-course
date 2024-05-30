import { AllProductsSearcher } from "../../../../../../src/contexts/shop/products/application/search_all/AllProductsSearcher";
import { ProductMother } from "../../domain/ProductMother";
import { MockProductRepository } from "../../infrastructure/MockProductRepository";

describe("AllProductsSearcher should", () => {
	const repository = new MockProductRepository();
	const searcher = new AllProductsSearcher(repository);

	it("returns empty when there are no products", async () => {
		repository.shouldSearchAll([]);

		expect(await searcher.search()).toEqual([]);
	});

	it("search all existing products", async () => {
		const existingProducts = ProductMother.multiple();

		repository.shouldSearchAll(existingProducts);

		expect(await searcher.search()).toEqual(
			existingProducts.map((product) => product.toPrimitives()),
		);
	});
});
