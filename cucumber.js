// cucumber.js
module.exports = {
  default: {
    paths: ['features/**/*.feature'],
    require: ['support/**/*.js', 'step-definitions/**/*.js'],
    format: ['progress', 'html:target/cucumber-report.html'],
    defaultTimeout: 30000,
  }
};