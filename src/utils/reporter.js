import fs from 'fs';
import path from 'path';
import logger from './logger';
import getHtmlReport from './reportTypes/htmlReport';
import getJsonReport from './reportTypes/jsonReport';

const saveReport = (filepath, contents) =>
  fs.writeFileSync(filepath, contents);

const getReport = (key, results) => {
  switch (key) {
    case 'json':
      return getJsonReport(results);
    case 'html':
    default:
      return getHtmlReport(results);
  }
};

const getImages = dir =>
  fs
    .readdirSync(dir)
    .filter(file => fs.lstatSync(path.join(dir, file)).isFile());

const getImagePath = (files, file) =>
  (files.indexOf(file) !== -1 ? file : null);

export default class Reporter {
  constructor(configuration) {
    this.configuration = configuration;
    this.results = [];
  }

  addResult({ outcome, testName, result }) {
    this.results.push({
      outcome,
      testName,
      result,
    });
  }

  getResults() {
    const { imageSnapshotPath, saveDifferencifiedImage } = this.configuration;
    const images = getImages(imageSnapshotPath);
    return this.results.map(result =>
      // eslint-disable-next-line prefer-object-spread/prefer-object-spread
      Object.assign(
        {
          referenceFileName: getImagePath(images, `${result.testName}.png`),
          diffFileName:
            !result.outcome && saveDifferencifiedImage
              ? getImagePath(images, `${result.testName}_differencified.png`)
              : null,
        },
        result,
      ),
    );
  }

  generate(types) {
    Object.keys(types).forEach((type) => {
      const filepath = path.join(this.configuration.imageSnapshotPath, types[type]);
      try {
        const template = getReport(type, this.getResults());
        console.log('SAVE REPORT', filepath);
        saveReport(filepath, template);
        logger.log(`Generated ${type} report at ${filepath}`);
      } catch (err) {
        console.log(err);
        logger.error(
          `Unable to generate ${type} report at ${filepath}: ${err}`,
        );
      }
    });
  }
}

export { getHtmlReport, getJsonReport };
