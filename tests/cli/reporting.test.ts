import { main } from "@primp/primp/cli";
import { expect } from "@std/expect";
import { join } from "@std/path";

Deno.test("formatting reports only changed files by default", async () => {
  const dir = Deno.makeTempDirSync({ prefix: "primp-reporting-" });
  const log = console.log;
  const reported: string[] = [];
  try {
    const config = join(dir, "primp.config.ts");
    const dirty = join(dir, "dirty.ts");
    const clean = join(dir, "clean.ts");
    Deno.writeTextFileSync(config, "export default {};");
    Deno.writeTextFileSync(dirty, 'import z from "z";\nimport a from "a";\n');
    Deno.writeTextFileSync(
      clean,
      'import a from "a";\r\nimport z from "z";\r\n',
    );
    console.log = (message: string) => reported.push(message);

    expect(await main(["--config", config, dirty, clean, dirty])).toBe(false);
    expect(reported).toEqual([
      dirty,
      "Checked 2 files",
      "Updated 1 file",
    ]);
    reported.length = 0;
    expect(await main(["--config", config, dirty])).toBe(false);
    expect(reported).toEqual(["Checked 1 file"]);

    const ignored = join(dir, "ignored.txt");
    Deno.writeTextFileSync(ignored, "not a supported file");
    reported.length = 0;
    expect(await main(["--config", config, ignored])).toBe(false);
    expect(reported).toEqual(["Checked 0 files"]);
  } finally {
    console.log = log;
    Deno.removeSync(dir, { recursive: true });
  }
});

Deno.test("config callbacks replace reporting without changing check results", async () => {
  const dir = Deno.makeTempDirSync({ prefix: "primp-callbacks-" });
  const log = console.log;
  const reported: string[] = [];
  try {
    const config = join(dir, "primp.config.ts");
    const dirty = join(dir, "dirty.ts");
    const clean = join(dir, "clean.ts");
    const original = 'import z from "z";\r\nimport a from "a";\r\n';
    const formatted = 'import a from "a";\r\nimport z from "z";\r\n';
    const ignored = join(dir, "ignored.txt");
    Deno.writeTextFileSync(ignored, original);
    Deno.writeTextFileSync(
      config,
      `export default {
        onFormat({ path, changed }: { path: string; changed: boolean }) {
          console.log(JSON.stringify(["format", path, changed]));
        },
        onCheck({ path, changed }: { path: string; changed: boolean }) {
          console.log(JSON.stringify(["check", path, changed]));
        },
        onSummary({ checked, updated, check }: { checked: number; updated: number; check: boolean }) {
          console.log(JSON.stringify(["summary", checked, updated, check]));
        },
      };`,
    );
    Deno.writeTextFileSync(dirty, original);
    Deno.writeTextFileSync(clean, formatted);
    console.log = (message: string) => reported.push(message);
    const events = () => reported.map((message) => JSON.parse(message));

    expect(
      await main(["--check", "--config", config, dirty, clean, dirty, ignored]),
    )
      .toBe(true);
    expect(events()).toEqual([
      ["check", dirty, true],
      ["check", clean, false],
      ["summary", 2, 1, true],
    ]);
    expect(Deno.readTextFileSync(dirty)).toBe(original);

    reported.length = 0;
    const output = join(dir, "out");
    expect(await main(["--config", config, "--output", output, dirty, clean]))
      .toBe(false);
    expect(events()).toEqual([
      ["format", dirty, true],
      ["format", clean, false],
      ["summary", 2, 1, false],
    ]);
    expect(Deno.readTextFileSync(dirty)).toBe(original);
    expect(Deno.readTextFileSync(join(output, "dirty.ts"))).toBe(formatted);
    expect(Deno.readTextFileSync(join(output, "clean.ts"))).toBe(formatted);

    reported.length = 0;
    await main(["--config", config, dirty, clean]);
    expect(events()).toEqual([
      ["format", dirty, true],
      ["format", clean, false],
      ["summary", 2, 1, false],
    ]);
    expect(Deno.readTextFileSync(dirty)).toBe(formatted);

    reported.length = 0;
    expect(await main(["--check", "--config", config, dirty, clean])).toBe(
      false,
    );
    expect(events()).toEqual([
      ["check", dirty, false],
      ["check", clean, false],
      ["summary", 2, 0, true],
    ]);
  } finally {
    console.log = log;
    Deno.removeSync(dir, { recursive: true });
  }
});
