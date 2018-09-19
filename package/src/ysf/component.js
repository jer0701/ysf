import { update } from './vdom';

class Component {
    constructor(props) {
        this.props = props;
        this.state = this.state || {};
        this.nextState = null;
    }

    setState(partialState) {
        this.nextState = {...this.state, ...partialState};
        this.updateComponent();
    }

    updateComponent() {
        const preState = this.state;
        if(this.nextState !== preState) {
            this.state = this.nextState;
        }

        this.nextState = null;
        const oldVnode = this.Vnode; // 在renderComponent 记录了一个Vnode
        const newVnode = this.render();
        console.log(oldVnode);
        this.Vnode = update(oldVnode, newVnode, this.parentDomNode); // 返回一个新的Vnode
        console.log(this.Vnode);
    }
    componentWillMount(){}
    componentDidMount(){}
    componentWillReceiveProps(){}
    shouldComponentUpdate(){}
    componentWillUpdate(){}
    componentDidUpdate(){}
    componentWillUnmount(){}

    render(){}
}


export {Component}