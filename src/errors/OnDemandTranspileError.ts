/** Error class for errors that happen while then on demand transpile. */
export default class OnDemandTranspileError extends Error {

  /**
   * Constructor for on demand transpile errors.
   * @param message Message of the error
   * @param path Path of the issue
   */
  constructor(message: string, readonly path?: string) {
    super(message);
  }

}
