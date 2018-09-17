import { update } from './render';

class Component {
    constructor(props) {
        this.props = props;
        this.state = this.state || {};
        this.nextState = null;
    }

    updateComponent() {
        const preState = this.state;
        if(this.nextState !== preState) {
            this.state = this.nextState;
        }

        this.nextState = null;
        const oldVnode = this.Vnode; // 在renderComponent 记录了一个Vnode
        const newVnode = this.render();
   
        update(oldVnode, newVnode, this.parentDomNode);
    }

    setState(partialState) {
        this.nextState = {...this.state, ...partialState};
        this.updateComponent();
    }

    render(){}
}


export {Component}