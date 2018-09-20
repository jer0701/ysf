import { typeNumber } from "./utils";
import { flattenChildren } from './createElement';
import { mapProps } from './mapProps';

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

    Vnode._hostNode = domNode; //用于在更新时期oldVnode的时候获取_hostNode
    if(isUpdate) {
        return domNode;
    } else {
        container.appendChild(domNode);
    }
    return domNode;
}


function mountChildren(children, parentDomNode) {
    if(!children) return;
    let childType = typeNumber(children);
    let flattenChildList = children;
  
    if(childType === 3 || childType == 4) { // children 是文本节点
        flattenChildList = flattenChildren(flattenChildList)
        render(flattenChildList, parentDomNode)
    }  else if (childType === 7){
        flattenChildList = flattenChildren(children);
        flattenChildList.forEach(item => {
            render(item, parentDomNode);
        })
    } else if (childType === 8) {
        render(flattenChildList, parentDomNode);
    }
   
    return flattenChildList; // 将这个新的 children 返回
}

function renderComponent(Vnode, parentDomNode) {
    const ComponentClass = Vnode.type;
    const {props} = Vnode;
    
    const instance = new ComponentClass(props);

    if(instance.componentWillMount) {
        instance.componentWillMount();
    }
    const renderedVnode = instance.render();
    const domNode = render(renderedVnode, parentDomNode);

    if(instance.componentDidMount) {
        instance.componentDidMount();
    }

    instance.Vnode = renderedVnode;
    instance.parentDomNode = parentDomNode;

    Vnode._instance = instance; //保存一个自己的实例便于更新

    return domNode;
}

function update(oldVnode, newVnode, parentDomNode) {
    if(!oldVnode.type) return;
    newVnode._hostNode = oldVnode._hostNode
    if(oldVnode.type === newVnode.type) {
        //mapProps(oldVnode._hostNode, newVnode.props); //节点如果有 children 也需要更新，所以不用这个了
        if (oldVnode.type === "#text") {
            updateText(oldVnode, newVnode);
            return newVnode
        }
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
            updateComponent(oldVnode, newVnode);
        } 

    } else {
        //remove
        /**整个元素都不同了，直接删除再插入一个新的 */
        let dom = render(newVnode, parentDomNode, true);
        if(newVnode._hostNode) {
            parentDomNode.removeChild(newVnode._hostNode);
        } else {
            parentDomNode.appendChild(dom)
        }
        
    }

    return newVnode;
}

function updateComponent(oldComponentVnode, newComponentVnode) {
    // const oldState = oldComponentVnode._instance.state;
    // const oldProps = oldComponentVnode._instance.props;
    // const oldContext = oldComponentVnode._instance.context;
    const oldVnode = oldComponentVnode._instance.Vnode
   
    const newProps = newComponentVnode.props;
    const newContext = newComponentVnode.context;
    const newInstance = new newComponentVnode.type(newProps);
    const newState = newInstance.state;

    if(oldComponentVnode._instance.componentWillReceiveProps) {
        oldComponentVnode._instance.componentWillReceiveProps(newProps, newContext);
    }

    if(oldComponentVnode._instance.shouldComponentUpdate) {
        let shouldUpdate = oldComponentVnode._instance.shouldComponentUpdate(newProps, newState, newContext);
        if (!shouldUpdate) {
            //无论shouldComponentUpdate结果是如何，数据都会给用户设置上去
            //但是不一定会刷新
            oldComponentVnode._instance.props = newProps;
            oldComponentVnode._instance.context = newContext;
            newComponentVnode._instance = oldComponentVnode._instance;
            return
        }
    }

    if (oldComponentVnode._instance.componentWillUpdate) {
        oldComponentVnode._instance.componentWillUpdate(newProps, newState, newContext);
    }

    
    const newVnode = newInstance.render();
    oldComponentVnode._instance.state = newState;
    oldComponentVnode._instance.props = newProps;
    oldComponentVnode._instance.context = newContext;
    newComponentVnode._instance = oldComponentVnode._instance;
   
    update(oldVnode, newVnode, oldComponentVnode._hostNode);

    if (oldComponentVnode._instance.componentDidUpdate) {
        oldComponentVnode._instance.componentDidUpdate(newProps, newState, newContext);
    }

}

function isSameVnode(pre, next) {
    if(pre.type === next.type && pre.key === next.key) {
        return true;
    }
    return false;
}

