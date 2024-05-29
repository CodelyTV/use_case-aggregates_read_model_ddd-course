import { Primitives } from "@codelytv/primitives-type";

import { User } from "../../../../../src/contexts/shop/users/domain/User";
import { UserEmailMother } from "./UserEmailMother";
import { UserIdMother } from "./UserIdMother";
import { UserNameMother } from "./UserNameMother";
import { UserProfilePictureMother } from "./UserProfilePictureMother";

export class UserMother {
	static create(params?: Partial<Primitives<User>>): User {
		const primitives: Primitives<User> = {
			id: UserIdMother.create().value,
			name: UserNameMother.create().value,
			email: UserEmailMother.create().value,
			profilePicture: UserProfilePictureMother.create().value,
			...params,
		};

		return User.fromPrimitives(primitives);
	}
}
