/** Error class for invalid config files. */
export default class InvalidConfigError extends Error {

  /** The name of the key that is invalid. */
  readonly configKey: string;

  /** The value in the config that is invalid. */
  readonly configValue: any;

  /**
   * Constructor.
   * @param message
   * @param configKey
   * @param configValue
   */
  constructor(message: string, configKey: string, configValue: any) {
    super(message);
    this.configKey = configKey;
    this.configValue = configValue;
  }

}
