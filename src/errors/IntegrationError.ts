/** Error class if something in the integration failed. */
export default class IntegrationError extends Error {

  /**
   * Constructor
   * @param message Message of the error
   * @param sourceText Source text that failed the integration
   */
  constructor(message: string, readonly sourceText: string) {
    super(message);
  }
}
