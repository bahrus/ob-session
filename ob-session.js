import { init, SessionStorageItemRemovedEvent, SessionStorageItemSetEvent } from 'ob-session-api.js';
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
        propInfo: {
            key: {
                type: 'String'
            },
            // value: {
            //     type: 'String',
            //     notify: {
            //         dispatch: true,
            //     },
            //     parse: false,
            // },
            // parsedVal: {
            //     type: 'Object',
            //     notify: {
            //         dispatch: true,
            //     },
            //     parse: false,
            // }
        },
        formAss: true,
        actions: {
            hydrate: {
                ifAllOf: ['isAttrParsed', 'key']
            },
            onSetItem: {
                ifAllOf: ['isAttrParsed', 'key', 'setItem']
            }
        }
    }
});
