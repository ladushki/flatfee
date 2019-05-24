// For authoring Nightwatch tests, see
// http://nightwatchjs.org/guide#usage

module.exports = {
  'default e2e tests': function (browser) {
    // automatically uses dev Server port from /config.index.js
    // default: http://localhost:8080
    // see nightwatch.conf.js
    const devServer = browser.globals.devServerURL

    browser
      .url(devServer)
      .waitForElementVisible('#app', 5000)
      .assert.elementPresent('.calculator')
      .assert.containsText('h1', 'Membership Fee Calculator')
      .assert.elementCount('.control', 5)
      .assert.elementCount('.result', 0)
      .end()
  }
}
