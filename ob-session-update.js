import { ObSessionBase } from './ob-session-base.js';
import { define } from 'xtal-latx/define.js';
import { init, setJSONItem } from './ob-session-api.js';
const value = 'value';
const is_json = 'is-json';
export class ObSessionUpdate extends ObSessionBase {
    constructor() {
        super(...arguments);
        this._val = null;
        this._isJSON = false;
    }
    static get is() { return 'ob-session-update'; }
    static get observedAttributes() {
        return super.observedAttributes.concat([value, is_json]);
    }
    attributeChangedCallback(n, ov, nv) {
        switch (n) {
            case value:
                this._val = nv;
                break;
            case is_json:
                this._isJSON = nv !== null;
        }
        super.attributeChangedCallback(n, ov, nv);
    }
    connectedCallback() {
        init();
        this._upgradeProperties([value, 'isJSON']);
        super.connectedCallback();
    }
    get value() {
        return this._val;
    }
    set value(nv) {
        this._val = nv;
        this.onPropsChange();
    }
    get isJSON() {
        return this._isJSON;
    }
    set isJSON(nv) {
        this.attr(is_json, nv, '');
    }
    onPropsChange() {
        if (this._disabled || !this._c || this._key === null || this._val === null)
            return;
        if (this._isJSON) {
            setJSONItem(this._key, this._val);
        }
        else {
            sessionStorage.setItem(this._key, this._val);
        }
    }
}
define(ObSessionUpdate);
//# sourceMappingURL=ob-session-update.js.map