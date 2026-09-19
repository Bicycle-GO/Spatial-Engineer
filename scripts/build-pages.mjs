import { spawnSync } from "node:child_process";

const result = spawnSync(process.execPath, ["node_modules/next/dist/bin/next", "build"], {
  stdio: "inherit",
  env: { ...process.env, GITHUB_ACTIONS: "true", NEXT_TELEMETRY_DISABLED: "1" },
});
if (result.error) console.error(result.error);
process.exit(result.status ?? 1);