function mapKeyToInedex(old) {
    let hash = {};
    old.forEach((el, index) => {
        if(el.key) {
            hash[el.key] = index;
        }
    });

    return hash;
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

    let oldLength = oldChild.length,
        newLength = newChild.length,
        oldStartIndex = 0,
        newStartIndex = 0,
        oldEndIndex = oldLength - 1,
        newEndIndex = newLength - 1,
        oldStartVnode = oldChild[0],
        newStartVnode = newChild[0],
        oldEndVnode = oldChild[oldEndIndex],
        newEndVnode = newChild[newEndIndex],
        hash;
    
    // 新增子节点
    if(newLength && !oldLength) {
        newChild.forEach( newVnode => {
            render(newVnode, parentDomNode);
        });
        return newChild;
    }

    while(oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
        if(oldStartVnode === undefined || oldStartVnode === null) {
            oldStartVnode = oldChild[++oldStartIndex];
        } else if (oldEndVnode === undefined || oldEndVnode === null) {
            oldEndVnode = oldChild[--oldEndIndex];
        } else if (isSameVnode(oldStartVnode, newStartVnode)) {
            update(oldStartVnode, newStartVnode, parentDomNode);
            oldStartVnode = oldChild[++oldStartIndex];
            newStartVnode = newChild[++newStartIndex];
        } else if (isSameVnode(oldEndVnode, newEndVnode)) {
            update(oldEndVnode, newEndVnode, parentDomNode);
            oldEndVnode = oldChild[--oldEndIndex];
            newEndVnode = newChild[--newEndIndex];
        } else if (isSameVnode(oldStartVnode, newEndVnode)) {
            update(oldStartVnode, newEndVnode, parentDomNode);
            let dom = oldStartVnode._hostNode;
       
            parentDomNode.insertBefore(dom, oldEndVnode._hostNode.nextSibling);
            oldStartVnode = oldChild[++oldStartIndex];
            newEndVnode = newChild[--newEndIndex];
        } else if (isSameVnode(oldEndVnode, newStartVnode)) {
            update(oldEndVnode, newStartVnode, parentDomNode);
            let dom = oldEndVnode._hostNode;
            parentDomNode.insertBefore(dom, oldStartVnode._hostNode);
            oldEndVnode = oldChild[--oldEndIndex];
            newStartVnode = newChild[++newStartIndex];
        } else {
            if(hash === undefined) hash = mapKeyToInedex(oldChild);

            let indexInOld = hash[newStartVnode.key];
            if(indexInOld === undefined) {
                let newElm = render(newStartVnode, parentDomNode, true);
                parentDomNode.insertBefore(newElm, oldStartVnode._hostNode);
                newStartVnode = newChild[++newStartIndex];
            } else {
                let moveVnode = oldChild[indexInOld];
                update(moveVnode, newStartVnode, parentDomNode);
                parentDomNode.insertBefore(moveVnode._hostNode, oldStartVnode._hostNode);
                oldChild[indexInOld] = undefined;
                newStartVnode = newChild[++newStartIndex];
            }
        }

        if (oldStartIndex > oldEndIndex) {
            
            for (; newStartIndex-1 < newEndIndex; newStartIndex++) {
                
                if(newChild[newStartIndex]){
                    render(newChild[newStartIndex], parentDomNode)
                }
            }
            
        } else if (newStartIndex > newEndIndex){
            
            for (; oldStartIndex -1 < oldEndIndex; oldStartIndex++) {
                if(oldChild[oldStartIndex]){
                    let removeNode = oldChild[oldStartIndex];
                    if(typeof removeNode.type === 'function') {
                        if(removeNode._instance.componentWillUnMount){
                            removeNode._instance.componentWillUnMount();
                        }
                    }
                    parentDomNode.removeChild(oldChild[oldStartIndex]._hostNode)
                }
            }
        }
    }

    // let maxlen = Math.max(oldChild.length, newChild.length);
    // for(let i = 0; i < maxlen; i++) {
    //     const oldChildVnode = oldChild[i];
    //     const newChildVnode = newChild[i];
        
    //     // 当节点变多和变少的时候，可能会造成节点数量不相同的情况
    //     // 此时就会出现length不相等
    //     if(newChildVnode && oldChildVnode) {
    //         if(oldChildVnode._hostNode) {
    //             newChildVnode._hostNode = oldChildVnode._hostNode;
    //         }
    //         if (oldChildVnode.type === newChildVnode.type) {
    //             update(oldChildVnode, newChildVnode, oldChildVnode._hostNode)
    //         } else {
    //             //如果类型都不一样了，直接替换
    //             render(newChildVnode, parentDomNode,true)
    //         }
    //     } else if (newChildVnode && !oldChildVnode) {
    //         render(newChildVnode, parentDomNode,true)
    //     } else if ( !newChildVnode && oldChildVnode) {
    //         parentDomNode.removeChild(oldChildVnode._hostNode)
    //     }
        
    // }

    return newChild;
}

function updateText(oldTextVnode, newTextVnode, parentDomNode) {
    let dom = oldTextVnode._hostNode
    if (oldTextVnode.props !== newTextVnode.props) {
        dom.nodeValue = newTextVnode.props
    }
}

export { render , update }

