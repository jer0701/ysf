import { isEventName, options } from "./utils";

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
        if(isEventName(propsName)) {
            let eventName = propsName.slice(2).toLowerCase(); // onClick => click
            mappingStrategy['event'](domNode, props[propsName], eventName);
            continue;
        }
        domNode[propsName] = props[propsName];
    }
}

var mappingStrategy = {
    event: function(domNode, eventCallback, eventName) {
        let events = domNode.__events || {};
        events[eventName] = eventCallback;
        domNode.__events = events;
        listenTo(document, dispatchEvent, eventName);
    }
}

function listenTo(domNode, fn, eventName) {
    if(domNode.addEventListener) { // w3c
        domNode.addEventListener(eventName, fn, false); // 冒泡，事件代理
    } else if (domNode.attachEvent) { // ie
        domNode.attachEvent("on" + eventName, fn);
    }
}

function dispatchEvent(event) {
    const path = getEventPath(event);

    options.async = true

    triggerEventByPath(path)//触发event默认以冒泡形式

    options.async = false
    
    for(let dirty in options.dirtyComponent){
        options.dirtyComponent[dirty].updateComponent()
    }
    options.dirtyComponent = {}//清空
}

function getEventPath(event) {
    let path = [];
    let begin = event.target;

    while(1) {
        if(begin.__events) {
            path.push(begin);
        }
        begin = begin.parentNode; // 从子节点向祖先节点进行迭代
        if(!begin) {
            break;
        }
    }
    return path;
}

function triggerEventByPath(path) {
    for(let i = 0; i < path.length; i++) {
        const events = path[i].__events;
        for(let eventName in events) {
            let fn = events[eventName];
            if(typeof fn === 'function') {
                fn.call(path[i]);
            }
        }
    }
}



export {mapProps}