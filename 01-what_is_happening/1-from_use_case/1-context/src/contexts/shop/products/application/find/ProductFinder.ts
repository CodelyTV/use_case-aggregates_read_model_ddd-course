import { ProductPrimitives } from "../../domain/Product";
import { ProductDoesNotExistError } from "../../domain/ProductDoesNotExistError";
import { ProductId } from "../../domain/ProductId";
import { ProductRepository } from "../../domain/ProductRepository";

export class ProductFinder {
	constructor(private readonly repository: ProductRepository) {}

	async find(id: string): Promise<ProductPrimitives | null> {
		const product = await this.repository.search(new ProductId(id));

		if (product === null) {
			throw new ProductDoesNotExistError(id);
		}

		return product.toPrimitives();
	}
}
