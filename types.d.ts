import {ActionOnEventConfigs} from 'trans-render/froop/types';
import { JSONObject } from 'trans-render/lib/types';

export interface EndUserProps{
    /**
     * Specify what key to use in session storage
     */
    key: string,
    /**
     * set the value of session storage for the given or inferred key.
     */
    setItem: JSONObject,
    /**
     * If no key is set, will take the key from the localName of the custom element.
     * This parameter specifies if that localName should be formatted according to some common rules.
     */
    keyFormat: 'as-is' | 'camelCase' | 'CamelCase',
    
}

export interface ETProps{
    window: Window;
}

export interface AllProps extends EndUserProps, ETProps{
    parsedVal: JSONObject | null,
    value: string | null,
    //isAttrParsed?: boolean,
    
}

export type PP = Partial<AllProps>;

export type ProPP = Promise<PP>

export type PPE = [PP, ActionOnEventConfigs<AllProps, Actions>];

export interface Actions{
    onNoKey(self: this): ProPP,
    hydrate(self: this): PP,
    //getVals(self: this): PP,
    onSetItem(self: this): PP,
    onItemSet(self: this, e: SessionStorageEvent): PP,
    onItemRemove(self: this, e: SessionStorageEvent): PP,

    /**
     * dispatch event from passed in event target
     * @param src 
     * @param name 
     * @returns 
     */
    de: (src: EventTarget, name: string) => Event;

}

export type session_storage_item_removed = 'session-storage-item-removed';
export type session_storage_item_set = 'session-storage-item-set';

export interface SessionStorageEvent{
    oldVal: string | null,
    newVal: string | null,
    key: string,
}

export type VM = AllProps & Actions;

declare global {
    interface WindowEventMap {
        ['session-storage-item-set']: SessionStorageEvent,
        ['session-storage-item-removed']: SessionStorageEvent
    }
}