// jest.config.js
export default {
  // Χρησιμοποιούμε το Babel για να μετασχηματίσουμε τα ES Modules (.js)
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  
  testEnvironment: 'node',
  
  // Το Jest δεν πρέπει να αγνοεί modules που χρειάζονται μετασχηματισμό (π.χ. το mongoose)
  transformIgnorePatterns: ['/node_modules/'],
  
  // Αυτό βοηθάει στην επίλυση των διαδρομών και των επερχόμενων σφαλμάτων import/export
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  
  collectCoverage: true,
  modulePathIgnorePatterns: ["<rootDir>/se2-part1-backend-main/"],
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/config/",
    "/server.js",
    "/__tests__/"
  ],
  testMatch: [
    "**/__tests__/**/*.test.js",
    "**/?(*.)+(spec|test).js"
  ],
};