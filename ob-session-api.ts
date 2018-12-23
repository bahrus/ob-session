export const session_storage_item_set = 'session-storage-item-set';
export interface ISessionStorageItemSetEventDetail {
    key: string,
    oldValue: any,
    newValue: any
}

const win = <any>window;
if(!win.__obSessionCache){
    win.__obSessionCache = {};
}


const originalGetItem = window.sessionStorage.getItem;
const boundGetItem = originalGetItem.bind(window.sessionStorage);
window.sessionStorage.getItem = function (key: string) {
    const item = boundGetItem(key);
    if(item === null) return null;
    const fromCache = win.__obSessionCache[key];
    if(fromCache) return win.__obSessionCache;
    const firstChar = item[0];
    const lastChar = item[item.length - 1];
    if((firstChar === '[' && lastChar === ']') || (firstChar === '{' && lastChar === '}')){
        win.__obSessionCache[key] = JSON.parse(item);
        return win.__obSessionCache[key];
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
            win.__obSessionCache[key] = val;
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
