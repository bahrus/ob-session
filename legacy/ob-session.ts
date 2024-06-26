import {
    Actions, AllProps, ProPP, PP, PPE, session_storage_item_removed
} from '../types.js';
import {init, SessionStorageItemRemovedEvent, SessionStorageItemSetEvent} from '../ob-session-api.js';

import {XE, ActionOnEventConfigs} from 'xtal-element/XE.js';

import {session_storage_item_set} from '../types.js';
import { JSONObject } from '../../trans-render/lib/types.js';

init();

export class ObSession extends HTMLElement implements Actions{

    #itemSetAC: AbortController | undefined;
    #itemRemoveAC: AbortController | undefined;
    hydrate(self: this): PP {
        self.hidden = true;
        this.disconnect();
        this.#itemRemoveAC = new AbortController();
        this.#itemSetAC = new AbortController();
        window.addEventListener<session_storage_item_set>(SessionStorageItemSetEvent.EventName, e => {
            const {key} = e;
            if(key === self.key){
                const newVals = this.getVals(self);
                const {value, parsedVal} = newVals;
                self.#value = value;
                self.#parsedVal = parsedVal;
            }
        }, {signal: this.#itemSetAC.signal});
        window.addEventListener<session_storage_item_removed>(SessionStorageItemRemovedEvent.EventName, e => {
            const {key} = e;
            if(key === self.key){
                self.#value = '';
                self.#parsedVal = null;
            }
            self.dispatchEvent(new Event('change'));
        });
        const vals = this.getVals(self);
        const {value, parsedVal} = vals;
        self.#value = value;
        self.#parsedVal = parsedVal;
        self.dispatchEvent(new Event('change'));
        return {}
    }
    async onNoKey(self: this): ProPP{
        const {localName, keyFormat} = self;
        switch(keyFormat){
            case 'as-is':
                return {
                    key: localName
                } as PP
            default:
                const {lispToCamel} = await import('trans-render/lib/lispToCamel.js'); 
                let key = lispToCamel(localName);
                if(keyFormat === 'CamelCase') key = key[0].toUpperCase() + key.substring(1);
                return {
                    key
                }  as PP;
        }

    }
    disconnect(){
        if(this.#itemSetAC !== undefined) this.#itemSetAC.abort();
        if(this.#itemRemoveAC !== undefined) this.#itemRemoveAC.abort();
    }
    disconnectedCallback(){
        this.disconnect();
    }
    #value: string | null = null;
    get value(){
        return this.#value;
    }
    #parsedVal: JSONObject | null = null;
    get parsedVal(){
        return this.#parsedVal;
    }

    getVals(self: this): {value: string | null, parsedVal: null | JSONObject} {
        const {key} = self;
        const val = sessionStorage.getItem(key);

        return {
            value: ( val !== null && typeof val === 'object') ? JSON.stringify(val)! : val,
            parsedVal: val === null ? null :  (typeof val === 'object') ? val : JSON.parse(val),
        } as {value: string | null, parsedVal: null | JSONObject};
    }

    onSetItem(self: this): PP {
        const {setItem, key} = self;
        sessionStorage.setItem(key!, setItem as any as string);
        return {}
    }
}

export interface ObSession extends AllProps{}

const xe = new XE<AllProps & HTMLElement, Actions>({
    config: {
        tagName: 'ob-session',
        propDefaults:{
            keyFormat: 'as-is',
        },
        propInfo: {
            key: {
                type: 'String'
            },
            
        },
        formAss: true,
        actions:{
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
})



