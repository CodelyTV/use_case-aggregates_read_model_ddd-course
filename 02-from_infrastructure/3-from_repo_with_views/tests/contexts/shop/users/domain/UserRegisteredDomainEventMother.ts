import { Primitives } from "@codelytv/primitives-type";

import { User } from "../../../../../src/contexts/shop/users/domain/User";
import { UserRegisteredDomainEvent } from "../../../../../src/contexts/shop/users/domain/UserRegisteredDomainEvent";
import { UserEmailMother } from "./UserEmailMother";
import { UserIdMother } from "./UserIdMother";
import { UserNameMother } from "./UserNameMother";
import { UserProfilePictureMother } from "./UserProfilePictureMother";

export class UserRegisteredDomainEventMother {
	static create(params?: Partial<Primitives<User>>): UserRegisteredDomainEvent {
		const primitives: Primitives<User> = {
			id: UserIdMother.create().value,
			name: UserNameMother.create().value,
			email: UserEmailMother.create().value,
			profilePicture: UserProfilePictureMother.create().value,
			...params,
		};

		return new UserRegisteredDomainEvent(
			primitives.id,
			primitives.name,
			primitives.email,
			primitives.profilePicture,
		);
	}
}
