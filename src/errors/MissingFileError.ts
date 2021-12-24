/** Error class if a file is missing. */
export default class MissingFileError extends Error {

  /**
   * Constructor.
   * @param message Message
   * @param path Path of the file that was missing
   */
  constructor(message: string, readonly path?: string) {
    super(message);
  }

}
