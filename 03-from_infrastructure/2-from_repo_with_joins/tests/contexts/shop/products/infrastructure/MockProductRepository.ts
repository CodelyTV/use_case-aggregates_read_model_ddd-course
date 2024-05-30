import { Product } from "../../../../../src/contexts/shop/products/domain/Product";
import { ProductId } from "../../../../../src/contexts/shop/products/domain/ProductId";
import { ProductRepository } from "../../../../../src/contexts/shop/products/domain/ProductRepository";

export class MockProductRepository implements ProductRepository {
	private readonly mockSave = jest.fn();
	private readonly mockSearch = jest.fn();
	private readonly mockSearchAll = jest.fn();

	async save(product: Product): Promise<void> {
		expect(this.mockSave).toHaveBeenCalledWith(product.toPrimitives());

		return Promise.resolve();
	}

	async search(id: ProductId): Promise<Product | null> {
		expect(this.mockSearch).toHaveBeenCalledWith(id);

		return this.mockSearch() as Promise<Product | null>;
	}

	async searchAll(): Promise<Product[]> {
		expect(this.mockSearchAll).toHaveBeenCalled();

		return this.mockSearchAll() as Promise<Product[]>;
	}

	shouldSave(product: Product): void {
		this.mockSave(product.toPrimitives());
	}

	shouldSearch(product: Product): void {
		this.mockSearch(product.id);
		this.mockSearch.mockReturnValueOnce(product);
	}

	shouldSearchAll(products: Product[]): void {
		this.mockSearchAll();
		this.mockSearchAll.mockReturnValueOnce(products);
	}

	shouldSearchAndReturnNull(id: ProductId): void {
		this.mockSearch(id);
		this.mockSearch.mockReturnValueOnce(null);
	}
}
