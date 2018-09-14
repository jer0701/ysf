class Component {
    constructor(props) {
        this.props = props;
        this.state = this.state || {};
        this.nextState = null;
    }

    setState(partialState) {
        const preState = this.state;
        this.nextState = {...this.state, ...partialState};
        this.state = this.nextState;

        const oldVnode = this.Vnode;
        const newVnode = this.render();

        updateComponent(this, oldVnode, newVnode);
    }

    render(){}
}

function updateComponent(instance, oldVnode, newVnode) {
    if(!oldVnode.type) return;
    if(oldVnode.type === newVnode.type) {
        mapProps(oldVnode._hostNode, newVnode.props);
    } else {
        //remove
    }
}

function mapProps(domNode,props) {
    for(let propsName in props) {
        if(propsName === 'children') continue;
        if(propsName === 'style') {
            let style = props['style'];
            Object.keys(style).forEach((styleName) => {
                domNode.style[styleName] = style[styleName];
            })
            continue;
        }
        domNode[propsName] = props[propsName];
    }
}

export {Component}