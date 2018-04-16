import {render, DOM} from '../src'

test('mount element', () => {
  const {div, button} = DOM
  const dom = render(
    div([
      button(
        {className: 'btn', onclick: () => alert('welcome')},
        'greet'
      )
    ])
  )
  document.body.appendChild(dom)
  const btn = document.querySelector('button')

  expect(btn.className).toBe('btn')
  expect(btn.innerHTML).toBe('greet')
})

