import {isComponentClass} from './component'

const EXPICITY_ATTRS = ['list', 'draggable', 'spellcheck'/*, 'translate'*/]



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
    updateProperty(node, name, null, props[name])
  }
  return node
}

function createElement(element) {
  if (typeof element === 'string' || typeof element === 'number') {
    return createTextNode(element)
  } if (element != null && element !== false) {
    return createDOMNode(element)
  }
  return null
}

function updateProps(node, currProps, nextProps) {
  const distProps = Object.assign({}, currProps, nextProps)
  for (const name in distProps) {
    updateProperty(node, name, currProps[name], nextProps[name])
  }
  return node
}

function updateProperty(node, name, currValue, nextValue) {
  if (name === 'children') { return }
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

function insertChildAfter(node, child, afterNode) {
  node.insertBefore(child, afterNode ? afterNode.nextSibling : node.firstChild)
}

function removeChild(node, child) {
  node.removeChild(child)
}

function replaceNode(node, replacedNode) {
  node.parentNode && node.parentNode.replaceChild(replacedNode, node)
}

function appendChild(node, childNode) {
  node.appendChild(childNode)
}

function empty(node) {
  [].slice.call(node.childNodes).forEach(node.removeChild, node)
}

const DOM = {
  empty,
  appendChild,
  createElement,
  updateProps,
  insertChildAfter,
  removeChild,
  replaceNode,
}

export default DOM
