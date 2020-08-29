import {define, XtallatX, AttributeProps} from 'xtal-element/xtal-latx.js';
import {hydrate} from 'trans-render/hydrate.js';
//import {setJSONItem} from './ob-session-api.js';
import './ob-session-api.js';

export const updateSessionStorage = ({key, isJson, val, disabled}: ObSessionUpdate) => {
    if(disabled || key===undefined || val === undefined) return;
    sessionStorage.setItem(key, val);
};
export const propActions = [updateSessionStorage];

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