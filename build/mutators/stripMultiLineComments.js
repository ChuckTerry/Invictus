/**
 * Strips Multi Line Comments from a string
 * @param {string} string The string to modify
 * @returns {string} The modified string
 */
export function stripMultiLineComments(string) {
  const lineArray = string.split('\n');
  const lineCount = lineArray.length;
  let commentStartIndex = -1;
  let commentEndIndex = -1;
  for (let index = 0; index < lineCount; index++) {
    const line = lineArray[index];
    if (line.indexOf('@preserve') > -1) continue;
    commentStartIndex = line.indexOf('/*');
    commentEndIndex = line.indexOf('*/');
    if (commentStartIndex > -1) {
      if (commentEndIndex > -1) {
        lineArray[index] = line.substring(0, commentStartIndex) + line.substring(commentEndIndex + 2);
      } else {
        lineArray[index] = line.substring(0, commentStartIndex);
        for (let subIndex = index + 1; subIndex < lineCount; subIndex++) {
          const subLine = lineArray[subIndex];
          commentEndIndex = subLine.indexOf('*/');
          if (commentEndIndex > -1) {
            lineArray[subIndex] = subLine.substring(commentEndIndex + 2);
            break;
          } else {
            lineArray[subIndex] = '';
          }
        }
      }
    }
  }
  return lineArray.join('\n');
}
