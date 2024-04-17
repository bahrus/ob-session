import { def } from 'trans-render/lib/def.js';
import { ObSession } from './ob-session.js';
await ObSession.bootUp();
def(ObSession.config.name, ObSession);
