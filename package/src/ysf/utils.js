let __type = Object.prototype.toString;

const numberMap = {
    "[object Boolean]": 2,
    "[object Number]": 3,
    "[object String]": 4,
    "[object Function]": 5,
    "[object Symbol]": 6,
    "[object Array]": 7
};


/**
 * undefined: 0, null: 1, boolean:2, number: 3, string: 4, function: 5, symbol:6, array: 7, object:8
 * @param {any} data 
 */
export function typeNumber(data) {
    if (data === null) {
        return 1;
    }
    if (data === 'undefined') {
        return 0;
    }
    var a = numberMap[__type.call(data)];
    return a || 8;
}

export function isEventName(name) {
    return /^on[A-Z]/.test(name);
}

export var options = {
    updateBatchNumber: 1,
    immune: {}
}

export function extend(obj, props) {
    if (props) {
        for (let i in props) {
            if (props.hasOwnProperty(i)) 
                obj[i] = props[i]
        }
    }
    return obj
}