import { Primitives } from "@codelytv/primitives-type";
import { isLeft } from "fp-ts/Either";
import * as t from "io-ts";
import { PathReporter } from "io-ts/PathReporter";
import { NextRequest, NextResponse } from "next/server";

import { DomainEventFailover } from "../../../../../contexts/shared/infrastructure/event_bus/failover/DomainEventFailover";
import { RabbitMqConnection } from "../../../../../contexts/shared/infrastructure/event_bus/rabbitmq/RabbitMqConnection";
import { RabbitMqEventBus } from "../../../../../contexts/shared/infrastructure/event_bus/rabbitmq/RabbitMqEventBus";
import { executeWithErrorHandling } from "../../../../../contexts/shared/infrastructure/http/executeWithErrorHandling";
import { HttpNextResponse } from "../../../../../contexts/shared/infrastructure/http/HttpNextResponse";
import { PostgresConnection } from "../../../../../contexts/shared/infrastructure/PostgresConnection";
import { UserFinder } from "../../../../../contexts/shop/users/application/find/UserFinder";
import { UserRegistrar } from "../../../../../contexts/shop/users/application/registrar/UserRegistrar";
import { User } from "../../../../../contexts/shop/users/domain/User";
import { UserDoesNotExistError } from "../../../../../contexts/shop/users/domain/UserDoesNotExistError";
import { PostgresUserRepository } from "../../../../../contexts/shop/users/infrastructure/PostgresUserRepository";

const CreateUserRequest = t.type({ name: t.string, email: t.string, profilePicture: t.string });

export async function PUT(
	request: NextRequest,
	{ params: { id } }: { params: { id: string } },
): Promise<Response> {
	const validatedRequest = CreateUserRequest.decode(await request.json());

	if (isLeft(validatedRequest)) {
		return HttpNextResponse.badRequest(
			`Invalid request: ${PathReporter.report(validatedRequest).join("\n")}`,
		);
	}

	const body = validatedRequest.right;

	const connection = new PostgresConnection();

	const registrar = new UserRegistrar(
		new PostgresUserRepository(connection),
		new RabbitMqEventBus(new RabbitMqConnection(), new DomainEventFailover(connection)),
	);

	return executeWithErrorHandling(async () => {
		await registrar.registrar(id, body.name, body.email, body.profilePicture);

		return HttpNextResponse.created();
	});
}

export async function GET(
	_request: Request,
	{ params: { id } }: { params: { id: string } },
): Promise<NextResponse<Primitives<User>> | Response> {
	const finder = new UserFinder(new PostgresUserRepository(new PostgresConnection()));

	return executeWithErrorHandling(
		async () => {
			const product = finder.find(id);

			return HttpNextResponse.json(product);
		},
		(error: UserDoesNotExistError) => {
			return HttpNextResponse.domainError(error, 404);
		},
	);
}
