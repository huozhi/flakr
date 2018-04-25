import {h, render, DOM} from '../src'

test('functional mounting element', () => {
  const {div, button} = DOM
  const vdom = (
    div([
      button(
        {className: 'btn', onclick: () => alert('welcome')},
        'greet'
      )
    ])
  )

  const dom = render(vdom)
  document.body.appendChild(dom)
  const btn = document.querySelector('button')

  expect(btn.className).toBe('btn')
  expect(btn.innerHTML).toBe('greet')
})

test('jsx mounting element', () => {
  const dom = render(
    <div>
      <button className="btn" onclick={() => alert('jsx')}>
        greet
      </button>
    </div>
  )

  document.body.appendChild(dom)
  const btn = document.querySelector('button')

  expect(btn.className).toBe('btn')
  expect(btn.innerHTML).toBe('greet')
})

