import {define, XtallatX, AttributeProps} from 'xtal-element/xtal-latx.js';
import {hydrate} from 'trans-render/hydrate.js';
import './ob-session-api.js';

export const updateSessionStorage = ({key, isJson, val, disabled}: ObSessionUpdate) => {
    if(disabled || key===undefined || val === undefined) return;
    sessionStorage.setItem(key, val);
};
export const propActions = [updateSessionStorage];

/**
 * @element ob-session-update
 * 
 * @prop {Object} val - Value to set
 * @prop {Boolean} isJSON - Treat value as JSON
 * @prop {String} key - key where to store val in SessionStorage
 * 
 * @attr val - Value to set
 * @attr {Boolean} is-json - Treat value as JSON
 * @attr key - key where to store val in SessionStorage
 * 
 */
export class ObSessionUpdate extends XtallatX(hydrate(HTMLElement)){
    static is = 'ob-session-update';

    static attributeProps = ({disabled, val, isJson, key} : ObSessionUpdate) => ({
        bool: [disabled, isJson],
        obj: [val],
        jsonProp: [val],
        str: [key]
    }  as AttributeProps);
 
    val: any;
    
    isJson: boolean | undefined;

    key: string | undefined;

    propActions = propActions;

    connectedCallback(){
        this.style.display = 'none';
        super.connectedCallback();
    }
}
define(ObSessionUpdate);

declare global {
    interface HTMLElementTagNameMap {
        'ob-session-update': ObSessionUpdate,
    }
}