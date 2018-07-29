import {isComponentClass} from './component'

const EXPICITY_ATTRS = ['list', 'draggable', 'spellcheck'/*, 'translate'*/]

/**
 * instantiate
 * @param {object} vdom 
 * @return {object} element
 */
function instantiate(vdom) {
  if (typeof vdom === 'object' && vdom !== null) {
    const {type, props} = vdom
    if (isComponentClass(type)) {
      const instance = new type(props)
      instance.props = props
      instance._construct(vdom)
      const element = instance.render()
      return instantiate(element)
    } else if (typeof type === 'function') {
      const element = type(props)
      return instantiate(element)
    }
  }
  return vdom
}

function mount(element) {
  if (typeof element === 'string' || typeof element === 'number') {
    return createTextNode(element)
  } else if (element != null) {
    return createDOMNode(element)
  }
  return null
}

function unmount(container) {
  const rootEl = container && container.firstChild
  if (rootEl) {
    while (container.lastChild) {
      container.removeChild(container.lastChild)
    }
  }
}

function replace(parent, node, nextNode) {
  if (parent) {
    parent.replaceChild(node, nextNode)
  }
}

function createTextNode(value) {
  return document.createTextNode(value)
}

function createDOMNode(element) {
  const {type, props} = element
  const node = document.createElement(type)
  // if (!Array.isArray(props.children)) {
  //   props.children = [props.children]
  // }
  // for (const child of props.children) {
  //   node.appendChild(createDOMNode(child))
  // }

  for (const name in props) {
    if (name === 'children') continue
    updateProperty(node, name, null, props[name])
  }
  return node
}

function updateProperty(node, name, currValue, nextValue) {
  if (name === 'style') {
    const styles = Object.assign({}, currValue, nextValue)
    for (const key in styles) {
      node[name] = nextValue || ''
    }
  } else {
    if (name[0] === 'o' && name[1] === 'n') {
      const event = name.slice(2)
      if (typeof nextValue !== 'function') {
        node.removeEventListener(event, currValue)
      } else if (typeof currValue !== 'function') {
        node.addEventListener(event, nextValue)
      }
      return
    } else if (name in node && !EXPICITY_ATTRS.includes(name)) {
      node[name] = nextValue == null ? '' : nextValue
    } else if (nextValue != null && nextValue !== false) {
      node.setAttribute(name, nextValue)
    }
    if (nextValue == null || nextValue === false) {
      node.removeAttribute(name)
    }
  }
}

function shouldUpdateComponent(element, nextElement) {
  const type = typeof element
  const nextType = typeof nextElement

  if (type === 'string') return nextType === 'string'
  return element.type === nextElement.type
}

export {instantiate, mount, shouldUpdateComponent}
