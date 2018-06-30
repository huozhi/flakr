import {createElement} from './element'

function createTextNode(value) {
  return document.createTextNode(value)
}

function createDOMNode(type, props) {
  const node = document.createElement(type)
  if (!Array.isArray(props.children)) {
    props.children = [props.children]
  }
  for (const child of props.children) {
    node.appendChild(createElement(child))
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

export {createTextNode, createDOMNode}