import {mount, instantiate} from './dom'
import reconcilder from './reconciler'

function isComponentClass(type) {
  return (
    Boolean(type.prototype) &&
    Boolean(type.prototype.isComponent)
  )
}

function getKey(element) {
  return (element && element.key) ? element.key : ''
}

class DOMComponent {
  constructor(element) {
    this._currentElement = element
    this._domNode = null
  }

  mountComponent() {
    const el = mount(this._currentElement)
    this._domNode = el

    
    return el
  }

  createChildren(children) {
    if (!Array.isArray(children)) {
      children = [children]
    }
    for (const child of children) {
      node.appendChild(createDOMNode(child))
    }
  }

  mountChildren(children) {
    const renderedChidlren = {}
    const childrenElements = children.map((child, index) => {
      const element = instantiate(child)
      element._mountIndex = index
      renderedChidlren[index] = element
      return element
    })

    this._renderedChildren = renderedChidlren
    const mountImages = childrenElements.map(reconcilder.mountComponent)
    
    return mountImages
  }
}

class Component {
  constructor(props) {
    this.props = props
    this._domNode = null
    this._currentElement = null
    this._renderedElement = null
  }

  receiveComponent(nextElement) {
    
  }

  updateComponent(nextElement) {

  }
}

Component.prototype.isComponent = true

export {Component, isComponentClass}
