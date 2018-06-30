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

export default h