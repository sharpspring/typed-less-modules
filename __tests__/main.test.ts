import fs from "fs";
import slash from "slash";

import { main } from "../lib/main";

describe("main", () => {
  beforeEach(() => {
    // Only mock the write, so the example files can still be read.
    fs.writeFileSync = jest.fn();
    console.log = jest.fn(); // avoid console logs showing up
  });

  test("generates types for all .less files when the pattern is a directory", async () => {
    const pattern = `${__dirname}`;

    await main(pattern, {
      watch: false,
      ignoreInitial: false,
      exportType: "named",
      exportTypeName: "ClassNames",
      exportTypeInterface: "Styles",
      listDifferent: false,
      ignore: [],
      quoteType: "single",
      logLevel: "verbose"
    });

    const expectedDirname = slash(__dirname);

    expect(fs.writeFileSync).toBeCalledTimes(5);

    expect(fs.writeFileSync).toBeCalledWith(
      `${expectedDirname}/complex.less.d.ts`,
      "export const someStyles: string;\nexport const nestedClass: string;\nexport const nestedAnother: string;\n"
    );
    expect(fs.writeFileSync).toBeCalledWith(
      `${expectedDirname}/style.less.d.ts`,
      "export const someClass: string;\n"
    );
  });

  test("generates types for all .less files and ignores files that match the ignore pattern", async () => {
    const pattern = `${__dirname}`;

    await main(pattern, {
      watch: false,
      ignoreInitial: false,
      exportType: "named",
      exportTypeName: "ClassNames",
      exportTypeInterface: "Styles",
      listDifferent: false,
      ignore: ["**/style.less"],
      quoteType: "single",
      logLevel: "verbose"
    });

    expect(fs.writeFileSync).toBeCalledTimes(3);

    const expectedDirname = slash(__dirname);
    expect(fs.writeFileSync).toBeCalledWith(
      `${expectedDirname}/complex.less.d.ts`,
      "export const someStyles: string;\nexport const nestedClass: string;\nexport const nestedAnother: string;\n"
    );

    // Files that should match the ignore pattern.
    expect(fs.writeFileSync).not.toBeCalledWith(
      `${expectedDirname}/style.less.d.ts`,
      expect.anything()
    );
    expect(fs.writeFileSync).not.toBeCalledWith(
      `${expectedDirname}/nested-styles/style.less.d.ts`,
      expect.anything()
    );
  });
});
