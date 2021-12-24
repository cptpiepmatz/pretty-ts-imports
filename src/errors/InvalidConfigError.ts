/** Error class for invalid config files. */
export default class InvalidConfigError extends Error {

  /**
   * Constructor.
   * @param message Message of the error
   * @param configKey The name of the key that is invalid
   * @param configValue The value in the config that is invalid
   */
  constructor(
    message: string,
    readonly configKey: string,
    readonly configValue: any
  ) {
    super(message);
  }

}
