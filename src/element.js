import {createDOMNode, createTextNode} from './dom'
import {isComponentClass} from './component'

function createElement(vdom) {
  let node
  if (typeof vdom === 'string' || typeof vdom === 'number') {
    node = createTextNode(vdom)
  } else if (typeof vdom === 'object' && vdom !== null) {
    const {type, props} = vdom
    if (isComponentClass(type)) {
      const instance = new type(props)
      instance.props = props
      node = instance.render()
      return createElement(node)
    } else if (typeof type === 'function') {
      return createElement(type(props))
    }

    return createDOMNode(type, props)
  }
  return node
}

export {createElement}
