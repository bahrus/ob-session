import {
    Actions, AllProps, ProPP, PP, PPE, session_storage_item_removed
} from './types';
import {init, SessionStorageItemRemovedEvent, SessionStorageItemSetEvent} from 'ob-session-api.js';

import {XE, ActionOnEventConfigs} from 'xtal-element/XE.js';

import {session_storage_item_set} from './types';
import { JSONObject } from '../trans-render/lib/types';

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
}

export interface ObSession extends AllProps{}

const xe = new XE<AllProps & HTMLElement, Actions>({
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
        actions:{
            hydrate: {
                ifAllOf: ['isAttrParsed', 'key']
            }
        }
    }
})



