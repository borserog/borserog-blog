import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

// Check the actual deployment artifact: older adapters silently emitted Node 18
// functions even when the build itself ran successfully under Node 24.
const functionsDirectory = ".vercel/output/functions";
assert.equal(process.versions.node.split(".")[0], "24", "Run deployment checks with Node 24");
let checked = 0;

async function checkFunctions(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const path = join(directory, entry.name);
    if (entry.name.endsWith(".func")) {
      const config = JSON.parse(await readFile(join(path, ".vc-config.json"), "utf8"));
      assert.equal(config.runtime, "nodejs24.x", `${path} must use Node 24`);
      checked++;
    } else {
      await checkFunctions(path);
    }
  }
}

await checkFunctions(functionsDirectory);
assert.ok(checked > 0, "Expected at least one Vercel function");
console.log(`Verified ${checked} Vercel function(s) use Node 24.`);
