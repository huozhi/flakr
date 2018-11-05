# flakr
> tiny jsx ui framework

🚧🚧🚧 WORK IN PROGRESS 🚧🚧🚧

## Usage

```js
import {h, render, Component} from 'flakr'

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
```

## Development

```sh
npm install
cd examples
parcel index.html
```
