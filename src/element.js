import {DOMComponent, DOMTextComponent} from './component'
import {isComponentClass} from './component'

function instantiate(vdom) {
  let instance = null
  if (typeof vdom === 'object' && vdom !== null) {
    if (isComponentClass(vdom.type)) {
      instance = new vdom.type(vdom.props)
      instance.type = vdom.type
      instance.props = vdom.props
    }
    else if (typeof vdom.type === 'string') {
      instance = new DOMComponent(vdom)
      instance.type = vdom.type
      instance.props = vdom.props
    }
  } else if (typeof vdom === 'string' || typeof vdom === 'number') {
    instance = new DOMTextComponent(vdom)
  }
  return instance
}

function isSameElement(element, nextElement) {
  const type = typeof element
  const nextType = typeof nextElement

  if (type !== 'object') return nextType === type
  if (element && nextElement) {
    return element.type === nextElement.type
  }
  return element === nextElement
}

export {instantiate, isSameElement}
