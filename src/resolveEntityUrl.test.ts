import { describe, expect, it, vi } from "vitest";

import { resolveEntityUrl } from "./resolveEntityUrl.js";

const mockGetAuthenticated = vi.fn();

const mockOctokitFromAuth = vi.fn().mockResolvedValue({
	rest: {
		users: {
			get getAuthenticated() {
				return mockGetAuthenticated;
			},
		},
	},
});

vi.mock("octokit-from-auth", () => ({
	get octokitFromAuth() {
		return mockOctokitFromAuth;
	},
}));

describe(resolveEntityUrl, () => {
	it.each([
		"https://github.com/owner/repository/issues/19",
		"github.com/owner/repository/issues/19",
		"https://github.com/owner/repository/issues/19#issuecomment-123",
	])("returns the entity as-is when it is %s", async (entity) => {
		expect(await resolveEntityUrl(entity)).toBe(entity);
	});

	it("returns the entity as-is when it is not a recognized shorthand", async () => {
		expect(await resolveEntityUrl("owner/repository")).toBe("owner/repository");
	});

	it("prepends the GitHub URL when the entity includes an owner", async () => {
		expect(await resolveEntityUrl("owner/repository/issues/19")).toBe(
			"https://github.com/owner/repository/issues/19",
		);
		expect(mockOctokitFromAuth).not.toHaveBeenCalled();
	});

	it("prepends the GitHub URL and logged in user when the entity omits an owner", async () => {
		mockGetAuthenticated.mockResolvedValueOnce({ data: { login: "owner" } });

		expect(await resolveEntityUrl("repository/issues/19")).toBe(
			"https://github.com/owner/repository/issues/19",
		);
	});
});
