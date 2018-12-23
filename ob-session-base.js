import { XtallatX, disabled } from 'xtal-latx/xtal-latx.js';
const key = 'key';
export class ObSessionBase extends XtallatX(HTMLElement) {
    constructor() {
        super(...arguments);
        this._key = null;
        this._c = false;
    }
    static get observedAttributes() {
        return super.observedAttributes.concat([key]);
    }
    attributeChangedCallback(n, ov, nv) {
        super.attributeChangedCallback(n, ov, nv);
        switch (n) {
            case key:
                this['_' + n] = nv;
                break;
        }
        this.onPropsChange();
    }
    get key() {
        return this._key;
    }
    set key(nv) {
        this.attr(key, nv);
    }
    connectedCallback() {
        this._upgradeProperties([disabled, key]);
        this._c = true;
        this.onPropsChange();
    }
}
//# sourceMappingURL=ob-session-base.js.map