import {ObSessionBase} from './ob-session-base.js';
import {define} from 'xtal-element/define.js';
import {setJSONItem} from './ob-session-api.js';

const value = 'value';
const is_json = 'is-json';

export class ObSessionUpdate extends ObSessionBase{
    static get is(){return 'ob-session-update';}
    static get observedAttributes(){
        return super.observedAttributes.concat([value, is_json]);
    }
    attributeChangedCallback(n: string, ov: string, nv: string){
        switch(n){
            case value:
                this._val = nv;
                break;
            case is_json:
                this._isJSON = nv !== null;
        }
        super.attributeChangedCallback(n, ov, nv);
    }
    connectedCallback(){
        this._upgradeProperties([value, 'isJSON']);
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

    _isJSON = false;
    get isJSON(){
        return this._isJSON;
    }
    set isJSON(nv){
        this.attr(is_json, nv, '');
    }


    onPropsChange(){
        if(this._disabled || !this._c ||  this._key === null || this._val === null) return;
        if(this._isJSON){
            setJSONItem(this._key, this._val);
        }else{
            sessionStorage.setItem(this._key, this._val);
        }
        
    }
}
define(ObSessionUpdate);