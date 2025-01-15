/**
 * Converts a hyphen-separated string to capital case.
 * @param {string} value - The hyphen-separated string to convert.
 * @returns The converted string in capital case.
 */
export default function hyphenToCapitalCase(value: string) {
  return value
    .replace(/-([a-z])/g, function (match, group) {
      return " " + group.toUpperCase();
    })
    .replace(/\[id\]/g, "") // Remove [id]
    .replace(/\//g, "")     // Remove /
    .replace(/^\w/, (c) => c.toUpperCase());
}

/**
 * Creates a new FormData object and appends key-value pairs from the provided data object.
 * @param {Record<string, string>} data - An object containing key-value pairs to be added to the FormData.
 * @returns {FormData} A FormData object with the key-value pairs from the data object appended to it.
 */
export function createFormData(data: Record<string, string>): FormData {
  const formData = new FormData();
  for (const key in data) {
    if (Object.hasOwnProperty.call(data, key)) {
      formData.append(key, data[key]);
    }
  }
  return formData;
}
