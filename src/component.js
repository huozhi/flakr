import DOM from './dom'
import {instantiate, shouldUpdateComponent} from './element'
import Reconciler from './reconciler'
// import {DOMUpdate, flushBatches} from './batch'

function isComponentClass(type) {
  return (
    Boolean(type.prototype) &&
    Boolean(type.prototype.isComponent)
  )
}

function getKey(element) {
  return (element && element.key) ? element.key : ''
}

class DOMTextComponent {
  constructor(element) {
    this._currentElement = element
  }

  mountComponent() {
    const text = DOM.createElement(this._currentElement)
    this._domNode = text
    return text
  }

  receiveComponent(nextElement) {
    if (nextElement !== this._currentElement) {
      DOM.replaceNode(this._domNode, DOM.createElement(nextElement))
    }
  }

  unmountComponent() {
    // TODO: unmount text
  }
}

class DOMComponent {
  constructor(element) {
    this._currentElement = element
    this._domNode = null
  }

  mountComponent() {
    const el = DOM.createElement(this._currentElement)
    this._domNode = el
    this._updateDOMProps({}, this._currentElement.props)
    this._createChildren(this._currentElement.props)
    return el
  }

  unmountComponent() {
    this.unmountChildren()
  }

  mountChildren(children) {
    this._renderedChildren = {}
    const mountImages = children.map((child, index) => {
      const element = instantiate(child)
      this._renderedChildren[index] = element
      return Reconciler.mountComponent(element)
    })    
    return mountImages
  }

  updateComponent(prevElement, nextElement) {
    this._currentElement = nextElement
    this._updateDOMProps(prevElement, nextElement)
    this._updateDOMChildren(prevElement.props, nextElement.props)
  }

  _createChildren(props) {
    let children = props.children
    if (!Array.isArray(children)) {
      children = [children]
    }
    const mountImages = this.mountChildren(children)
    for (const child of mountImages) {
      DOM.appendChild(this._domNode, child)
    }
  }

  _updateDOMProps(prevElement, nextElement) {
    DOM.updateProps(this._domNode, prevElement.props, nextElement.props)
  }

  _updateDOMChildren(prevProps, nextProps) {
    const updates = []
    const prevChildren = prevProps.children
    const nextChildren = nextProps.children
    if (typeof nextChildren === 'undefined') {
      return
    }
    Reconciler.updateChildren(this._domNode, prevChildren, nextChildren)
    // const {mountImages, removeNodes} = 
    // Object.keys(removeNodes).forEach((childIndex) => {
    //   updates.push(DOMUpdate.remove(removeNodes[childIndex]))
    // })

    // Object.keys(mountImages).forEach((childIndex) => {
    //   updates.push(DOMUpdate.insert(mountImages[childIndex]))
    // })

    // flushBatches(this._domNode, updates)
    // this._renderedChildren = nextChildren
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

  construct(element) {
    this._currentElement = element
  }

  mountComponent() {
    const renderedElement = this.render()
    const renderedComponent = instantiate(renderedElement)
    const markup = Reconciler.mountComponent(renderedComponent)
    this._renderedComponent = renderedComponent
    
    return markup
  }

  receiveComponent(nextElement) {
    this._currentElement = nextElement
    this.updateComponent(this._currentElement, nextElement)
  }

  updateComponen(prevElement, nextElement) {
    this.props = nextElement.props

    const prevRenderedElement = this._renderedComponent._currentElement
    const nextRenderedElement = this.render()

    if (shouldUpdateComponent(prevRenderedElement, nextRenderedElement)) {
      Reconciler.receiveComponent(this._renderedComponent, nextRenderedElement)
    } else {
      Reconciler.unmountComponent(this._renderedComponent)
      const nextRenderedComponent = instantiate(nextRenderedElement)
      const nextMarkup = Reconciler.mountComponent(nextRenderedComponent)
      DOM.replaceNode(this._renderedComponent._domNode, nextMarkup)
      this._renderedComponent = nextRenderedComponent
    }
  }
}

Component.prototype.isComponent = true

export {Component, DOMComponent, DOMTextComponent, isComponentClass}
