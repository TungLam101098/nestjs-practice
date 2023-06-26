const { expectedColumns } = require('../constants');
const {
  validateCsvFileByPromiseFunc,
  sortingResults,
  exportJsonFromCsvByPromiseFunc,
} = require('../helpers');

const csvFilePath = './source/data.csv';
const jsonFilePath = './source/data.json';

validateCsvFileByPromiseFunc({
  csvFilePath,
  expectedColumns,
})
  .then((data) => {
    if (data) {
      return exportJsonFromCsvByPromiseFunc({
        csvFilePath: data,
        filterResults: { getResults: sortingResults, key: 'quantity' },
        jsonFilePath,
      });
    }
  })
  .then((message) => {
    console.log(message);
  })
  .catch((error) => {
    console.error(error);
  });
