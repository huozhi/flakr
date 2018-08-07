import {h, Mount, Component} from '../src'

class View extends Component {
  render() {
    const {text, visible} = this.props
    return (
      <div>
        <button className="btn" onclick={() => console.log('hello cls')}>
          {text}
        </button>
        {visible &&
          <div>
            visible
          </div>
        }
      </div>
    )
  }
}
// View.prototype.isComponent = true // hack for inhreit from Component
const root = document.querySelector('#root')
const label = 'this is class'
let visible = false
let element = <View text={label} visible={visible} />
Mount.render(element, root)

document.addEventListener('click', () => {
  visible = !visible
  element = <View text={label} visible={visible} />
  Mount.render(element, root)
})

