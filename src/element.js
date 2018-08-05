import {DOMComponent, DOMTextComponent} from './component'
import {isComponentClass} from './component'

function instantiate(element) {
  let instance
  if (typeof element === 'object' && element !== null) {
    const {type, props} = element
    if (isComponentClass(type)) {
      instance = new type(props)
      instance.construct(element)
    } else if (typeof type === 'string') {
      instance = new DOMComponent(element)
    }
    // else if (typeof type === 'function') {
    //   instance = type(props) // TODO: stateless component class
    // }
  } else if (typeof element === 'string' || typeof element === 'number') {
    instance = new DOMTextComponent(element)
  }
  // Don't wrap pure text component
  // else if (typeof element === 'number' || typeof element === 'number') {
  //   return DOMComponent.constructTextComponent(element)
  // }
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
