# flakr

## Development

```sh
npm install
npm test # run jest tests
```

## Usage

```js
import {h, render, Component} from 'flakr'

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

const root = document.querySelector('#root')
const label = 'this is class'
render(<View text={label} visible={true} />, root)
```
