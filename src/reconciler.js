function mountComponent(instance) {
  const markup = instance.mountComponent()
  return markup
}

function unmountComponent(instance) {
  return instance.unmountComponent()
}

function receiveComponent(instance, nextElement) {
  const currentElement = instance._currentElement
  if (currentElement === nextElement) { return }

  instance.receiveComponent(nextElement)
}

function unmountChildren(renderedChildren) {
  if (!renderedChildren) {
    return
  }
  Object.keys(renderedChildren).forEach(childKey => {
    unmountComponent(renderedChildren[childKey])
  })
}

const Reconciler = {
  mountComponent,
  unmountComponent,
  receiveComponent,
  unmountChildren,
}

export default Reconciler
