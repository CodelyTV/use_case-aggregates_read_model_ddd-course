import { Service } from "diod";

import { Product } from "./Product";
import { ProductDoesNotExistError } from "./ProductDoesNotExistError";
import { ProductId } from "./ProductId";
import { ProductRepository } from "./ProductRepository";

@Service()
export class DomainProductFinder {
	constructor(private readonly repository: ProductRepository) {}

	async find(id: string): Promise<Product> {
		const product = await this.repository.search(new ProductId(id));

		if (product === null) {
			throw new ProductDoesNotExistError(id);
		}

		return product;
	}
}
