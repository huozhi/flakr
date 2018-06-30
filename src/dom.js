import {isComponentClass} from './component'

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

  for (const prop of Object.keys(props)) {
    const value = props[prop]

    if (prop === 'children' || value == null || value === false) {
      continue
    }

    if (prop[0] === 'o' && prop[1] === 'n') {
      const event = prop.slice(2)
      node.addEventListener(event, value)
    } else if (prop in node && prop !== 'list') {
      node[prop] = value == null ? '' : value
    } else {
      node.setAttribute(prop, value)
    }
  }
  return node
}

export {mount}
