import { NextResponse } from "next/server";

import { executeWithErrorHandling } from "../../../../../contexts/shared/infrastructure/http/executeWithErrorHandling";
import { HttpNextResponse } from "../../../../../contexts/shared/infrastructure/http/HttpNextResponse";
import { PostgresConnection } from "../../../../../contexts/shared/infrastructure/PostgresConnection";
import { ProductFinder } from "../../../../../contexts/shop/products/application/find/ProductFinder";
import { ProductPrimitives } from "../../../../../contexts/shop/products/domain/Product";
import { ProductDoesNotExistError } from "../../../../../contexts/shop/products/domain/ProductDoesNotExistError";
import { PostgresProductRepository } from "../../../../../contexts/shop/products/infrastructure/PostgresProductRepository";

export async function GET(
	_request: Request,
	{ params: { id } }: { params: { id: string } },
): Promise<NextResponse<ProductPrimitives> | Response> {
	const finder = new ProductFinder(new PostgresProductRepository(new PostgresConnection()));

	return executeWithErrorHandling(
		async () => {
			const product = finder.find(id);

			return HttpNextResponse.json(product);
		},
		(error: ProductDoesNotExistError) => {
			return HttpNextResponse.domainError(error, 404);
		},
	);
}
