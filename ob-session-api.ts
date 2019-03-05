export const session_storage_item_set = 'session-storage-item-set';
export const session_storage_item_removed = 'session-storage-item-removed';
const cache = Symbol('cache');
export interface ISessionStorageItemSetEventDetail {
    key: string,
    oldValue: any,
    newValue: any
}

const win = <any>window;
//export function init(){}
if(!win[cache]){
    win[cache] = {};
}


const originalGetItem = window.sessionStorage.getItem;
const boundGetItem = originalGetItem.bind(window.sessionStorage);
window.sessionStorage.getItem = function (key: string) {
    const item = boundGetItem(key);
    if(item === null) return null;
    const fromCache = win[cache][key];
    if(fromCache) return win[cache];
    const firstChar = item[0];
    const lastChar = item[item.length - 1];
    if((firstChar === '[' && lastChar === ']') || (firstChar === '{' && lastChar === '}')){
        win[cache][key] = JSON.parse(item);
        return win[cache][key];
    }else{
        return item;
    }
}

const originalSetItem = window.sessionStorage.setItem;
const boundSetItem = originalSetItem.bind(window.sessionStorage);
window.sessionStorage.setItem = function(key: string, val: any){
    const oldVal = sessionStorage.getItem(key);
    switch(typeof val){
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
    const detail: ISessionStorageItemSetEventDetail = {
        key: key,
        oldValue: oldVal,
        newValue: val,
    };
    const newEvent = new CustomEvent(session_storage_item_set, {
        detail: detail,
        bubbles: true,
        composed: true,
    } as CustomEventInit);
    window.dispatchEvent(newEvent);
}
export function setJSONItem(key: string, val: string){
    win[cache][key] = JSON.parse(val);
    originalSetItem(key, val);
}

const originalRemoveItem = window.sessionStorage.removeItem;
const boundRemoveItem = originalRemoveItem.bind(window.sessionStorage);
window.sessionStorage.removeItem = function(key: string){
    const oldVal = sessionStorage.getItem(key);
    boundRemoveItem(key);
    delete win[cache][key];
    const newEvent = new CustomEvent(session_storage_item_removed, {
        detail:{
            key: key,
            oldValue: oldVal,
            newValue: null
        }
    });
    window.dispatchEvent(newEvent);
}

