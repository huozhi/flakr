import {mount, instantiate, updateProps} from './dom'
import Reconcilder from './reconciler'
import {DOMUpdate, flushBatches} from './batch'

function isComponentClass(type) {
  return (
    Boolean(type.prototype) &&
    Boolean(type.isComponent)
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
    this._updateDOMProps({}, this._currentElement.props)
    this._createChildren(this._currentElement.props)
    return el
  }

  _createChildren(children) {
    if (!Array.isArray(children)) {
      children = [children]
    }
    const mountImages = this.mountChildren(children)
    for (const child of mountImages) {
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

  updateComponent(prevElement, nextElement) {
    this._currentElement = nextElement
    this._updateDOMProps(prevElement, nextElement)
    this._updateDOMChildren(prevElement.props, nextElement.props)
  }

  _updateDOMProps(prevElement, nextElement) {
    updateProps(this._domNode, prevElement.props, nextElement.props)
  }

  _updateDOMChildren(prevProps, nextProps) {
    const updates = []
    const prevChildren = prevProps.children
    const nextChildren = nextProps.children
    if (typeof nextChildren === 'undefined') {
      return
    }
    const updates = []
    const {mountImages, removeNodes} = Reconcilder.diffChildren(prevChildren, nextChildren)
    Object.keys(removeNodes).forEach((childIndex) => {
      updates.push(DOMUpdate.remove(removeNodes[childIndex]))
    })

    Object.keys(mountImages).forEach((childIndex) => {
      updates.push(DOMUpdate.insert(mountImages[childIndex]))
    })

    flushBatches(this._domNode, updates)
    this._renderedChildren = nextChildren
  }
}

class Component {
  constructor(props) {
    this.props = props
    this._domNode = null
    this._currentElement = null
    this._renderedElement = null
    this._renderedChildren = null
  }

  receiveComponent(nextElement) {
    this.updateComponent(this._currentElement, nextElement)
  }

  updateComponen(prevElement, nextElement) {
    
  }
}

Component.isComponent = true

export {Component, isComponentClass}
