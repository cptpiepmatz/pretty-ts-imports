/** Interface describing how the outputted imports should be formatted. */
export default interface FormattingOptions {

  /** The indent if the import needs to use line break in order to fit. */
  indent?: number;

  /** The indent at the start and end of the named imports. */
  bracketIndent?: number;

  /** The quote style to use for the import source. */
  quoteStyle?: "double" | "single";

  /** The max columns the output should not overlap. */
  maxColumns?: number;

}
