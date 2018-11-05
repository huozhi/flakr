import {h, render, Component} from '../src'

class View extends Component {
  render() {
    const {text, visible} = this.props
    const listener = visible ? (() => console.log(1)) : (() => console.log(2))
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
        <MemeberHub listener={listener} count={Math.ceil(Math.random() * 10)} />
      </div>
    )
  }
}

class MemeberHub extends Component {
  render() {
    const {count, listener} = this.props
    const data = Array(count).fill().map((_, i) => i)
    return (
      <div className="hub">
        <div>
          <button onclick={listener}>test listener</button>
        </div>
        {data.map(v => <span>{v}</span>)}
      </div>
    )
  }
}

const root = document.querySelector('#root')
const label = 'this is class'
let visible = false
let element = <View text={label} visible={visible} />
render(element, root)

document.addEventListener('click', () => {
  visible = !visible
  element = <View text={label} visible={visible} />
  render(element, root)
})

