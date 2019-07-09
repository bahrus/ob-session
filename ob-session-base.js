import { XtallatX } from 'xtal-element/xtal-latx.js';
import { disabled, hydrate } from 'trans-render/hydrate.js';
const key = 'key';
export class ObSessionBase extends XtallatX(hydrate(HTMLElement)) {
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
        this.style.display = 'none';
        this.propUp([disabled, key]);
        this._c = true;
        this.onPropsChange();
    }
}
