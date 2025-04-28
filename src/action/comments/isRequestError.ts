import { RequestError } from "octokit";

export function isRequestError(error: unknown): error is RequestError {
	return (
		typeof error === "object" &&
		!!error &&
		"status" in error &&
		typeof error.status === "number"
	);
}
