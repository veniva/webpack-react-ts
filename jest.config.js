module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  moduleNameMapper: {// https://jestjs.io/docs/29.1/configuration/#modulenamemapper-objectstring-string--arraystring
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
  /** 
   * "setupFilesAfterEnv" will make available all the "matchers" from https://github.com/testing-library/jest-dom
   * available in all our test files.
   * "setupFilesAfterEnv" docs at: https://jestjs.io/docs/configuration#setupfilesafterenv-array
   */
  setupFilesAfterEnv: ["@testing-library/jest-dom/extend-expect"],
};