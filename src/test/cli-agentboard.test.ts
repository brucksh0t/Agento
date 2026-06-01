import { afterEach, beforeEach, describe, expect, it, setDefaultTimeout } from "bun:test";
import { mkdir, rm } from "node:fs/promises";
import { join } from "node:path";
import { $ } from "bun";
import { Core } from "../index.ts";
import { createUniqueTestDir, initializeTestProject, safeCleanup } from "./test-utils.ts";

setDefaultTimeout(30_000);

let TEST_DIR: string;
const cliPath = join(process.cwd(), "src", "cli.ts");

function run(args: string[]) {
	return $`bun ${cliPath} ${args}`.cwd(TEST_DIR).quiet().nothrow();
}

describe("CLI AgentBoard commands", () => {
	beforeEach(async () => {
		TEST_DIR = createUniqueTestDir("cli-agentboard");
		await rm(TEST_DIR, { recursive: true, force: true }).catch(() => {});
		await mkdir(TEST_DIR, { recursive: true });
		await $`git init -b main`.cwd(TEST_DIR).quiet();
		await $`git config user.name "Test User"`.cwd(TEST_DIR).quiet();
		await $`git config user.email test@example.com`.cwd(TEST_DIR).quiet();
		const core = new Core(TEST_DIR);
		await initializeTestProject(core, "CLI AgentBoard Project");
		await run(["task", "create", "First card", "--plain"]);
	});

	afterEach(async () => {
		await safeCleanup(TEST_DIR).catch(() => {});
	});

	it("registers and lists agents", async () => {
		const reg = await run(["agent", "register", "codex", "--role", "implementer", "--online"]);
		expect(reg.exitCode).toBe(0);
		expect(reg.stdout.toString()).toContain("Registered agent codex");

		const list = await run(["agent", "list"]);
		expect(list.exitCode).toBe(0);
		expect(list.stdout.toString()).toContain("codex");
	});

	it("claims a task and blocks a competing claim", async () => {
		const claim = await run(["task", "claim", "TASK-1", "--agent", "codex"]);
		expect(claim.exitCode).toBe(0);
		expect(claim.stdout.toString()).toContain("Claimed TASK-1 for codex");

		const conflict = await run(["task", "claim", "TASK-1", "--agent", "claude"]);
		expect(conflict.exitCode).toBe(1);
		expect(conflict.stderr.toString()).toContain("already claimed by codex");

		const forced = await run(["task", "claim", "TASK-1", "--agent", "claude", "--force"]);
		expect(forced.exitCode).toBe(0);
	});

	it("releases and hands off a task", async () => {
		await run(["task", "claim", "TASK-1", "--agent", "codex"]);
		const release = await run(["task", "release", "TASK-1", "--agent", "codex"]);
		expect(release.exitCode).toBe(0);
		expect(release.stdout.toString()).toContain("Released claim on TASK-1");

		const handoff = await run([
			"task",
			"handoff",
			"TASK-1",
			"--to",
			"claude",
			"--from",
			"codex",
			"--note",
			"needs review",
		]);
		expect(handoff.exitCode).toBe(0);
		expect(handoff.stdout.toString()).toContain("Handed off TASK-1 to claude");

		const view = await run(["task", "view", "TASK-1", "--plain"]);
		expect(view.stdout.toString()).toContain("Handoff to: claude");
		expect(view.stdout.toString()).toContain("Last agent note: codex: needs review");
	});

	it("enforces the human-review gate and clears it on approval", async () => {
		await run(["task", "edit", "TASK-1", "--require-review"]);

		const blocked = await run(["task", "edit", "TASK-1", "-s", "Done"]);
		expect(blocked.exitCode).toBe(1);
		expect(blocked.stderr.toString()).toContain("requires human review");

		const approve = await run(["task", "review", "TASK-1", "--approve", "--note", "ok"]);
		expect(approve.exitCode).toBe(0);

		const view = await run(["task", "view", "TASK-1", "--plain"]);
		expect(view.stdout.toString()).toContain("Status:");
		expect(view.stdout.toString()).toContain("Done");
	});

	it("rejects a review without clearing the gate", async () => {
		await run(["task", "edit", "TASK-1", "--require-review"]);
		const reject = await run(["task", "review", "TASK-1", "--reject", "--note", "missing tests"]);
		expect(reject.exitCode).toBe(0);
		const view = await run(["task", "view", "TASK-1", "--plain"]);
		expect(view.stdout.toString()).toContain("Requires human review: yes");
		expect(view.stdout.toString()).toContain("Last agent note: review rejected: missing tests");
	});

	it("requires exactly one of --approve/--reject", async () => {
		const both = await run(["task", "review", "TASK-1", "--approve", "--reject"]);
		expect(both.exitCode).toBe(1);
		expect(both.stderr.toString()).toContain("exactly one");
	});
});
