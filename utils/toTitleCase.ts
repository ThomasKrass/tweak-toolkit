/**
 * Converts a given input string to Title Case.
 * @example chatting scene -> Chatting Scene
 *
 * @param inputString the string to convert to Title Case
 * @returns the string in Title Case
 */
export default function toTitleCase(inputString: string): string {
  return inputString.replace(
    /\w\S*/g,
    (text) => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase(),
  )
}
