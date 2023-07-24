# Contributor Guide

## Code of Conduct
First, check out our [Code of Conduct](./CODE_OF_CONDUCT.md).

## Issues
If you find a problem or have a feature request, please create a new issue!

## Code
To contribute directly, fork our repository, make your changes, and submit a pull request.

## Platform Specifics

### Line Endings
Please use Windows style line endings (`\r\n`).  When using regular expressions, either support bot `\r\n` and `\n` or write your code to be platform agnostic.  For example, if you want to add a tab after every new line, match `\n` and replace with `\n\t`.  Thir will ensure the carriage return is preserved on Windows platforms.

### File Paths and Directories
When writing code for Node.js, always prefer `/` and `path.normalize` over `\`.

### Filename Length
Please keep all file names under 192 characters excluding file extension, and under 200 characters including file extension.
