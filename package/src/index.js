// import {React} from './ysf/createElement.js'

// console.log(
//     <div className="test">
//         <span></span>
//     </div>
// )

import {React} from './ysf/createElement';
import {ReactDOM} from './ysf/render';
import {Component} from './ysf/component';

class FuckApp extends Component {
    constructor(props) {
        super(props);
        setInterval(function(){
            const color = ['#eee', 'black', 'red', 'green', 'blue', 'grey', '#133234', '#123213', '#222345', '#998232'];
            const rand = parseInt(Math.min(10, Math.random()*10));
            this.setState({
                color: color[rand]
            })
        }.bind(this),1000);
    }
    state = {
        color: 'red'
    }
    render() {
        return <div style={{height: '100px', width: '100px', background: this.state.color}} className='I am FuckApp component'></div>
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