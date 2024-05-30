import { Product } from "./Product";
import { ProductId } from "./ProductId";

export interface ProductRepository {
	search(id: ProductId): Promise<Product | null>;

	searchAll(): Promise<Product[]>;

	save(product: Product): Promise<void>;
}
