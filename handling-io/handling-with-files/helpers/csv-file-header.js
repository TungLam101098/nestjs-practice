/**
 * Get rows, headerRow of CSV file
 * @param {csv} CSV file
 * @returns {object} rows: string array are splits by new row, headerColumns: columns of CSV file
 */
const getHeaderCsvFile = (csvFile) => {
  const rows = csvFile.split('\n');
  const headerRow = rows[0].trim();
  const headerColumns = headerRow.split(',');

  return {
    rows,
    headerColumns,
  }
}

module.exports = getHeaderCsvFile;
