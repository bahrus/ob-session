import { O } from 'trans-render/froop/O.js';
import { init, SessionStorageItemRemovedEvent, SessionStorageItemSetEvent } from './ob-session-api.js';
import { dispatchEvent } from 'trans-render/positractions/dispatchEvent.js';
init();
export class ObSession extends O {
    static formAssociated = true;
    static config = {
        name: 'ob-session',
        propDefaults: {
            keyFormat: 'as-is'
        },
        propInfo: {
            key: {
                type: 'String',
                parse: true,
                attrName: 'key'
            },
            window: {
                type: 'Object',
                ro: true,
            },
            value: {
                type: 'String',
                ro: true,
            },
            parsedVal: {
                type: 'Object',
                ro: true,
            },
            setItem: {
                type: 'String',
                parse: true,
                attrName: 'set-item'
            }
        },
        actions: {
            onNoKey: {
                ifNoneOf: ['key'],
            },
            hydrate: {
                ifAllOf: ['key']
            },
            onSetItem: {
                ifKeyIn: ['setItem']
            }
        },
        handlers: {
            window_to_onItemSet_on: SessionStorageItemSetEvent.EventName,
            window_to_onItemRemove_on: SessionStorageItemRemovedEvent.EventName,
        },
        positractions: [
            {
                do: 'de',
                ifKeyIn: ['parsedVal'],
                pass: ['$0', '`change`']
            }
        ]
    };
    de = dispatchEvent;
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
    hydrate(self) {
        return {
            window,
            ...this.#getVals(self),
        };
    }
    onItemSet(self, e) {
        const { key } = e;
        if (key === self.key) {
            return this.#getVals(self);
        }
        else {
            return {};
        }
    }
    onItemRemove(self, e) {
        const { key } = e;
        if (key === self.key) {
            return {
                value: '',
                parsedVal: null
            };
        }
        else {
            return {};
        }
    }
    #getVals(self) {
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
