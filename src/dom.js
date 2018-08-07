import utils from './utils'

const EXPICITY_ATTRS = ['list', 'draggable', 'spellcheck'/*, 'translate'*/]

function createDOMTextElement(value) {
  if (!utils.isTruthy(value)) {
    // placeholder
    return document.createComment(value)
  }
  return document.createTextNode(value)
}

function createDOMElement(element) {
  const {type, props} = element
  const node = document.createElement(type)

  for (const name in props) {
    updateProperty(node, name, null, props[name])
  }
  return node
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
    if (!utils.isTruthy(nextValue)) {
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
  node.parentNode.replaceChild(replacedNode, node)
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
  createDOMElement,
  createDOMTextElement,
  updateProps,
  insertChildAfter,
  removeChild,
  replaceNode,
}

export default DOM
