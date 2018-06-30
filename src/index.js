function isComponentClass(type) {
  return (
    Boolean(type.prototype) &&
    Boolean(type.prototype.isComponent)
  )
}

function createElement(vdom) {
  let node
  if (typeof vdom === 'string' || typeof vdom === 'number') {
    node = document.createTextNode('' + vdom)
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

function createDOMNode(type, props) {
  const node = document.createElement(type)
  const children = props.children
  if (Array.isArray(children)) {
    for (const child of children) {
      node.appendChild(createElement(child))
    }
  } else if (children != null) {
    node.appendChild(createElement(children))
  }

  for (const prop of Object.keys(props)) {
    const value = props[prop]

    if (prop === 'children' || value == null || value === false) {
      continue
    }

    if (prop[0] === 'o' && prop[1] === 'n') {
      const event = prop.slice(2)
      node.addEventListener(event, value)
    } else {
      try {
        node[prop] = value
      } catch (_) {
        node.setAttribute(prop, value)
      }
    }
  }
  return node
}

function h(type, props, ...args) {
  const children = []
  let node

  // args is jsx children
  while (args.length) {
    node = args.pop()
    if (Array.isArray(node)) {
      Array.prototype.push.apply(children, node)
    } else if (node != null && typeof node !== 'boolean') {
      if (typeof node === 'number') {
        node = node + ''
      }
      children.unshift(node)
    }
  }
  props = props || {}
  props.children = children

  return {type, props}
}

export {createElement, h}
