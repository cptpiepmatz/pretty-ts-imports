import Config from "./Config";
import FormattingOptions from "../import_management/FormattingOptions";

/** Interface describing a full-fledged config. */
export default interface FullConfig extends Required<Config> {
  /** Formatting options will every option. */
  formatting: Required<FormattingOptions>;
}
