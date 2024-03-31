export class SessionStorageItemRemovedEvent extends Event {
    key;
    oldVal;
    newVal;
    static EventName = 'session-storage-item-removed';
    constructor(key, oldVal, newVal) {
        super(SessionStorageItemRemovedEvent.EventName);
        this.key = key;
        this.oldVal = oldVal;
        this.newVal = newVal;
    }
}
export class SessionStorageItemSetEvent extends Event {
    key;
    oldVal;
    newVal;
    static EventName = 'session-storage-item-set';
    constructor(key, oldVal, newVal) {
        super(SessionStorageItemSetEvent.EventName);
        this.key = key;
        this.oldVal = oldVal;
        this.newVal = newVal;
    }
}
const cache = Symbol('cache');
const initialized = Symbol('initialized');
const isLoaded = navigator.deviceMemory > 1;
export function init(win = window) {
    const aWin = win;
    if (aWin[initialized])
        return;
    aWin[initialized] = true;
    if (!aWin[cache] && isLoaded) {
        aWin[cache] = {};
    }
    if (isLoaded) {
        const originalGetItem = win.sessionStorage.getItem;
        const boundGetItem = originalGetItem.bind(win.sessionStorage);
        win.sessionStorage.getItem = function (key) {
            const item = boundGetItem(key);
            if (item === null)
                return null;
            if (!isLoaded)
                return item;
            const fromCache = aWin[cache][key];
            if (fromCache)
                return aWin[cache];
            const firstChar = item[0];
            const lastChar = item[item.length - 1];
            if ((firstChar === '[' && lastChar === ']') || (firstChar === '{' && lastChar === '}')) {
                aWin[cache][key] = JSON.parse(item);
                return aWin[cache][key];
            }
            else {
                return item;
            }
        };
    }
    const originalSetItem = win.sessionStorage.setItem;
    const boundSetItem = originalSetItem.bind(win.sessionStorage);
    win.sessionStorage.setItem = function (key, val) {
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
                    aWin[cache][key] = val;
                    boundSetItem(key, JSON.stringify(val));
                    break;
                default:
                    throw "Not Implemented";
            }
        }
        const newEvent = new SessionStorageItemSetEvent(key, oldVal, val);
        win.dispatchEvent(newEvent);
    };
    const originalRemoveItem = win.sessionStorage.removeItem;
    const boundRemoveItem = originalRemoveItem.bind(win.sessionStorage);
    win.sessionStorage.removeItem = function (key) {
        const oldVal = sessionStorage.getItem(key);
        boundRemoveItem(key);
        if (isLoaded)
            delete aWin[cache][key];
        const newEvent = new SessionStorageItemRemovedEvent(key, oldVal, null);
        win.dispatchEvent(newEvent);
    };
}
init();
