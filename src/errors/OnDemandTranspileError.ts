/** Error class for errors that happen while then on demand transpile. */
export default class OnDemandTranspileError extends Error {

  /**
   * Constructor for on demand transpile errors.
   * @param message
   */
  constructor(message: string) {
    super(message);
  }

}
