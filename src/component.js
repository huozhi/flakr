import DOM from './dom'
import {instantiate, isSameElement} from './element'
import Reconciler from './reconciler'
import utils from './utils'

function isComponentClass(type) {
  return (
    Boolean(type.prototype) &&
    Boolean(type.prototype.isComponent)
  )
}

class DOMTextComponent {
  constructor(element) {
    this._currentElement = element
  }

  mountComponent() {
    console.log('text.mount', this._currentElement)
    const text = DOM.createDOMTextElement(this._currentElement)
    this._domNode = text
    return text
  }

  receiveComponent(nextElement) {
    console.log('text.receiveComponent', this._currentElement, nextElement)
    if (nextElement._currentElement !== this._currentElement) {
      const nextText = DOM.createDOMTextElement(nextElement._currentElement)
      DOM.replaceNode(this._domNode, nextText)
      this._domNode = nextText
    }
  }

  unmountComponent() {
    console.log('text.unmount', this._domNode)
    DOM.removeChild(this._domNode.parentNode, this._domNode)
  }
}

class DOMComponent {
  constructor(element) {
    this._currentElement = element
    this._domNode = null
  }

  mountComponent() {
    const el = DOM.createDOMElement(this._currentElement)
    this._domNode = el
    this._updateDOMProps({}, this._currentElement.props)
    this._createChildren(this._currentElement.props)
    return el
  }

  unmountComponent() {
    this.unmountChildren()
    DOM.removeChild(this._domNode.parentNode, this._domNode)
  }

  unmountChildren(props) {
    Object.keys(this._renderedChildren).forEach(childKey => {
      const child = this._renderedChildren[childKey]
      if (utils.isTruthy(child)) Reconciler.unmountComponent(child)
    })
  }

  receiveComponent(nextElement) {
    this.updateComponent(this._currentElement, nextElement)
    this._currentElement = nextElement
  }

  mountChildren(children) {
    this._renderedChildren = {}
    const mountImages = children.filter(utils.isTruthy).map((child, index) => {
      const element = instantiate(child)
      this._renderedChildren[index] = element
      return Reconciler.mountComponent(element)
    })
    return mountImages
  }

  updateComponent(prevElement, nextElement) {
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
    const prevChildren = this._renderedChildren
    // prevProps.children
    const nextChildren = nextProps.children
    if (typeof nextChildren === 'undefined') {
      return
    }
    this.updateChildren(this._domNode, prevChildren, nextChildren)
  }

  updateChildren(
    parentNode,
    prevChildren, // instances
    nextChildren, // elements
  ) {
    if (!prevChildren || !nextChildren) { return }
    const mountImages = []
    const removedNodes = {}
    let domIndex = 0

    for (let i = 0; i < nextChildren.length; i++) {
      const prevChild = prevChildren[i]
      if (utils.isTruthy(prevChild)) {
        domIndex++
      }
      // TODO: fix element not instantiate
      const prevElement = (prevChild && prevChild._currentElement)
      const nextElement = nextChildren[i]
      if (prevChild && isSameElement(prevElement, nextElement)) {
        nextChildren[i] = prevChild
        Reconciler.receiveComponent(prevChild, nextElement)
      } else {
        if (prevElement) {
          removedNodes[i] = prevChild._domNode
          Reconciler.unmountComponent(prevChild)
        }
        const nextChild = instantiate(nextElement)
        nextChildren[i] = nextChild
        if (utils.isTruthy(nextChild)) {
          const nextChildNode = Reconciler.mountComponent(nextChild)
          mountImages.push({pos: domIndex, node: nextChildNode})
        }
      }

    }
    for (let i = 0; i < prevChildren.length; i++) {
      if (!nextChildren.hasOwnProperty(i)) {
        const prevChild = prevChildren[i]
        if (prevChild) {
          removedNodes[i] = prevChild._domNode
          Reconciler.unmountComponent(prevChild)
        }
      }
    }
    for (const mountImage of mountImages) {
      const {pos, node} = mountImage
      DOM.insertChildAfter(parentNode, node, parentNode.childNodes[pos])
    }

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

  construct(element) {
    this._currentElement = element
  }

  mountComponent() {
    const renderedElement = this.render()
    this.construct(renderedElement)
    const renderedComponent = instantiate(renderedElement)
    const markup = Reconciler.mountComponent(renderedComponent)
    this._renderedComponent = renderedComponent

    return markup
  }

  receiveComponent(nextElement) {
    this.updateComponent(this._currentElement, nextElement)
    this._currentElement = nextElement
  }

  updateComponent(prevElement, nextElement) {
    this.props = nextElement.props

    const prevRenderedElement = this._renderedComponent._currentElement
    const nextRenderedElement = this.render()

    if (isSameElement(prevRenderedElement, nextRenderedElement)) {
      const nextComponent = instantiate(nextRenderedElement)
      Reconciler.receiveComponent(this._renderedComponent, nextComponent)
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
