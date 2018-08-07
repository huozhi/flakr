import {Component} from './component'
import Mount from './mount'

export default {
  render: Mount.render,
  unmount: Mount.unmount,
  Component: Component,
}

export {default as h} from './h'
