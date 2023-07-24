/**
 * Removes single line comments from a string.
 * @param {string} string The string to modify
 * @returns {string} The modified string
 */
export function stripSingleLineComments(string) {
  const lineArray = string.split('\n');
  const lineCount = lineArray.length;
  for (let index = 0; index < lineCount; index++) {
    const line = lineArray[index];
    if (line.indexOf('@preserve') > -1) continue;
    const commentIndex = line.indexOf('//');
    if (commentIndex > -1) {
      lineArray[index] = line.substring(0, commentIndex);
    }
  }
  return lineArray.join('\n');
}
