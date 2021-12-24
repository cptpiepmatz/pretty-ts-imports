/** Error class for unsupported files. */
export default class UnsupportedFileFormatError extends Error {

  /**
   * Constructor.
   * @param path Path of the unsupported file
   */
  constructor(readonly path: string) {
    super("This file format is not supported.");
  }

}
