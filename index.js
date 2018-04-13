const createElement = (vdom) => {
  let node
  if (typeof vdom === 'number') {
    node = node + ''
  }
  if (typeof vdom === 'string') {
    node = document.createTextNode('' + vdom)
  } else if (typeof vdom === 'object' && vdom !== null) {
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

const tag = (tag) => (props, children) => {
  if (Array.isArray(props)) {
    children = props
    props = null
  }

  return {
    name: tag,
    props: Object.assign(props || {}, {children}),
  }
}

