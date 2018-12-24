
    //@ts-check
    (function () {
    function define(custEl) {
    let tagName = custEl.is;
    if (customElements.get(tagName)) {
        console.warn('Already registered ' + tagName);
        return;
    }
    customElements.define(tagName, custEl);
}
const disabled = 'disabled';
/**
 * Base class for many xtal- components
 * @param superClass
 */
function XtallatX(superClass) {
    return class extends superClass {
        constructor() {
            super(...arguments);
            this._evCount = {};
        }
        static get observedAttributes() {
            return [disabled];
        }
        /**
         * Any component that emits events should not do so if it is disabled.
         * Note that this is not enforced, but the disabled property is made available.
         * Users of this mix-in should ensure not to call "de" if this property is set to true.
         */
        get disabled() {
            return this._disabled;
        }
        set disabled(val) {
            this.attr(disabled, val, '');
        }
        /**
         * Set attribute value.
         * @param name
         * @param val
         * @param trueVal String to set attribute if true.
         */
        attr(name, val, trueVal) {
            const v = val ? 'set' : 'remove'; //verb
            this[v + 'Attribute'](name, trueVal || val);
        }
        /**
         * Turn number into string with even and odd values easy to query via css.
         * @param n
         */
        to$(n) {
            const mod = n % 2;
            return (n - mod) / 2 + '-' + mod;
        }
        /**
         * Increment event count
         * @param name
         */
        incAttr(name) {
            const ec = this._evCount;
            if (name in ec) {
                ec[name]++;
            }
            else {
                ec[name] = 0;
            }
            this.attr('data-' + name, this.to$(ec[name]));
        }
        attributeChangedCallback(name, oldVal, newVal) {
            switch (name) {
                case disabled:
                    this._disabled = newVal !== null;
                    break;
            }
        }
        /**
         * Dispatch Custom Event
         * @param name Name of event to dispatch ("-changed" will be appended if asIs is false)
         * @param detail Information to be passed with the event
         * @param asIs If true, don't append event name with '-changed'
         */
        de(name, detail, asIs = false) {
            const eventName = name + (asIs ? '' : '-changed');
            const newEvent = new CustomEvent(eventName, {
                detail: detail,
                bubbles: true,
                composed: false,
            });
            this.dispatchEvent(newEvent);
            this.incAttr(eventName);
            return newEvent;
        }
        /**
         * Needed for asynchronous loading
         * @param props Array of property names to "upgrade", without losing value set while element was Unknown
         */
        _upgradeProperties(props) {
            props.forEach(prop => {
                if (this.hasOwnProperty(prop)) {
                    let value = this[prop];
                    delete this[prop];
                    this[prop] = value;
                }
            });
        }
    };
}
const session_storage_item_set = 'session-storage-item-set';
const session_storage_item_removed = 'session-storage-item-removed';
const win = window;
function init() { }
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
const key = 'key';
class ObSessionBase extends XtallatX(HTMLElement) {
    constructor() {
        super(...arguments);
        this._key = null;
        this._c = false;
    }
    static get observedAttributes() {
        return super.observedAttributes.concat([key]);
    }
    attributeChangedCallback(n, ov, nv) {
        super.attributeChangedCallback(n, ov, nv);
        switch (n) {
            case key:
                this['_' + n] = nv;
                break;
        }
        this.onPropsChange();
    }
    get key() {
        return this._key;
    }
    set key(nv) {
        this.attr(key, nv);
    }
    connectedCallback() {
        this.style.display = 'none';
        this._upgradeProperties([disabled, key]);
        this._c = true;
        this.onPropsChange();
    }
}
const value = 'value';
class ObSessionUpdate extends ObSessionBase {
    constructor() {
        super(...arguments);
        this._val = null;
    }
    static get is() { return 'ob-session-update'; }
    static get observedAttributes() {
        return super.observedAttributes.concat([value]);
    }
    attributeChangedCallback(n, ov, nv) {
        switch (n) {
            case value:
                this._val = nv;
                break;
        }
        super.attributeChangedCallback(n, ov, nv);
    }
    connectedCallback() {
        init();
        this._upgradeProperties([value]);
        super.connectedCallback();
    }
    get value() {
        return this._val;
    }
    set value(nv) {
        this._val = nv;
        this.onPropsChange();
    }
    onPropsChange() {
        if (this._disabled || !this._c || this._key === null || this._val === null)
            return;
        sessionStorage.setItem(this._key, this._val);
    }
}
define(ObSessionUpdate);
class ObSessionWatch extends ObSessionBase {
    static get is() { return 'ob-session-watch'; }
    onPropsChange() {
        if (this.disabled || !this._c)
            return;
        if (!this._boundSetHandler) {
            this._boundSetHandler = this.handleItemChangeEvent.bind(this);
            window.addEventListener(session_storage_item_set, this._boundSetHandler);
        }
        if (!this._boundRemoveHandler) {
            this._boundRemoveHandler = this.handleItemChangeEvent.bind(this);
            window.addEventListener(session_storage_item_removed, this._boundRemoveHandler);
        }
        if (this._key !== null) {
            const val = sessionStorage.getItem(this._key);
            if (val !== null)
                this.value = val;
        }
    }
    handleItemChangeEvent(e) {
        const detail = e.detail;
        if (this._key === null) {
            this.value = detail;
        }
        else if (this._key === detail.key) {
            this.value = detail.newValue;
        }
    }
    // handleRemoveItemEvent(e: Event){
    //     const detail = (<any>e).detail as ISessionStorageItemSetEventDetail;
    //     if(this._key === null){
    //         this.value = detail;
    //     }else if(this._key === detail.key){
    //         this.value = detail.newValue;
    //     }
    // }
    disconnectedCallback() {
        if (this._boundSetHandler)
            window.removeEventListener(session_storage_item_set, this._boundSetHandler);
        if (this._boundRemoveHandler)
            window.removeEventListener(session_storage_item_removed, this._boundRemoveHandler);
    }
    get value() {
        return this._value;
    }
    set value(nv) {
        const ov = this._value;
        const detail = this._key === null ? {
            value: nv.newValue,
            key: nv.key,
        } : {
            value: nv,
            key: this._key
        };
        this._value = detail;
        this.de('value', detail);
    }
}
define(ObSessionWatch);
    })();  
        