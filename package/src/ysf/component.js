import { update } from './vdom';
import {options} from './utils';

export const LifeCycle = {
    CREATE: 0,//创造节点
    MOUNT: 1,//节点已经挂载
    UPDATING: 2,//节点正在更新
    UPDATED: 3,//节点已经更新
    MOUNTTING: 4//节点正在挂载
}

class Component {
    constructor(props, context) {
        this.props = props;
        this.context = context;
        this.state = this.state || {};
        this.nextState = null;
        this.setStateQueue = [];
        this.lifeCycle = LifeCycle.CREATE
    }

    setState(partialState) {
        this.nextState = Object.assign({}, this.state, partialState)
        //this.enqueueSetState(partialState);
        //this.updateComponent();
        if (this.lifeCycle === LifeCycle.CREATE) {
            //组件挂载期
          } else {
            //组件更新期
            if (this.lifeCycle === LifeCycle.MOUNTTING) {
              //componentDidMount的时候调用setState
              this.state = Object.assign({}, this.state, partialState)
              this.setStateQueue.push(partialState);
              return
            }

            if (options.async === true) {
                //事件中调用
                let dirty = options.dirtyComponent[this]
                if (!dirty) {
                  options.dirtyComponent[this] = this
                }
                return
            }
      
            //不在生命周期中调用，有可能是异步调用
           
            this.updateComponent()
          }
        
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
   
    _updateInLifeCycle() {
        if (this.setStateQueue.length > 0) {
          this.nextState = { ...this.state }
          this.setStateQueue = []
          try {
            this.updateComponent();
          } catch(e) {
            console.warn(e)
          }
        }
    }
    
    
    //componentWillMount(){}
    componentDidMount(){}
    //componentWillReceiveProps(){}
    //shouldComponentUpdate(){}
    //componentWillUpdate(){}
    //componentDidUpdate(){}
    //componentWillUnmount(){}

    render(){}
}



export {Component}