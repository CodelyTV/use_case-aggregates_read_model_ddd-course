import { Service } from "diod";

import { ProductPrimitives } from "../../domain/Product";
import { ProductDoesNotExistError } from "../../domain/ProductDoesNotExistError";
import { ProductId } from "../../domain/ProductId";
import { ProductRepository } from "../../domain/ProductRepository";

@Service()
export class ProductFinder {
	constructor(private readonly repository: ProductRepository) {}

	async find(id: string): Promise<ProductPrimitives> {
		const product = await this.repository.search(new ProductId(id));

		if (product === null) {
			throw new ProductDoesNotExistError(id);
		}

		return product.toPrimitives();
	}
}
