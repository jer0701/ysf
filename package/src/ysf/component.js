import { update } from './render';

class Component {
    constructor(props) {
        this.props = props;
        this.state = this.state || {};
        this.nextState = null;
    }

    updateComponent(instance, oldVnode, newVnode) {
        update(oldVnode, newVnode)
    }

    setState(partialState) {
        const preState = this.state;
        this.nextState = {...this.state, ...partialState};
        this.state = this.nextState;

        const oldVnode = this.Vnode;
        const newVnode = this.render();

        this.updateComponent(this, oldVnode, newVnode);
    }

    render(){}
}


export {Component}