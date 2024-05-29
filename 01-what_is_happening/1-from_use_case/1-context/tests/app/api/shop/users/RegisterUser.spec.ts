import { PlaywrightRequest } from "../../../../contexts/shared/infrastructure/playwright/PlaywrightRequest";
import { expect, test } from "../../../../contexts/shared/infrastructure/playwright/PlaywrightTest";
import { UserMother } from "../../../../contexts/shop/users/domain/UserMother";

test.describe("Register user", () => {
	test("register a valid user", async ({ request }) => {
		const user = UserMother.create().toPrimitives();

		const response = await PlaywrightRequest(request).put(`/api/shop/users/${user.id}`, {
			name: user.name,
			email: user.email,
			profilePicture: user.profilePicture,
		});

		expect(response.status()).toBe(201);
	});
});
