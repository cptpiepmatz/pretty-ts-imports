/** Error class if a file is missing. */
export default class MissingFileError extends Error {

  /** If given, the path where the file is missing. */
  readonly path?: string;

  /**
   * Constructor.
   * @param message Message
   * @param path Path of the file that was missing
   */
  constructor(message: string, path?: string) {
    super(message);
    this.path = path;
  }

}
