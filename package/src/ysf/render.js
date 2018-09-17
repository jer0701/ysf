import { typeNumber } from "./utils";
import { flattenChildren } from './createElement';

function render(Vnode, container, isUpdate) {
    if(!Vnode) return;
   
    const {type, props} = Vnode;
    //if (!type) return; // 使用 flattenChildren 之后，文字节点也有 type 了
    const {children} = props;

    let domNode;
    const VnodeType = typeof type;
   
    if(VnodeType === 'string' && type === '#text') { // 文字节点
        domNode = document.createTextNode(Vnode.props);
    } else if(VnodeType === 'function'){ // 组件
        domNode = renderComponent(Vnode, container);
    } else { // 原生dom
        domNode = document.createElement(type);
    }
   
    mapProps(domNode, props);
    if(children) {
        props.children = mountChildren(children, domNode); //flatten 之后的 child 要保存下来方便 updateChild
    }
    
    if (isUpdate) {
        console.log(container)
        container.removeChild(Vnode._hostNode)
        console.log(container)
        container.appendChild(domNode)
    } else {
        container.appendChild(domNode)
    }

    Vnode._hostNode = domNode
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
    let flattenChildList = children;

    if(childType === 4) { // children 是文本节点
        domNode.textContent = children;
        return;
    }  else if (childType === 7){
        flattenChildList = flattenChildren(children);
        flattenChildList.forEach(item => {
            render(item, domNode);
        })
        return;
    } else if (childType === 8) {
        render(children, domNode);
    }

    return flattenChildList; // 将这个新的 children 返回
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
    newVnode._hostNode = oldVnode._hostNode
    if(oldVnode.type === newVnode.type) {
        //mapProps(oldVnode._hostNode, newVnode.props); //节点如果有 children 也需要更新，所以不用这个了
        if(typeof oldVnode.type === 'string') { // 原生dom
            // 先更新css
            const nextStyle = newVnode.props.style;
            if(oldVnode.props.style !== nextStyle) {
                Object.keys(nextStyle).forEach((styleName) => {
                    oldVnode._hostNode.style[styleName] = nextStyle[styleName];
                })
            }
            // 更新后的child，返回给组件
            newVnode.props.children = updateChild(oldVnode.props.children, newVnode.props.children, newVnode._hostNode);
        }
        if(typeof oldVnode.type === 'function') { // 组件

        } 

    } else {
        //remove
        /**整个元素都不同了，直接删除再插入一个新的 */
        render(newVnode, parentDomNode, true);
    }

    return newVnode;
}

function updateChild(oldChild, newChild, parentDomNode) {
    newChild = flattenChildren(newChild);
    
    //存在只有单个 child 的情况，如果不是 array 就转化成 array
    if (!Array.isArray(oldChild)) {
        oldChild = [oldChild]
    }
    if (!Array.isArray(newChild)) {
        newChild = [newChild]
    }

    let maxlen = Math.max(oldChild.length, newChild.length);
    for(let i = 0; i < maxlen; i++) {
        const oldChildVnode = oldChild[i];
        const newChildVnode = newChild[i];

        if(oldChildVnode._hostNode) {
            newChildVnode._hostNode = oldChildVnode._hostNode;
        }
        if (oldChildVnode.type === newChildVnode.type) {
            if (oldChildVnode.type === '#text') {
                updateText(oldChildVnode, newChildVnode, parentDomNode)
            }else{
                update(oldChildVnode, newChildVnode, oldChildVnode._hostNode)
            }
        } else {
            //如果类型都不一样了，直接替换
            render(newChildVnode,parentDomNode,true)
            if (typeof newChildVnode.type === 'string') { 
                console.log(oldChildVnode)
                
            }
            if (typeof newChildVnode.type === 'function') {//非原生
    
            }
        }
    }

    return newChild;
}

function updateText(oldTextVnode, newTextVnode, parentDomNode) {
    let dom = oldTextVnode._hostNode
    if (oldTextVnode.props !== newTextVnode.props) {
        dom.nodeValue = newTextVnode.props
    }
}

export { render , update }

