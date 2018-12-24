import { ObSessionBase } from './ob-session-base.js';
import { define } from 'xtal-latx/define.js';
import { session_storage_item_set, session_storage_item_removed } from './ob-session-api.js';
export class ObSessionWatch extends ObSessionBase {
    static get is() { return 'ob-session-watch'; }
    onPropsChange() {
        if (this.disabled || !this._c)
            return;
        if (!this._boundSetHandler) {
            this._boundSetHandler = this.handleItemChangeEvent.bind(this);
            window.addEventListener(session_storage_item_set, this._boundSetHandler);
        }
        if (!this._boundRemoveHandler) {
            this._boundRemoveHandler = this.handleItemChangeEvent.bind(this);
            window.addEventListener(session_storage_item_removed, this._boundRemoveHandler);
        }
        if (this._key !== null) {
            const val = sessionStorage.getItem(this._key);
            if (val !== null)
                this.value = val;
        }
    }
    handleItemChangeEvent(e) {
        const detail = e.detail;
        if (this._key === null) {
            this.value = detail;
        }
        else if (this._key === detail.key) {
            this.value = detail.newValue;
        }
    }
    // handleRemoveItemEvent(e: Event){
    //     const detail = (<any>e).detail as ISessionStorageItemSetEventDetail;
    //     if(this._key === null){
    //         this.value = detail;
    //     }else if(this._key === detail.key){
    //         this.value = detail.newValue;
    //     }
    // }
    disconnectedCallback() {
        if (this._boundSetHandler)
            window.removeEventListener(session_storage_item_set, this._boundSetHandler);
        if (this._boundRemoveHandler)
            window.removeEventListener(session_storage_item_removed, this._boundRemoveHandler);
    }
    get value() {
        return this._value;
    }
    set value(nv) {
        const ov = this._value;
        const detail = this._key === null ? {
            value: nv.newValue,
            key: nv.key,
        } : {
            value: nv,
            key: this._key
        };
        this._value = detail;
        this.de('value', detail);
    }
}
define(ObSessionWatch);
//# sourceMappingURL=ob-session-watch.js.map