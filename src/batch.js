import {insertChildAfter, removeChild} from './dom'

const UPDATE_TYPES = {
  INSERT: 1,
  MOVE: 2,
  REMOVE: 3,
}

const DOMUpdate = {
  insert(node, afterNode) {
    return {
      type: UPDATE_TYPES.INSERT,
      node,
      afterNode,
    }
  },
  move(fromIndex, afterNode) {
    return {
      type: UPDATE_TYPES.MOVE,
      fromIndex,
      afterNode,
    }
  },
  remove(node) {
    return {
      type: UPDATE_TYPES.REMOVE,
      node,
    }
  }
}

function flushBatches(parentNode, updates) {
  updateQueue.forEach((update) => {
    switch (update.type) {
      case UPDATE_TYPES.INSERT: {
        insertChildAfter(parentNode, update.node, update.afterNode)
        break
      }
      case UPDATE_TYPES.MOVE: {
        insertChildAfter(parentNode, parentNode.childNodes[update.fromIndex], update.afterNode)
        break
      }
      case UPDATE_TYPES.REMOVE: {
        removeChild(parentNode, update.node)
        break
      }
      default: { break }
    }
  })
}

export {
  DOMUpdate,
  flushBatches,
}
