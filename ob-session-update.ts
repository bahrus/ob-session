import {ObSessionBase} from './ob-session-base.js';
import {define} from 'xtal-latx/define.js';
import {init} from './ob-session-api.js';

const value = 'value';

export class ObSessionUpdate extends ObSessionBase{
    static get is(){return 'ob-session-update';}
    static get observedAttributes(){
        return super.observedAttributes.concat([value]);
    }
    attributeChangedCallback(n: string, ov: string, nv: string){
        switch(n){
            case value:
                this._val = nv;
                break;
        }
        super.attributeChangedCallback(n, ov, nv);
    }
    connectedCallback(){
        init();
        this._upgradeProperties([value]);
        super.connectedCallback();
    }
    
    _val: any = null;
    get value(){
        return this._val;
    }
    set value(nv){
        this._val = nv;
        this.onPropsChange();
    }

    onPropsChange(){
        if(this._disabled || !this._c ||  this._key === null || this._val === null) return;
        sessionStorage.setItem(this._key, this._val);
    }
}
define(ObSessionUpdate);