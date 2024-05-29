import { ProductPrimitives } from "../../domain/Product";
import { ProductRepository } from "../../domain/ProductRepository";

export class AllProductsSearcher {
	constructor(private readonly repository: ProductRepository) {}

	async search(): Promise<ProductPrimitives[]> {
		return (await this.repository.searchAll()).map((product) => product.toPrimitives());
	}
}
