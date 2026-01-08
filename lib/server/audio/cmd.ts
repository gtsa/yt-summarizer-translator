import { spawn } from "node:child_process";

export type RunCmdResult = {
  code: number;
  stdout: string;
  stderr: string;
};

export async function runCmd(
  bin: string,
  args: string[],
  opts?: { cwd?: string; env?: NodeJS.ProcessEnv; timeoutMs?: number }
): Promise<RunCmdResult> {
  const timeoutMs = opts?.timeoutMs ?? 5 * 60_000;

  return new Promise((resolve, reject) => {
    const child = spawn(bin, args, {
      cwd: opts?.cwd,
      env: opts?.env,
      stdio: ["ignore", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";

    const timer = setTimeout(() => {
      child.kill("SIGKILL");
      reject(new Error(`Command timed out after ${timeoutMs}ms: ${bin} ${args.join(" ")}`));
    }, timeoutMs);

    child.stdout.on("data", (d) => (stdout += d.toString()));
    child.stderr.on("data", (d) => (stderr += d.toString()));

    child.on("error", (err) => {
      clearTimeout(timer);
      reject(err);
    });

    child.on("close", (code) => {
      clearTimeout(timer);
      resolve({ code: code ?? -1, stdout, stderr });
    });
  });
}
