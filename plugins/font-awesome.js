import Vue from 'vue';
import FontAwesomeIcon from '@fortawesome/vue-fontawesome';
import fontawesome from '@fortawesome/fontawesome';
import { faQuestionCircle, faEyeSlash } from '@fortawesome/fontawesome-free-regular';
import { faInfoCircle, faLock, faAt } from '@fortawesome/fontawesome-free-solid';

fontawesome.library.add(
	faQuestionCircle, faInfoCircle, faLock, faAt, faEyeSlash
);

Vue.component(FontAwesomeIcon.name, FontAwesomeIcon);
