import ImportCompareFunction
  from "../../../src/sort_rules/ImportCompareFunction";

const basic: ImportCompareFunction = function(a, b) {
  return a.source.name.localeCompare(b.source.name);
}

export default basic;
