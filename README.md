# f-dom

## Development

```sh
npm install
npm test # run jest tests
```

## Usage

```js
import {h, createElemnt, Component} from 'f-dom'

class View extends Component {
  render() {
    return (
      <div>
        <button onclick={() => alert('ok')}>click</button>
      </div>
    )
  }
}

const domNode = createElement(<View />)
document.body.appendChild(domNode)
```
