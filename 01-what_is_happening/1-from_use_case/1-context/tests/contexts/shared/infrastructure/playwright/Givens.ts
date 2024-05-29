import { PostgresConnection } from "../../../../../src/contexts/shared/infrastructure/PostgresConnection";
import { Product } from "../../../../../src/contexts/shop/products/domain/Product";
import { PostgresProductRepository } from "../../../../../src/contexts/shop/products/infrastructure/PostgresProductRepository";
import { User } from "../../../../../src/contexts/shop/users/domain/User";
import { PostgresUserRepository } from "../../../../../src/contexts/shop/users/infrastructure/PostgresUserRepository";

const connection = new PostgresConnection();
const userRepository = new PostgresUserRepository(connection);
const productRepository = new PostgresProductRepository(connection);

export async function givenThereIsAUser(user: User): Promise<void> {
	await userRepository.save(user);
}

export async function givenThereIsAProduct(product: Product): Promise<void> {
	await productRepository.save(product);
}
