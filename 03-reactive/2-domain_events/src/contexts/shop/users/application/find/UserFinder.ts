import { Primitives } from "@codelytv/primitives-type/src";
import { Service } from "diod";

import { User } from "../../domain/User";
import { UserFinder as DomainUserFinder } from "../../domain/UserFinder";
import { UserRepository } from "../../domain/UserRepository";

@Service()
export class UserFinder {
	private readonly finder: DomainUserFinder;

	constructor(repository: UserRepository) {
		this.finder = new DomainUserFinder(repository);
	}

	async find(id: string): Promise<Primitives<User>> {
		return (await this.finder.find(id)).toPrimitives();
	}
}
