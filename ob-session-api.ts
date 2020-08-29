export const session_storage_item_set = 'session-storage-item-set';
export const session_storage_item_removed = 'session-storage-item-removed';
const cache = Symbol('cache');
const initialized = Symbol('initialized');

export interface ISessionStorageItemSetEventDetail {
    key: string,
    oldValue: any,
    newValue: any
}



//const win = <any>window;
const isLoaded = (<any>navigator).deviceMemory > 1;


export function init(win: Window = window){
    const aWin = win as any;
    if(aWin[initialized]) return;
    aWin[initialized] = true;
    if(!aWin[cache] && isLoaded){
        aWin[cache] = {};
    }
    
    if(isLoaded){
        const originalGetItem = win.sessionStorage.getItem;
        const boundGetItem = originalGetItem.bind(win.sessionStorage);
        win.sessionStorage.getItem = function (key: string) {
            const item = boundGetItem(key);
            if(item === null) return null;
            if(!isLoaded) return item;
            const fromCache = aWin[cache][key];
            if(fromCache) return aWin[cache];
            const firstChar = item[0];
            const lastChar = item[item.length - 1];
            if((firstChar === '[' && lastChar === ']') || (firstChar === '{' && lastChar === '}')){
                aWin[cache][key] = JSON.parse(item);
                return aWin[cache][key];
            }else{
                return item;
            }
        }
    }
    
    
    const originalSetItem = win.sessionStorage.setItem;
    const boundSetItem = originalSetItem.bind(win.sessionStorage);
    win.sessionStorage.setItem = function(key: string, val: any){
        const oldVal = sessionStorage.getItem(key);
        if(!isLoaded){
            boundSetItem(key, val);
        }else{
            switch(typeof val){
                case 'string':
                    boundSetItem(key, val);
                    break;
                case 'object':
                    aWin[cache][key] = val;
                    boundSetItem(key, JSON.stringify(val));
                    break;
                default:
                    throw "Not Implemented";
            }
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
        win.dispatchEvent(newEvent);
    }

    const originalRemoveItem = win.sessionStorage.removeItem;
    const boundRemoveItem = originalRemoveItem.bind(win.sessionStorage);
    win.sessionStorage.removeItem = function(key: string){
        const oldVal = sessionStorage.getItem(key);
        boundRemoveItem(key);
        if(isLoaded) delete aWin[cache][key];
        const newEvent = new CustomEvent(session_storage_item_removed, {
            detail:{
                key: key,
                oldValue: oldVal,
                newValue: null
            }
        });
        win.dispatchEvent(newEvent);
    }
}

init();



