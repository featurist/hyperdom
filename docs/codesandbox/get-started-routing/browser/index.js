import hyperdom from 'hyperdom';
import router from 'hyperdom/router';
import App from './app';

hyperdom.append(document.body, new App(), { router });
