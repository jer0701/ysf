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

export const React = {
    createElement
 }