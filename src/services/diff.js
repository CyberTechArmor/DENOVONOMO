'use strict';

const Diff = require('diff');

/**
 * Generate a line-by-line diff between two text strings.
 *
 * @param {string} oldText - The original text
 * @param {string} newText - The updated text
 * @returns {Array<{type: 'added'|'removed'|'unchanged', value: string}>}
 */
function generateDiff(oldText, newText) {
  const oldStr = oldText || '';
  const newStr = newText || '';

  const changes = Diff.diffLines(oldStr, newStr);

  return changes.map((part) => {
    let type;
    if (part.added) {
      type = 'added';
    } else if (part.removed) {
      type = 'removed';
    } else {
      type = 'unchanged';
    }
    return { type, value: part.value };
  });
}

module.exports = { generateDiff };
