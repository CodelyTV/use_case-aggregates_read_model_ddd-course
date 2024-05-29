import { ProductPrimitives } from "../../domain/Product";
import { ProductId } from "../../domain/ProductId";
import { ProductRepository } from "../../domain/ProductRepository";

export class ProductSearcher {
	constructor(private readonly repository: ProductRepository) {}

	async search(id: string): Promise<ProductPrimitives | null> {
		const product = await this.repository.search(new ProductId(id));

		return product?.toPrimitives() ?? null;
	}
}
