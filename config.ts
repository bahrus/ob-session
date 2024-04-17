import {OConfig} from 'trans-render/froop/types';
import { Actions, AllProps } from './types';

export const config: OConfig<AllProps & GlobalEventHandlers, Actions> = {
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
        },
        setItem:{
            type: 'String',
            parse: true,
            attrName: 'set-item'

        }
    },
    actions: {
        onNoKey:{
            ifNoneOf: ['key'],
            ifAllOf: ['onchange']
        },
        hydrate: {
            ifAllOf: ['key', 'onchange']
        },
        onSetItem:{
            ifAllOf: ['key', 'onchange', 'setItem']
        }
    },
    handlers: {
        window_to_onItemSet_on: 'session-storage-item-set',
        window_to_onItemRemove_on: 'session-storage-item-removed',
    },
    positractions: [
        {
            do: 'de',
            ifKeyIn: ['parsedVal'],
            pass: ['$0', '`change`']
        }


    ]
};