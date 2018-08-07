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

const Reconciler = {
  mountComponent,
  unmountComponent,
  receiveComponent,
}

export default Reconciler
