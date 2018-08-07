function h(type, props, ...args) {
  const children = []
  let node

  // args is jsx children
  while (args.length) {
    node = args.pop()
    let element = node
    if (Array.isArray(node)) {

      // TODO: not flattern children
      // Array.prototype.push.apply(children, node)
      element = node.map((childArgs) => h(childArgs))
    } else if (node != null && typeof node !== 'boolean') {
      element = node // instantiate(node)
    }
    children.push(element)
  }
  props = props || {}
  props.children = children

  return {type, props}
}

export default h
