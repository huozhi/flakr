const createElement = (vdom) => {
  let node
  if (typeof vdom === 'number') {
    node = node + ''
  }
  if (typeof vdom === 'string') {
    node = document.createTextNode('' + vdom)
  } else if (typeof vdom === 'object' && vdom !== null) {
    // console.log('v', vdom)

    node = document.createElement(vdom.name)
    const {children} = vdom.props
    if (Array.isArray(children)) {
      for (const child of vdom.props.children) {
        node.appendChild(createElement(child))
      }
    } else if (children != null) {
      node.appendChild(createElement(children))
    }

    for (const prop of Object.keys(vdom.props)) {
      const value = vdom.props[prop]

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

  return typeof type === 'function' ? type(props) : {name: type, props}
}

const vnode = (tag) => (props, children) => {
  if (Array.isArray(props)) {
    children = props
    props = null
  }

  return h(tag, props, ...children)
}

const DOM = new Proxy({}, {get: (_, key) => vnode(key)})

export {createElement as render, DOM, h}
