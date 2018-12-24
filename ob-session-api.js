export const session_storage_item_set = 'session-storage-item-set';
export const session_storage_item_removed = 'session-storage-item-removed';
const win = window;
export function init() { }
if (!win.__obSessionCache) {
    win.__obSessionCache = {};
}
const originalGetItem = window.sessionStorage.getItem;
const boundGetItem = originalGetItem.bind(window.sessionStorage);
window.sessionStorage.getItem = function (key) {
    const item = boundGetItem(key);
    if (item === null)
        return null;
    const fromCache = win.__obSessionCache[key];
    if (fromCache)
        return win.__obSessionCache;
    const firstChar = item[0];
    const lastChar = item[item.length - 1];
    if ((firstChar === '[' && lastChar === ']') || (firstChar === '{' && lastChar === '}')) {
        win.__obSessionCache[key] = JSON.parse(item);
        return win.__obSessionCache[key];
    }
    else {
        return item;
    }
};
const originalSetItem = window.sessionStorage.setItem;
const boundSetItem = originalSetItem.bind(window.sessionStorage);
window.sessionStorage.setItem = function (key, val) {
    const oldVal = sessionStorage.getItem(key);
    switch (typeof val) {
        case 'string':
            boundSetItem(key, val);
            break;
        case 'object':
            win.__obSessionCache[key] = val;
            boundSetItem(key, JSON.stringify(val));
            break;
        default:
            throw "Not Implemented";
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
const originalRemoveItem = window.sessionStorage.removeItem;
const boundRemoveItem = originalRemoveItem.bind(window.sessionStorage);
window.sessionStorage.removeItem = function (key) {
    const oldVal = sessionStorage.getItem(key);
    boundRemoveItem(key);
    delete win.__obSessionCache[key];
    const newEvent = new CustomEvent(session_storage_item_removed, {
        detail: {
            key: key,
            oldValue: oldVal,
            newValue: null
        }
    });
    window.dispatchEvent(newEvent);
};
//# sourceMappingURL=ob-session-api.js.map