/** Error class for errors that are caused by bad cli options. */
export default class CLIOptionsError extends Error {

  /**
   * Constructor.
   * @param message Message for the error
   * @param cliOption The option that caused the error
   * @param cliValue The value passed to the option
   */
  constructor(
    message: string,
    readonly cliOption: string,
    readonly cliValue?: string
  ) {
    super(message);
  }

}
