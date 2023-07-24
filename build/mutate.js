import { stripConsoleOutput } from './mutators/stripConsoleOutput.js';
import { stripSingleLineComments } from './mutators/stripSingleLineComments.js';
import { stripMultiLineComments } from './mutators/stripMultiLineComments.js';
import { stripImportStatements } from './mutators/stripImportStatements.js';
import { stripExportKeywords } from './mutators/stripExportKeywords.js';
import { stripEmptyLines } from './mutators/stripEmptyLines.js';

export function mutate(string) {
  string = stripConsoleOutput(string);
  string = stripSingleLineComments(string);
  string = stripMultiLineComments(string);
  string = stripImportStatements(string);
  string = stripExportKeywords(string);
  string = stripEmptyLines(string);
  return string;
}
