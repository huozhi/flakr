import {DOMComponent, DOMTextComponent} from './component'
import {isComponentClass} from './component'

function instantiate(vdom) {
  let instance = null
  if (typeof vdom === 'object' && vdom !== null) {
    if (isComponentClass(vdom.type)) {
      instance = new vdom.type(vdom.props)
      // const element = instance.render()
      instance.props = vdom.props
      instance.type = vdom.type
      // instance.construct(element)
    }
    else if (typeof vdom.type === 'string') {
      instance = new DOMComponent(vdom)
      instance.props = vdom.props
      instance.type = vdom.type
    }
  } else if (typeof vdom === 'string' || typeof vdom === 'number') {
    instance = new DOMTextComponent(vdom)
  }
  return instance
}

// if (typeof vdom === 'string' || typeof vdom === 'number') {
//   node = createTextNode(vdom)
// } else if (typeof vdom === 'object' && vdom !== null) {
//   const {type, props} = vdom
//   if (isComponentClass(type)) {
//     const instance = new type(props)
//     instance.props = props
//     node = instance.render()
//     return mount(node)
//   } else if (typeof type === 'function') {
//     return mount(type(props))
//   }

//   return createDOMNode(type, props)
// }

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
