import {mkdirSync, mkdtempSync, rmdirSync, rmSync} from "fs";
import {join} from "path";

/**
 * Helper function to generate a tmp directory for testing.
 *
 * The temporary directory will be deleted after this is done.
 * @param whileTmpDir Function to pass while the temporary directory exists
 */
export default function useTmpDir(whileTmpDir: (path: string) => void) {
  const genericTmpPath = join(__dirname, "../tmp");
  mkdirSync(genericTmpPath, {recursive: true});
  let tmpPath = mkdtempSync(join(genericTmpPath, "/"));
  whileTmpDir(tmpPath);
  rmSync(tmpPath, {recursive: true});
}
