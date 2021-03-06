const
  assert = require('assert'),
  rollup = require('rollup').rollup,
  wrap = require('co').wrap,
  fsp = require('fs-promise'),
  path = require('path'),
  riot = require('../dist/rollup-plugin-riot.cjs.js')

describe('rollup-plugin-riot', () => {
  const
    fixturesDir = path.join(__dirname, 'fixtures'),
    expectDir = path.join(__dirname, 'expect')

  function readFile (name) {
    return fsp.readFile(path.join(expectDir, name), 'utf8')
      .then(content => content.trim())
  }

  function rollupRiot (filename, riotOpts) {
    const opts = {
      entry: path.join(fixturesDir, filename),
      external: ['riot'],
      plugins: [riot(riotOpts || {})]
    }
    return rollup(opts).then(b => b.generate().code)
  }

  it('single tag', wrap(function* () {
    const filename = 'single.js'
    assert.equal(yield rollupRiot(filename), yield readFile(filename))
  }))

  it('multiple tag', wrap(function* () {
    const filename = 'multiple.js'
    assert.equal(yield rollupRiot(filename), yield readFile(filename))
  }))

  it('multiple tag in single file', wrap(function* () {
    const filename = 'multiple2.js'
    assert.equal(yield rollupRiot(filename), yield readFile(filename))
  }))

  it('tag with another extension', wrap(function* () {
    const filename = 'another-ext.js', opts = { ext: 'html' }
    assert.equal(yield rollupRiot(filename, opts), yield readFile(filename))
  }))

  it('skip css', wrap(function* () {
    const filename = 'skip.js', opts = { skip: ['css'] }
    assert.equal(yield rollupRiot(filename, opts), yield readFile(filename))
  }))

  it('es6 import inside tag', wrap(function* () {
    const filename = 'es6-in-tag.js'
    assert.equal(yield rollupRiot(filename), yield readFile(filename))
  }))
})
