import getHtmlReport from './htmlReport';

const results = [
  {
    outcome: true,
    testName: 'default',
    result: 'no mismatch found',
  },
  {
    outcome: false,
    testName: 'default2',
    referenceFileName: 'default2.png',
    diffFileName: 'default2_differencified.png',
    result: 'mismatch found!',
  },
];

describe('HTML report', () => {
  it.only('generates a HTML report', () => {
    const report = getHtmlReport(results);
    expect(report).toMatchSnapshot();
  });
});
