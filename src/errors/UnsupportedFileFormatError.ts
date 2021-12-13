/** Error class for unsupported files. */
export default class UnsupportedFileFormatError extends Error {

  /** The path of the unsupported file. */
  readonly path: string;

  /**
   * Constructor.
   * @param path Path of the unsupported file
   */
  constructor(path: string) {
    super("This file format is not supported.");
    this.path = path;
  }

}
