import { XtallatX} from 'xtal-element/xtal-latx.js';
import {disabled, hydrate} from 'trans-render/hydrate.js';

const key = 'key';
export abstract class ObSessionBase extends XtallatX(hydrate(HTMLElement)) {

    static get observedAttributes(){
        return super.observedAttributes.concat([key]);
    }
    
    abstract onPropsChange(): void;
    attributeChangedCallback(n: string, ov: string, nv: string){
        super.attributeChangedCallback(n, ov, nv);
        switch(n){
            case key:
                (<any>this)['_' + n] = nv;
                break;
        }
        this.onPropsChange();
    }

    _key: string | null = null;
    get key(){
        return this._key;
    }
    set key(nv){
        this.attr(key, nv);
    }



    _c: boolean = false;
    connectedCallback(){
        this.style.display = 'none';
        this.propUp([disabled, key]);
        this._c = true;
        this.onPropsChange();
    }


}