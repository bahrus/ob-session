import { init, SessionStorageItemRemovedEvent, SessionStorageItemSetEvent } from './ob-session-api.js';
import { XE } from 'xtal-element/XE.js';
init();
export class ObSession extends HTMLElement {
    #itemSetAC;
    #itemRemoveAC;
    hydrate(self) {
        self.hidden = true;
        this.disconnect();
        this.#itemRemoveAC = new AbortController();
        this.#itemSetAC = new AbortController();
        window.addEventListener(SessionStorageItemSetEvent.EventName, e => {
            const { key } = e;
            if (key === self.key) {
                const newVals = this.getVals(self);
                const { value, parsedVal } = newVals;
                self.#value = value;
                self.#parsedVal = parsedVal;
            }
        }, { signal: this.#itemSetAC.signal });
        window.addEventListener(SessionStorageItemRemovedEvent.EventName, e => {
            const { key } = e;
            if (key === self.key) {
                self.#value = '';
                self.#parsedVal = null;
            }
            self.dispatchEvent(new Event('change'));
        });
        const vals = this.getVals(self);
        const { value, parsedVal } = vals;
        self.#value = value;
        self.#parsedVal = parsedVal;
        self.dispatchEvent(new Event('change'));
        return {};
    }
    async onNoKey(self) {
        const { localName, keyFormat } = self;
        switch (keyFormat) {
            case 'as-is':
                return {
                    key: localName
                };
            default:
                const { lispToCamel } = await import('trans-render/lib/lispToCamel.js');
                let key = lispToCamel(localName);
                if (keyFormat === 'CamelCase')
                    key = key[0].toUpperCase() + key.substring(1);
                return {
                    key
                };
        }
    }
    disconnect() {
        if (this.#itemSetAC !== undefined)
            this.#itemSetAC.abort();
        if (this.#itemRemoveAC !== undefined)
            this.#itemRemoveAC.abort();
    }
    disconnectedCallback() {
        this.disconnect();
    }
    #value = null;
    get value() {
        return this.#value;
    }
    #parsedVal = null;
    get parsedVal() {
        return this.#parsedVal;
    }
    getVals(self) {
        const { key } = self;
        const val = sessionStorage.getItem(key);
        return {
            value: (val !== null && typeof val === 'object') ? JSON.stringify(val) : val,
            parsedVal: val === null ? null : (typeof val === 'object') ? val : JSON.parse(val),
        };
    }
    onSetItem(self) {
        const { setItem, key } = self;
        sessionStorage.setItem(key, setItem);
        return {};
    }
}
const xe = new XE({
    config: {
        tagName: 'ob-session',
        propDefaults: {
            keyFormat: 'as-is',
        },
        propInfo: {
            key: {
                type: 'String'
            },
        },
        formAss: true,
        actions: {
            onNoKey: {
                ifAllOf: ['isAttrParsed'],
                ifNoneOf: ['key'],
            },
            hydrate: {
                ifAllOf: ['isAttrParsed', 'key']
            },
            onSetItem: {
                ifAllOf: ['isAttrParsed', 'key', 'setItem']
            }
        }
    },
    superclass: ObSession
});
