import {ActionOnEventConfigs} from 'trans-render/froop/types';
import { JSONObject } from 'trans-render/lib/types';

export interface EndUserProps{
    key: string,
    setItem: JSONObject
}

export interface AllProps extends EndUserProps{
    parsedVal: JSONObject | null,
    value: string | null,
    isAttrParsed?: boolean,
}

export type PP = Partial<AllProps>;

export type ProPP = Promise<PP>

export type PPE = [PP, ActionOnEventConfigs<AllProps, Actions>];

export interface Actions{
    onNoKey(self: this): PP,
    hydrate(self: this): PP,
    getVals(self: this): PP,
    onSetItem(self: this): PP,
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
    interface HTMLElementTagNameMap {
        'ob-session': {new(): VM},
    }
    interface WindowEventMap {
        ['session-storage-item-set']: SessionStorageEvent,
        ['session-storage-item-removed']: SessionStorageEvent
    }
}