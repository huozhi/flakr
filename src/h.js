function h(type, props = {}, ...args) {
  props = props || {}
  const children = props.children || []
  let node

  // args is jsx children
  while (args.length) {
    node = args.pop()
    if (Array.isArray(node)) {
      // TODO: not flattern children
      Array.prototype.push.apply(children, node)
    } else if (node != null && typeof node !== 'boolean') {
      children.push(node)
    }
  }

  props.children = children
  return {type, props}
}

export default h
