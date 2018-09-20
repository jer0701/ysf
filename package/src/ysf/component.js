import { update } from './vdom';

class Component {
    constructor(props, context) {
        this.props = props;
        this.context = context;
        this.state = this.state || {};
        this.nextState = null;
        this.setStateQueue = [];
    }

    setState(partialState) {
        //this.nextState = {...this.state, ...partialState};
        this.enqueueSetState(partialState);
        //this.updateComponent();
    }

    enqueueSetState(stateChange) {
        if ( this.setStateQueue.length === 0 ) {
            Promise.resolve().then( () => {
                if (this.setStateQueue.length > 0) {
                    this.nextState = { ...this.state }
                    this.setStateQueue = []
                    this.updateComponent()
                }
            } )
        }
        this.state = Object.assign({}, this.state, stateChange);
        this.setStateQueue.push(this.state);
    }

    updateComponent() {
        const preState = this.state;
        if(this.nextState !== preState) {
            this.state = this.nextState;
        }

        this.nextState = null;
        const oldVnode = this.Vnode; // 在renderComponent 记录了一个Vnode
        const newVnode = this.render();
    
        this.Vnode = update(oldVnode, newVnode, this.parentDomNode); // 返回一个新的Vnode
    }
    
    //componentWillMount(){}
    //componentDidMount(){}
    //componentWillReceiveProps(){}
    //shouldComponentUpdate(){}
    //componentWillUpdate(){}
    //componentDidUpdate(){}
    //componentWillUnmount(){}

    render(){}
}


export {Component}