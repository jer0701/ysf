import { typeNumber } from "./utils";

function render(Vnode, container, isUpdate) {
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

    Vnode._hostNode = domNode

    if (isUpdate) {
        console.log(container)
        container.removeChild()
        console.log(container)
        container.appendChild(domNode)
    } else {
        container.appendChild(domNode)
    }
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
    let childType = typeNumber(children);

    if(childType === 4) { // children 是文本节点
        domNode.textContent = children;
        return;
    }  else if (childType == 7){
        children.forEach(item => {
            render(item, domNode);
        })
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
    instance.parentDomNode = parentDomNode;

    return domNode;
}

function update(oldVnode, newVnode, parentDomNode) {
    if(!oldVnode.type) return;
    if(oldVnode.type === newVnode.type) {
        mapProps(oldVnode._hostNode, newVnode.props);
    } else {
        //remove
        /**整个元素都不同了，直接删除再插入一个新的 */
        render(newVnode, parentDomNode, true);
    }
}
export { render , update }

