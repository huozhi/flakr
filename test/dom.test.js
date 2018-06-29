import {h, createElement} from '../src'

beforeEach(() => {
  document.body.innerHTML = ''
})

test('jsx functional element', () => {
  const label = 'this is pure function'
  const dom = createElement(
    <div>
      <button className="btn" onclick={() => alert('hello func')}>
        {label}
      </button>
    </div>
  )

  document.body.appendChild(dom)
  
  const btn = document.querySelector('button')
  expect(btn.className).toBe('btn')
  expect(btn.textContent).toBe(label)
})

test('jsx class instance element', () => {
  class View {
    render() {
      const {text} = this.props
      return (
        <div>
          <button className="btn" onclick={() => alert('hello cls')}>
            {text}
          </button>
        </div>
      )
    }
  }
  View.prototype.isComponent = true // hack for inhreit from Component
  const label = 'this is class'
  const dom = createElement(<View text={label} />)
  document.body.appendChild(dom)
  
  const btn = document.querySelector('button')
  expect(btn.className).toBe('btn')
  expect(btn.textContent).toBe(label)
})

