// import {React} from './ysf/createElement.js'

// console.log(
//     <div className="test">
//         <span></span>
//     </div>
// )

import React from './ysf';
import ReactDOM from './ysf';
// import { h, render, Component } from 'preact';
class C extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      c: 2
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    console.log('shouldComponentUpdate');
    return true;
  }
  componentWillReceiveProps(nextProps, nextContext) {
    console.log('目前的props:', this.props)
    console.log('下一个props:', nextProps)
  }
  componentDidUpdate() {
    console.log('更新结束')
  }
  componentWillUnMount(){
    console.log('组件准备删除')
  }
  click(e) {
    this.setState({
      c: this.state.c + 1
    })
  }
  render() {
    return (
      <div>
        外部属性:{this.props.name}->>>>{this.state.c}
        <button onClick={this.click.bind(this)}>点我C</button>
      </div>)

  }
}

class FuckApp extends React.Component {
  constructor() {
      super()
      this.state = {
        counter: 1,
        val: 0
      }
      // setTimeout(() => {
      //   this.setState({ counter: this.state.counter + 2 })
      // }, 1500);
    }
    componentDidMount() {
      this.setState({val: this.state.val + 1});
      console.log(this.state.val);    // 第 1 次 log
  
      // this.setState({val: this.state.val + 1});
      // console.log(this.state.val);    // 第 2 次 log
  
      // setTimeout(() => {
      //   this.setState({val: this.state.val + 1});
      //   console.log(this.state.val);  // 第 3 次 log
  
      //   this.setState({val: this.state.val + 1});
      //   console.log(this.state.val);  // 第 4 次 log
      // }, 0);
    }
    componentWillMount() {
      console.log('将要挂载')
  
    }
    click(e) {
      this.setState({ counter: this.state.counter + 1 })
    }
    render() {
      return (
        <div>
          {this.state.counter == 1 ? (<div>{[1,2,3].map((el)=>{ return (<span key={el}>{el}</span>)})}</div>):(<div>{[3,2,1].map((el)=>{ return (<span key={el}>{el}</span>)})}</div>)}
          <button onClick={this.click.bind(this)}>点我</button>
          {this.state.counter == 1 ? <C name={this.state.counter} />: <C name={this.state.counter + 1} />}
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

React.render(
  <FuckApp />,
  document.getElementById('root')
)

