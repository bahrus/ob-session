import { define, XtallatX } from 'xtal-element/xtal-latx.js';
import { hydrate } from 'trans-render/hydrate.js';
//import {setJSONItem} from './ob-session-api.js';
import './ob-session-api.js';
export const updateSessionStorage = ({ key, isJson, val, disabled }) => {
    if (disabled || key === undefined || val === undefined)
        return;
    sessionStorage.setItem(key, val);
};
export const propActions = [updateSessionStorage];
export class ObSessionUpdate extends XtallatX(hydrate(HTMLElement)) {
    constructor() {
        super(...arguments);
        this.propActions = propActions;
    }
    connectedCallback() {
        this.style.display = 'none';
        super.connectedCallback();
    }
}
ObSessionUpdate.is = 'ob-session-update';
ObSessionUpdate.attributeProps = ({ disabled, val, isJson, key }) => ({
    bool: [disabled, isJson],
    obj: [val],
    jsonProp: [val],
    str: [key]
});
define(ObSessionUpdate);
