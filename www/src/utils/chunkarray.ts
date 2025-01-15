/**
 * Splits an array into smaller arrays of a specified chunk size.
 * 
 * @param {Array} array - The array to be split.
 * @param {number} chunkSize - The size of each chunk.
 * @returns {Array<Array>} An array of arrays, each containing up to `chunkSize` elements.
 */

function chunkArray(array: [], chunkSize: number) {
    const chunkedArray = [];
    for (let i = 0; i < array.length; i += chunkSize) {
        chunkedArray.push(array.slice(i, i + chunkSize));
    }
    return chunkedArray;
}

export default chunkArray;