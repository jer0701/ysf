import { update } from './vdom';
import {extend, options} from './utils';
import {transaction} from './transaction';

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
        //this.enqueueSetState(partialState);
        //this.updateComponent();
        this.setStateQueue.push(partialState);
        setStateProxy(this);
    }

    // enqueueSetState(stateChange) {
    //     if ( this.setStateQueue.length === 0 ) {
    //         Promise.resolve().then( () => {
    //             if (this.setStateQueue.length > 0) {
    //                 this.nextState = { ...this.state }
    //                 this.setStateQueue = []
    //                 this.updateComponent()
    //             }
    //         } )
    //     }
    //     this.state = Object.assign({}, this.state, stateChange);
    //     this.setStateQueue.push(this.state);
    // }
    MergeState () {
        var n = this.setStateQueue.length
        if (n == 0) {
            return this.state
        }
        var queue = this.setStateQueue.concat()
        this.setStateQueue.length = 0

        var nextState = extend({}, this.state);
        for (var i = 0; i < n; i++) {
            var partial = queue[i]
            extend(nextState, partial);
        }
        return nextState
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

options.immune.updateComponent = function updateComponent(instance) {
    const preState = instance.state;
    instance.nextState = instance.MergeState();
    
    if(instance.nextState !== preState) {
        instance.state = instance.nextState;
    }

    instance.nextState = null;
    const oldVnode = instance.Vnode; // 在renderComponent 记录了一个Vnode
    const newVnode = instance.render();

    instance.Vnode = update(oldVnode, newVnode, instance.parentDomNode); // 返回一个新的Vnode
}

function setStateProxy(instance) {
    if (!instance._updateBatchNumber) {
        instance._updateBatchNumber = options.updateBatchNumber + 1
    }
    console.log(instance._updateBatchNumber);
    transaction.enqueue(instance);
}

export {Component}