export function replaceRegexPatternFromString(
  input: string,
  regexPatternString: string,
  newString: string,
): string {
  const regexPattern = new RegExp(regexPatternString, 'g');
  if (input !== undefined) return input.replace(regexPattern, newString);
  else return '';
}

export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
