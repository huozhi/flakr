import {isComponentClass} from './component'

const EXPICITY_ATTRS = ['list', 'draggable', 'spellcheck'/*, 'translate'*/]

function mount(vdom) {
  let node
  if (typeof vdom === 'string' || typeof vdom === 'number') {
    node = createTextNode(vdom)
  } else if (typeof vdom === 'object' && vdom !== null) {
    const {type, props} = vdom
    if (isComponentClass(type)) {
      const instance = new type(props)
      instance.props = props
      node = instance.render()
      return mount(node)
    } else if (typeof type === 'function') {
      return mount(type(props))
    }

    return createDOMNode(type, props)
  }
  return node
}

function unmount(container) {
  const rootEl = container && container.firstChild
  if (rootEl) {
    while (container.lastChild) {
      container.removeChild(container.lastChild)
    }
  }
}

function createTextNode(value) {
  return document.createTextNode(value)
}

function createDOMNode(type, props) {
  const node = document.createElement(type)
  if (!Array.isArray(props.children)) {
    props.children = [props.children]
  }
  for (const child of props.children) {
    node.appendChild(mount(child))
  }

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

export {mount}
