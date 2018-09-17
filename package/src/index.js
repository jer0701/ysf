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
        <div key={1} style={{background:`rgb(99,99,${this.state.counter + 1})`}}>
          <div>{[1,2,3].map((el,index)=>{ return (<span key={"x"+index}>{el}</span>)  })}
          sss
          </div>
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