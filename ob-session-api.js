export const session_storage_item_set = 'session-storage-item-set';
export const session_storage_item_removed = 'session-storage-item-removed';
const cache = Symbol('cache');
const win = window;
const isLoaded = navigator.deviceMemory > 2;
//export function init(){}
if (!win[cache] && isLoaded) {
    win[cache] = {};
}
if (isLoaded) {
    const originalGetItem = window.sessionStorage.getItem;
    const boundGetItem = originalGetItem.bind(window.sessionStorage);
    window.sessionStorage.getItem = function (key) {
        const item = boundGetItem(key);
        if (item === null)
            return null;
        if (!isLoaded)
            return item;
        const fromCache = win[cache][key];
        if (fromCache)
            return win[cache];
        const firstChar = item[0];
        const lastChar = item[item.length - 1];
        if ((firstChar === '[' && lastChar === ']') || (firstChar === '{' && lastChar === '}')) {
            win[cache][key] = JSON.parse(item);
            return win[cache][key];
        }
        else {
            return item;
        }
    };
}
const originalSetItem = window.sessionStorage.setItem;
const boundSetItem = originalSetItem.bind(window.sessionStorage);
window.sessionStorage.setItem = function (key, val) {
    const oldVal = sessionStorage.getItem(key);
    if (!isLoaded) {
        boundSetItem(key, val);
    }
    else {
        switch (typeof val) {
            case 'string':
                boundSetItem(key, val);
                break;
            case 'object':
                win[cache][key] = val;
                boundSetItem(key, JSON.stringify(val));
                break;
            default:
                throw "Not Implemented";
        }
    }
    const detail = {
        key: key,
        oldValue: oldVal,
        newValue: val,
    };
    const newEvent = new CustomEvent(session_storage_item_set, {
        detail: detail,
        bubbles: true,
        composed: true,
    });
    window.dispatchEvent(newEvent);
};
// export function setJSONItem(key: string, val: string | object){
//     const jsonVal = typeof(val) === 'string' ? JSON.parse(val) : val;
//     const sVal = typeof(val) === 'string' ? val : JSON.stringify(val);
//     if(isLoaded) win[cache][key] = jsonVal;
//     originalSetItem(key, sVal);
// }
const originalRemoveItem = window.sessionStorage.removeItem;
const boundRemoveItem = originalRemoveItem.bind(window.sessionStorage);
window.sessionStorage.removeItem = function (key) {
    const oldVal = sessionStorage.getItem(key);
    boundRemoveItem(key);
    if (isLoaded)
        delete win[cache][key];
    const newEvent = new CustomEvent(session_storage_item_removed, {
        detail: {
            key: key,
            oldValue: oldVal,
            newValue: null
        }
    });
    window.dispatchEvent(newEvent);
};
