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

function getHostDOMNode(element) {
  return element._renderedComponent ? element._renderedComponent._domNode : element._domNode
}

function updateChildren(
  prevChildren, // Instances, as created above
  nextChildren, // Actually elements
  mountImages,
  removedChildren,
) {
  // Just make our code a little bit cleaner so we don't have to do null checks.
  // React skips this to avoid extraneous objects.
  prevChildren = prevChildren || {}

  // Loop over our new children and determine what is being updated, removed,
  // and created.
  Object.keys(nextChildren).forEach(childKey => {
    let prevChild = prevChildren[childKey]
    let prevElement = prevChild && prevChild._currentElement
    let nextElement = nextChildren[childKey]

    // Update
    if (prevChild && shouldUpdateComponent(prevElement, nextElement)) {
      // Update the existing child with the reconciler. This will recurse
      // through that component's subtree.
      receiveComponent(prevChild, nextElement)

      // We no longer need the new instance, so replace it with the old one.
      nextChildren[childKey] = prevChild
    } else {
      // Otherwise
      // Remove the old child. We're replacing.
      if (prevChild) {
        // TODO: make this work for composites
        removedChildren[childKey] = getHostDOMNode(prevChild)
        unmountComponent(prevChild)
      }

      // Instantiate the new child.
      let nextChild = instantiate(nextElement)
      nextChildren[childKey] = nextChild

      // React does this here so that refs resolve in the correct order.
      mountImages.push(mountComponent(nextChild))
    }
  })

  // Last but not least, remove the old children which no longer have any presense.
  Object.keys(prevChildren).forEach(childKey => {
    // debugger
    if (!nextChildren.hasOwnProperty(childKey)) {
      prevChild = prevChildren[childKey]
      removedChildren[childKey] = getHostDOMNode(prevChild)
      unmountComponent(prevChild)
    }
  })
}

function unmountChildren(renderedChildren) {
  if (!renderedChildren) {
    return
  }
  Object.keys(renderedChildren).forEach(childKey => {
    unmountComponent(renderedChildren[childKey])
  })
}

const reconciler = {
  mountComponent, 
  unmountComponent,
  receiveComponent,
  updateChildren,
  unmountChildren,
}

export default reconciler
