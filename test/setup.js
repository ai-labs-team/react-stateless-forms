const chai = require('chai');
const chaiEnzyme = require('chai-enzyme');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const Adapter = require('enzyme-adapter-react-16');
const { configure, mount, render, shallow } = require('enzyme');
const { JSDOM } = require('jsdom');

require('jsdom-global/register');

const jsdom = new JSDOM('<html><body></body></html>', { url: "http://localhost" });

configure({ adapter: new Adapter() });

chai.use(sinonChai);
chai.use(chaiEnzyme());

Object.assign(global, {
  expect: chai.expect,
  mount,
  render,
  sinon,
  shallow,
  window: jsdom.window,
  document: jsdom.window.document
});
