# hoodie

## Development

```sh
npm install
npm test # run jest tests
```

## Usage

```js
import {h, mount, Component} from 'hoodie'

class View extends Component {
  render() {
    return (
      <div>
        <button onclick={() => alert('ok')}>click</button>
      </div>
    )
  }
}

const domNode = mount(<View />)
document.body.appendChild(domNode)
```
