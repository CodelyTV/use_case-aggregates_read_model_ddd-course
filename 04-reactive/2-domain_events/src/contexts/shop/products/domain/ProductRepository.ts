import { Product } from "./Product";
import { ProductId } from "./ProductId";

export abstract class ProductRepository {
	abstract search(id: ProductId): Promise<Product | null>;

	abstract searchAll(): Promise<Product[]>;

	abstract save(product: Product): Promise<void>;
}
