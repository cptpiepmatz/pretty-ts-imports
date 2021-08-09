/**
 * Expect wrapper for divider functions.
 * @param divider Function deciding whether to divide
 */
export default function expectDivider<T>(divider: (a: T, b: T) => boolean) {
  function expectDivided(leading: T, following: T) {
    expect(divider(leading, following))
      .withContext("Expected: Leading is divided from following")
      .toBeTrue();
  }

  function expectNotDivided(leading: T, following: T) {
    expect(divider(leading, following))
      .withContext("Expected: Leading is NOT divided from following")
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
          expectDivided(leading, following);
        }
      }
    },

    /** Expect not divider. */
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
            expectNotDivided(leading, following);
          }
        }
      }
    }
  }
}
