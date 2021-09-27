import { MainOptions } from "lib/core";
/**
 * Given a file path to a LESS file, generate the corresponding type definition
 * file path.
 *
 * @param file the LESS file path
 */
export const getTypeDefinitionPath = (
  file: string,
  options: MainOptions
): string => {
  if (options.outDir) {
    let arr = file.split("/");
    let declarationFile = arr[arr.length - 1];
    return `${options.outDir}/${declarationFile}.d.ts`;
  } else {
    return `${file}.d.ts`;
  }
};
