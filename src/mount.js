import DOM from './dom'
import Reconciler from './reconciler'
import {instantiate} from './element'

const ROOT_KEY = 'vrootId'
let rootId = 0

function mount(element, container) {
  container.dataset[ROOT_KEY] = rootId
  const component = instantiate(element)
  const renderedNode = Reconciler.mountComponent(component)
  DOM.empty(container)
  DOM.appendChild(container, renderedNode)
  // if (typeof element === 'string' || typeof element === 'number') {
  //   return element
  //   // return createTextNode(element)
  // } else if (element != null) {
  //   return createDOMNode(element)
  // }
  rootId++
}

function unmountAt(container) {
  const rootEl = container && container.firstChild
  if (rootEl) {
    while (container.lastChild) {
      container.removeChild(container.lastChild)
    }
  }
}

function render(element, container) {
  if (container.dataset[ROOT_KEY]) {
    // TODO: update node
  } else {
    return mount(element, container)
  }
}

const Mount = {render, unmountAt}

export default Mount
