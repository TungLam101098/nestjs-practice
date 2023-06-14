/**
 * Get array after sorting asc by key
 * @param {array} results: array is sorted
 * @param {string} key: key of object in array
 * @returns {array} new array is sorted
 */
const sortingResults = ({ results, key }) => results.sort((a, b) => a[key] - b[key]);

module.exports = {
  sortingResults
};
