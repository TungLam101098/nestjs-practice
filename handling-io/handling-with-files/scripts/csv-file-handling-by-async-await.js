const { expectedColumns } = require('../constants');
const {
  sortingResults,
  exportJsonFromCsvByPromiseFunc,
  validateCsvFileByPromiseFunc,
} = require('../helpers');

const csvFilePath = './source/data.csv';
const jsonFilePath = './source/data.json';

const exportJsonFile = async () => {
  try {
    const filePath = await validateCsvFileByPromiseFunc({ csvFilePath, expectedColumns });
    if (filePath) {
      const message = await exportJsonFromCsvByPromiseFunc({
        csvFilePath: filePath,
        filterResults: { getResults: sortingResults, key: 'quantity' },
        jsonFilePath,
      })
      
      console.log(message);
    }
  } catch (error) {
    console.error(error);
  }
};

exportJsonFile();
