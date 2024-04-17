import { define, XtallatX } from 'xtal-element/xtal-latx.js';
import { hydrate } from 'trans-render/hydrate.js';
import { session_storage_item_set, session_storage_item_removed } from './ob-session-api.js';
export const linkSessionStorage = ({ disabled, connected, handleItemChangeEvent, self }) => {
    if (disabled || !connected)
        return;
    self.boundSetHandler = handleItemChangeEvent.bind(self);
    window.addEventListener(session_storage_item_set, self.boundSetHandler);
    const boundRemoveHandler = handleItemChangeEvent.bind(self);
    window.addEventListener(session_storage_item_removed, self.boundRemoveHandler);
    self.boundRemoveHandler = boundRemoveHandler;
};
export const unbindHandlers = ({ disconnecting, self }) => {
    if (!disconnecting)
        return;
    if (self.boundSetHandler)
        window.removeEventListener(session_storage_item_set, self.boundSetHandler);
    if (self.boundRemoveHandler)
        window.removeEventListener(session_storage_item_removed, self.boundRemoveHandler);
};
export const linkValue = ({ disabled, key, boundRemoveHandler, self }) => {
    if (key === undefined)
        return;
    self.value = sessionStorage.getItem(key);
};
export const linkValueFromSessionChangeEvent = ({ disabled, lastEventDetail, key, self }) => {
    if (lastEventDetail === undefined)
        return;
    if (key === undefined) {
        self.value = lastEventDetail;
        return;
    }
    if (key === lastEventDetail.key) {
        self.value = lastEventDetail.newValue;
    }
};
export const propActions = [linkSessionStorage, unbindHandlers, linkValue, linkValueFromSessionChangeEvent];
/**
 * @element ob-session-watch
 * @prop {String} key - key to observe from SessionStorage
 * @prop {Object} lastEventDetail -- last item change event
 * @prop {Object} value - value of key in SessionStorage or LastEventDetail
 *
 * @attr {String} key - key to observe from SessionStorage
 *
 */
export class ObSessionWatch extends XtallatX(hydrate(HTMLElement)) {
    constructor() {
        super(...arguments);
        this.propActions = propActions;
    }
    handleItemChangeEvent(e) {
        this.lastEventDetail = e.detail;
    }
    connectedCallback() {
        this.style.display = 'none';
        super.connectedCallback();
        this.connected = true;
    }
    disconnectedCallback() {
        this.disconnecting = true;
    }
}
ObSessionWatch.is = 'ob-session-watch';
ObSessionWatch.attributeProps = ({ disabled, key, disconnecting, connected, boundRemoveHandler, value, lastEventDetail }) => ({
    bool: [disabled, disconnecting, connected],
    dry: [value],
    str: [key],
    obj: [value, boundRemoveHandler, lastEventDetail],
    notify: [value],
});
define(ObSessionWatch);
