/** Error class for errors that are caused by bad cli options. */
export default class CLIOptionsError extends Error {

  /** The option set for the error. */
  readonly cliOption: string;

  /** The value passed to the option. */
  readonly cliValue?: string;

  /**
   * Constructor.
   * @param message Message for the error
   * @param cliOption The option that caused the error
   * @param cliValue The value passed to the option
   */
  constructor(message: string, cliOption: string, cliValue?: string) {
    super(message);
    this.cliOption = cliOption;
    this.cliValue = cliValue;
  }

}
