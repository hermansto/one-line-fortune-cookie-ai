import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The fortune itself: one line, kept as a single constant so the
// file we emit can be checked against it character for character.
// It is 97 characters, well under the 140-character limit, and has
// no newline inside it, so the output file holds exactly one line.
const fortune =
  "You will soon be asked a question that is already answered in the docs. Stay calm. Answer kindly.";

if (fortune.includes("\n") || fortune.length > 140) {
  throw new Error("Fortune must be a single line of at most 140 characters.");
}

// The harness gives us a writable output folder; fall back to /output
// when it does not. Nothing is ever written next to this source file.
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });

const entryPath = join(outDir, "entry.txt");
writeFileSync(entryPath, fortune, "utf8");

// Read it straight back and refuse to finish quietly if it drifted.
// Compare both the text and its byte size, so a stray newline or
// encoding change cannot slip through unnoticed.
const written = readFileSync(entryPath, "utf8");
const expectedBytes = Buffer.byteLength(fortune, "utf8");
const writtenBytes = Buffer.byteLength(written, "utf8");
if (written !== fortune || writtenBytes !== expectedBytes) {
  throw new Error(
    `entry.txt mismatch: expected ${fortune.length} characters / ${expectedBytes} bytes, got ${written.length} characters / ${writtenBytes} bytes`,
  );
}

console.log(
  `Wrote ${fortune.length} characters (${expectedBytes} bytes) to ${entryPath}`,
);
