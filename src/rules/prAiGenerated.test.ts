import { describe, expect, it, vi } from "vitest";

import { testRule } from "../tests/testRule.js";
import { prAiGenerated } from "./prAiGenerated.js";

const makeLabel = (name: string) => ({
	color: "",
	default: false,
	description: null,
	id: 0,
	name,
	node_id: "",
	url: "",
});

describe(prAiGenerated.about.name, () => {
	it("does not report when the pull request has no target labels", async () => {
		const report = vi.fn();

		await testRule(
			prAiGenerated,
			{
				data: {
					labels: [makeLabel("bug")],
					state: "open",
				},
				type: "pull_request",
			},
			{ report },
		);

		expect(report).not.toHaveBeenCalled();
	});

	it("does not report when the pull request is already closed", async () => {
		const report = vi.fn();

		await testRule(
			prAiGenerated,
			{
				data: {
					labels: [makeLabel("ai slop")],
					state: "closed",
				},
				type: "pull_request",
			},
			{ report },
		);

		expect(report).not.toHaveBeenCalled();
	});

	it("reports with action: close when the pull request has the 'ai slop' label", async () => {
		const report = vi.fn();

		await testRule(
			prAiGenerated,
			{
				data: {
					labels: [makeLabel("ai slop")],
					state: "open",
				},
				type: "pull_request",
			},
			{ report },
		);

		expect(report).toHaveBeenCalledOnce();
		expect(report.mock.calls[0][0]).toMatchObject({ action: "close" });
	});

	it("reports with action: close when the pull request has the 'automation-signal' label", async () => {
		const report = vi.fn();

		await testRule(
			prAiGenerated,
			{
				data: {
					labels: [makeLabel("automation-signal")],
					state: "open",
				},
				type: "pull_request",
			},
			{ report },
		);

		expect(report).toHaveBeenCalledOnce();
		expect(report.mock.calls[0][0]).toMatchObject({ action: "close" });
	});

	it("reports with action: close when the label is mixed case (case-insensitive match)", async () => {
		const report = vi.fn();

		await testRule(
			prAiGenerated,
			{
				data: {
					labels: [makeLabel("AI Slop")],
					state: "open",
				},
				type: "pull_request",
			},
			{ report },
		);

		expect(report).toHaveBeenCalledOnce();
		expect(report.mock.calls[0][0]).toMatchObject({ action: "close" });
	});
});
