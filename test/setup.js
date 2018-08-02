const chai = require('chai');
const chaiEnzyme = require('chai-enzyme');
const { configure, mount, render, shallow } = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

configure({ adapter: new Adapter() });
chai.use(sinonChai);
chai.use(chaiEnzyme());

Object.assign(global, {
  expect: chai.expect,
  mount,
  render,
  sinon,
  shallow,
});
