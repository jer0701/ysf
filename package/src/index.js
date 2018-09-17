// import {React} from './ysf/createElement.js'

// console.log(
//     <div className="test">
//         <span></span>
//     </div>
// )

import React from './ysf';
import ReactDOM from './ysf';

class FuckApp extends React.Component {
    constructor() {
        super()
        this.state = {
          counter: 1
        }
        setTimeout(() => {
          this.setState({ counter: this.state.counter + 2 })
        }, 1500);
      }
      render() {
        return (
          <div style={{ height: `${10 * this.state.counter}px`, border: '1px solid black', transition: 'all 0.2s' }}>
         
            {this.state.counter === 1 ? <p>1</p> : <h1>1</h1>}
          </div>
        )
      }
}

// ReactDOM.render(
//    <div className='fuck' style={{
//     background: '#eee',
//     height: '100px',
//     width: '100px'
//     }}>
//         <div
//             className='bitch'
//             style={{
//                 background: 'red',
//                 height: '40px',
//                 width: '40px'
//             }} />

//     </div>,
//    document.getElementById('root')
// )
ReactDOM.render(
    <FuckApp />,
    document.getElementById('root')
 )