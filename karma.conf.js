// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function(config) {
  config.set({
    basePath: "",
    frameworks: ["jasmine", "@angular/cli"],
    plugins: [
      require("karma-jasmine"),
      require("karma-chrome-launcher"),
      require("karma-jasmine-html-reporter"),
      require("karma-coverage-istanbul-reporter"),
      require("@angular/cli/plugins/karma"),
      require("karma-mocha-reporter")
    ],
    files: ["test/mocks/**/*.js", "src/assets/lib/jquery-3.2.1.min.js"],
    client: {
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    coverageIstanbulReporter: {
      reports: ["html", "lcovonly"],
      fixWebpackSourcePaths: true
    },
    angularCli: {
      environment: "dev"
    },
    // reporter options
    mochaReporter: {
      output: "full",
      divider: "-",
      colors: {
        success: "blue",
        info: "bgGreen",
        warning: "cyan",
        error: "bgRed"
      },
      symbols: {
        success: "+",
        info: "#",
        warning: "!",
        error: "x"
      }
    },
    reporters: ["mocha", "progress", "kjhtml"],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ["Chrome"],
    singleRun: false
  });
};
