import { givenThereIsAUser } from "../../../../contexts/shared/infrastructure/playwright/Givens";
import { PlaywrightRequest } from "../../../../contexts/shared/infrastructure/playwright/PlaywrightRequest";
import { test } from "../../../../contexts/shared/infrastructure/playwright/PlaywrightTest";
import { UserMother } from "../../../../contexts/shop/users/domain/UserMother";

test.describe("Get user", () => {
	test("get an existing user", async ({ request }) => {
		const user = UserMother.create();
		const userPrimitives = user.toPrimitives();

		await givenThereIsAUser(user);

		await PlaywrightRequest(request).getExpecting(`/api/shop/users/${userPrimitives.id}`, 200, {
			id: userPrimitives.id,
			name: userPrimitives.name,
			email: userPrimitives.email,
			profilePicture: userPrimitives.profilePicture,
		});
	});
});
