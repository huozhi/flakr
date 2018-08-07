import DOM from './dom'
import Reconciler from './reconciler'
import {instantiate} from './element'

const ROOT_KEY = 'vrootId'
const instanceMap = {}
let rootId = 1

function mount(element, container) {
  container.dataset[ROOT_KEY] = rootId
  const component = instantiate(element)
  instanceMap[rootId] = component

  const renderedNode = Reconciler.mountComponent(component)
  DOM.empty(container)
  DOM.appendChild(container, renderedNode)

  rootId++
}

function unmount(container) {
  const rootEl = container && container.firstChild
  if (rootEl) {
    while (container.lastChild) {
      container.removeChild(container.lastChild)
    }
  }
}

function update(element, container) {
  unmount(container)
  mount(element, container)
}

function render(element, container) {
  if (container.dataset[ROOT_KEY]) {
    const id = container.dataset[ROOT_KEY]
    const instance = instanceMap[id]
    Reconciler.receiveComponent(instance, element)
  } else {
    return mount(element, container)
  }
}

const Mount = {render, unmount}

export default Mount
