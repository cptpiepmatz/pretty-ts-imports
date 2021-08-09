/**
 * Expect wrapper for compare functions.
 * @param actual Actual value to compare
 */
export default function expectSorted<T>(actual: T) {
  return {
    /**
     * Setter for the compare function.
     * @param comparator Compare function
     */
    comparedBy: function(comparator: (a: T, b: T) => number) {

      function minusOne(context: string) {
        return function(expected: T) {
          expect(comparator(actual, expected))
            .withContext(context)
            .toBeLessThanOrEqual(-1);
        }
      }

      function plusOne(context: string) {
        return function(expected: T) {
          expect(comparator(actual, expected))
            .withContext(context)
            .toBeGreaterThanOrEqual(1);
        }
      }

      function zero(context: string) {
        return function(expected: T) {
          expect(comparator(actual, expected))
            .withContext(context)
            .toBe(0);
        }
      }

      return {
        toBeBefore: minusOne("Expected: actual to be before expected"),
        toBeLessThan: minusOne("Expected: actual to be less than expected"),
        toBeAfter: plusOne("Expected: actual to be after expected"),
        toBeGreaterThan: plusOne("Expected: actual to be greater than expected"),
        toEqual: zero("Expected: actual to be indistinguishable from expected")
      }
    }
  }
}
