function render(Vnode, container) {
    if(!Vnode) return;
   
    const {type, props} = Vnode;
    if (!type) return;
    const {children} = props;
    console.log(children);

    let domNode;
    const VnodeType = typeof type;
   
    if(VnodeType === 'string') { // 原生dom
        domNode = document.createElement(type);
    } else { // 组件
        domNode = renderComponent(Vnode, container);
    }
   
    mapProps(domNode, props);
    mountChildren(children, domNode);

    Vnode._hostNode = domNode
    container.appendChild(domNode);
    return domNode;
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

function mountChildren(children, domNode) {
    if(!children) return;
    let childType = typeof children;

    if(childType === 'string') { // children 是文本节点
        domNode.textContent = children;
        return;
    }
    render(children, domNode);
}

function renderComponent(Vnode, parentDomNode) {
    const ComponentClass = Vnode.type;
    const {props} = Vnode;

    const instance = new ComponentClass(props);
    const renderedVnode = instance.render();
    const domNode = render(renderedVnode, parentDomNode);

    instance.Vnode = renderedVnode;
    return domNode;
}

function update(oldVnode, newVnode) {
    if(!oldVnode.type) return;
    if(oldVnode.type === newVnode.type) {
        mapProps(oldVnode._hostNode, newVnode.props);
    } else {
        //remove
    }
}
export { render , update }