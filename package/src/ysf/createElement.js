import { typeNumber } from "./utils";

class Vnode {
    constructor(type, props, key, ref) {
        this.type = type;
        this.props = props;
        this.key = key;
        this.ref = ref;
    }
}

function createElement(type, config, ...children) {
    let props = {},
        key = null,
        ref = null;
    
    if(config != null) {
        key = config.key === undefined ? null : config.key;
        ref = config.ref === undefined ? null : config.ref;

        for(let propName in config) {
            if(propName == 'key' || propName == 'ref') continue;

            if(config.hasOwnProperty(propName)) {
                props[propName] = config[propName];
            }
        }
    }

    if(children.length == 1) {
        props.children = children[0];
    } else if(children.length > 1) {
        props.children = children;
    }

    return new Vnode(type, props, key, ref);
}

function flattenChildren(children) { // 多个平级子节点
    let childType = typeNumber(children),
        childArr = [];

    if(childType == 3 || childType == 4) { // 文字节点
        return new Vnode('#text', children, null, null);
    }
    
    if(childType != 7) return children; //如果子节点不是数组列表，就不用下一步了

    children.forEach((item) => {
        if(typeNumber(item) === 7){ // 可能子节点也是一个Vnode列表
            item.forEach((item)=>{
                childArr.push(item)
            })
        } else {
            childArr.push(item);
        }
        
    });

    childArr = childArr.map(item => {
        if(typeNumber(item) == 3 || typeNumber(item) == 4) {
            item = new Vnode('#text', item, null, null);
        }
        return item;
    })
  
    return childArr;
    
}

export { createElement, flattenChildren }