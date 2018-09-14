function render(Vnode, container) {
    if(!Vnode) return;
   
    const {type, props} = Vnode;
    if (!type) return;
    const {children} = props;

    let domNode;
    const VnodeType = typeof type;
    if(VnodeType === 'string') { // 原生dom
        domNode = document.createElement(type);
    } else { // 组件
        domNode = renderComponent(Vnode, container);
    }
   
    mapProps(domNode, props);
    mountChildren(children, domNode);

    Vnode._hostNode = domNode;
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
    render(children, domNode);
}

function renderComponent(Vnode, container) {
    const ComponentClass = Vnode.type;
    const {props} = Vnode.props;

    const instance = new ComponentClass(props);
    const renderedVnode = instance.render();
    const domNode = render(renderedVnode, container);

    instance.Vnode = renderedVnode;
    return domNode;
}

export const ReactDOM = {
    render:render
 }