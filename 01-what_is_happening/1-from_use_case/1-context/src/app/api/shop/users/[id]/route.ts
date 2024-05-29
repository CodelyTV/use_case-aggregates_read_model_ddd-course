import { Primitives } from "@codelytv/primitives-type";
import { isLeft } from "fp-ts/Either";
import * as t from "io-ts";
import { PathReporter } from "io-ts/PathReporter";
import { NextRequest, NextResponse } from "next/server";

import { DomainEventFailover } from "../../../../../contexts/shared/infrastructure/event_bus/failover/DomainEventFailover";
import { RabbitMqConnection } from "../../../../../contexts/shared/infrastructure/event_bus/rabbitmq/RabbitMqConnection";
import { RabbitMqEventBus } from "../../../../../contexts/shared/infrastructure/event_bus/rabbitmq/RabbitMqEventBus";
import { PostgresConnection } from "../../../../../contexts/shared/infrastructure/PostgresConnection";
import { UserRegistrar } from "../../../../../contexts/shop/users/application/registrar/UserRegistrar";
import { UserSearcher } from "../../../../../contexts/shop/users/application/search/UserSearcher";
import { User } from "../../../../../contexts/shop/users/domain/User";
import { PostgresUserRepository } from "../../../../../contexts/shop/users/infrastructure/PostgresUserRepository";

const CreateUserRequest = t.type({ name: t.string, email: t.string, profilePicture: t.string });

export async function PUT(
	request: NextRequest,
	{ params: { id } }: { params: { id: string } },
): Promise<Response> {
	const validatedRequest = CreateUserRequest.decode(await request.json());

	if (isLeft(validatedRequest)) {
		return new Response(`Invalid request: ${PathReporter.report(validatedRequest).join("\n")}`, {
			status: 400,
		});
	}

	const body = validatedRequest.right;

	const connection = new PostgresConnection();

	await new UserRegistrar(
		new PostgresUserRepository(connection),
		new RabbitMqEventBus(new RabbitMqConnection(), new DomainEventFailover(connection)),
	).registrar(id, body.name, body.email, body.profilePicture);

	return new Response("", { status: 201 });
}

export async function GET(
	_request: Request,
	{ params: { id } }: { params: { id: string } },
): Promise<NextResponse<Primitives<User>> | Response> {
	const searcher = new UserSearcher(new PostgresUserRepository(new PostgresConnection()));

	const user = await searcher.search(id);

	if (user === null) {
		return new Response("", { status: 404 });
	}

	return NextResponse.json(user);
}
