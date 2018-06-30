function isComponentClass(type) {
  return (
    Boolean(type.prototype) &&
    Boolean(type.prototype.isComponent)
  )
}

class Component {
  constructor(props) {
    this.props = props
  }
}

Component.prototype.isComponent = true

export {Component, isComponentClass}