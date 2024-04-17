import {def} from 'trans-render/lib/def.js';
import {ObSession} from './ob-session.js';

await ObSession.bootUp();
def('ob-session', ObSession);

declare global {
    interface HTMLElementTagNameMap {
      'ob-session': ObSession;
    }
}