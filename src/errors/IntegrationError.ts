/** Error class if something in the integration failed. */
export default class IntegrationError extends Error {

  /** The source text that failed the integration. */
  readonly sourceText: string;

  /**
   * Constructor
   * @param message Message of the error
   * @param sourceText Source text
   */
  constructor(message: string, sourceText: string) {
    super(message);
    this.sourceText = sourceText;
  }
}
