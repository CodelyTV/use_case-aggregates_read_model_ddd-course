import { isLeft } from "fp-ts/Either";
import * as t from "io-ts";
import { PathReporter } from "io-ts/PathReporter";
import { NextRequest, NextResponse } from "next/server";

import { Currency } from "../../../../../contexts/shared/domain/Money";
import { executeWithErrorHandling } from "../../../../../contexts/shared/infrastructure/http/executeWithErrorHandling";
import { HttpNextResponse } from "../../../../../contexts/shared/infrastructure/http/HttpNextResponse";
import { PostgresConnection } from "../../../../../contexts/shared/infrastructure/PostgresConnection";
import { ProductCreator } from "../../../../../contexts/shop/products/application/create/ProductCreator";
import { ProductFinder } from "../../../../../contexts/shop/products/application/find/ProductFinder";
import { ProductPrimitives } from "../../../../../contexts/shop/products/domain/Product";
import { ProductDoesNotExistError } from "../../../../../contexts/shop/products/domain/ProductDoesNotExistError";
import { PostgresProductRepository } from "../../../../../contexts/shop/products/infrastructure/PostgresProductRepository";

const CreateProductRequest = t.type({
	name: t.string,
	price_amount: t.number,
	price_currency: t.string,
	image_urls: t.array(t.string),
});

export async function PUT(
	request: NextRequest,
	{ params: { id } }: { params: { id: string } },
): Promise<Response> {
	const validatedRequest = CreateProductRequest.decode(await request.json());

	if (isLeft(validatedRequest)) {
		return HttpNextResponse.badRequest(
			`Invalid request: ${PathReporter.report(validatedRequest).join("\n")}`,
		);
	}

	const body = validatedRequest.right;

	const postgresConnection = new PostgresConnection();

	const creator = new ProductCreator(new PostgresProductRepository(postgresConnection));

	return executeWithErrorHandling(async () => {
		await creator.create(
			id,
			body.name,
			{ amount: body.price_amount, currency: body.price_currency as Currency },
			body.image_urls,
		);

		return HttpNextResponse.created();
	});
}

export async function GET(
	_request: Request,
	{ params: { id } }: { params: { id: string } },
): Promise<NextResponse<ProductPrimitives> | Response> {
	const postgresConnection = new PostgresConnection();

	const finder = new ProductFinder(new PostgresProductRepository(postgresConnection));

	return executeWithErrorHandling(
		async () => {
			const product = await finder.find(id);

			return HttpNextResponse.json(product);
		},
		(error: ProductDoesNotExistError) => {
			return HttpNextResponse.domainError(error, 404);
		},
	);
}
