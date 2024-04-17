import {O, OConfig} from 'trans-render/froop/O.js';
import {
    Actions, AllProps, ProPP, PP, 
    session_storage_item_removed,
    session_storage_item_set,
    ETProps,
    SessionStorageEvent
} from './types.js';
import { JSONObject } from 'trans-render/lib/types.js';
import {init, SessionStorageItemRemovedEvent, SessionStorageItemSetEvent} from './ob-session-api.js';
import {dispatchEvent} from 'trans-render/positractions/dispatchEvent.js';

init();

export class ObSession extends O<AllProps, Actions> implements Actions {
    static formAssociated = true;
    static override config: OConfig<AllProps, Actions, ETProps> = { 
        name: 'ob-session',
        propDefaults: {
            keyFormat: 'as-is'
        },
        propInfo:{
            key: {
                type: 'String',
                parse: true,
                attrName: 'key'
            },
            window:{
                type: 'Object',
                ro: true,
            },
            value:{
                type: 'String',
                ro: true,
            },
            parsedVal:{
                type: 'Object',
                ro: true,
            }
        },
        actions: {
            onNoKey:{
                ifNoneOf: ['key'],
            },
            hydrate: {
                ifAllOf: ['key']
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
    }

    de = dispatchEvent;

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

    hydrate(self: this): PP{
        return {
            window,
            ...this.#getVals(self),
            
        };
    }

    onItemSet(self: this, e: SessionStorageEvent): PP{
        const {key} = e;
        if(key === self.key){
            return this.#getVals(self);
        }else{
            return {};
        }
        
    }

    onItemRemove(self: this, e: SessionStorageEvent): PP {
        const {key} = e;
        if(key === self.key){
            return {
                value: '',
                parsedVal: null
            }
        }else{
            return {};
        }
    }

    #getVals(self: this): {value: string | null, parsedVal: null | JSONObject} {
        const {key} = self;
        const val = sessionStorage.getItem(key);
        return {
            value: ( val !== null && typeof val === 'object') ? JSON.stringify(val)! : val,
            parsedVal: val === null ? null :  (typeof val === 'object') ? val : JSON.parse(val),
        } as {value: string | null, parsedVal: null | JSONObject};
    }
}

export interface ObSession extends AllProps{}