import {instantiate, shouldUpdateComponent} from './dom'

function mountComponent(instance) {
  const markup = instance.mountComponent()
  return markup
}

function unmountComponent(instance) {
  return instance.unmountComponent()
}

function receiveComponent(instance, nextElement) {
  const currentElement = instance._currentElement
  if (currentElement === nextElement) return

  instance.receiveComponent(nextElement)
}

function mountChildren() {

}

function diffChildren(
  prevChildren, // instances
  nextChildren, // elements
) {
  if (!prevChildren || !nextChildren) { return }

  // const length = Math.max(prevChildren.length, nextChildren.length)
  const mountImages = {}
  const removeNodes = {}
  let truthyChildCount = 0

  for (let i = 0; i < nextChildren.length; i++) {
    const prevChild = prevChildren[i]
    const nextChild = nextChildren[i]
    const prevElement = (prevChild && prevChild._currentElement) || null
    const nextElement = nextChildren[i]

    if (prevChild && shouldUpdateComponent(prevElement, nextElement)) {
      nextChildren[i] = prevChild
      receiveComponent(prevChild, nextElement)
    } else {
      if (prevElement) {
        removeNodes[i] = prevChild._domNode
        unmountComponent(prevChild)
      }
      const nextChild = instantiate(nextElement)
      nextChildren[i] = nextChild
      mountImages[truthyChildCount] = mountComponent(nextChild)
    }
    if (nextChildren[i] != null && nextChildren[i] !== false) {
      truthyChildCount++
    }
  }
  for (let i = 0; i < prevChildren.length; i++) {
    if (!nextChildren.hasOwnProperty(prevChildren[i])) {
      const prevChild = prevChildren[i]
      removeNodes[i] = prevChild._domNode
      unmountComponent(prevChild)
    }
  }
  return {mountImages, removeNodes}
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
  diffChildren,
  unmountChildren,
}

export default Reconciler
