/**
 * Expect wrapper for separator functions.
 * @param separator Function deciding whether to separate
 */
export default function expectSeparator<T>(separator: (a: T, b: T) => boolean) {
  function expectSeparated(leading: T, following: T) {
    expect(separator(leading, following))
      .withContext("Expected: Leading is separated from following")
      .toBeTrue();
  }

  function expectNotSeparated(leading: T, following: T) {
    expect(separator(leading, following))
      .withContext("Expected: Leading is NOT separated from following")
      .toBeFalse();
  }

  return {
    /**
     * Setter for the leading element.
     * @param leading Leading element
     */
    between: function(leading: T) {
      return {
        /**
         * Setter for the following element.
         * @param following Following element
         */
        and: function(following: T) {
          expectSeparated(leading, following);
        }
      }
    },

    /** Expect not separator. */
    not: {
      /**
       * Setter for the leading element.
       * @param leading Leading element
       */
      between: function(leading: T) {
        return {
          /**
           * Setter for the following element.
           * @param following Following element
           */
          and: function(following: T) {
            expectNotSeparated(leading, following);
          }
        }
      }
    }
  }
}
