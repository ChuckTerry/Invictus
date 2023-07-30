/**
 * Simple function to minify CSS strings
 * @param {string} string The CSS string to minify
 * @returns {string} The minified CSS string
 */
export function minifyCss(string) {
  // Remove whitespace after colon
  string = string.replaceAll(/:\s+(.)/g, ':$1');
  // Remove whitespace surrounding opening barcket
  string = string.replaceAll(/\s+{\s+/g, '{');
  // Remove whitespace after semicolon
  string = string.replaceAll(/;\s+(.)/g, ';$1');
  // Remove whitespace after final property without semicolon
  string = string.replaceAll(/(.)\s+}/g, '$1}');
  // Remove whitespace between closing bracket and next selector
  string = string.replaceAll(/}\s+(.)/g, '}$1');
  return string;
}
