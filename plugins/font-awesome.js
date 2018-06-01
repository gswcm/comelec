import Vue from 'vue';
import FontAwesomeIcon from '@fortawesome/vue-fontawesome';
import fontawesome from '@fortawesome/fontawesome';
import { faQuestionCircle } from '@fortawesome/fontawesome-free-regular';
import { faInfoCircle } from '@fortawesome/fontawesome-free-solid';

fontawesome.library.add(
	faQuestionCircle, faInfoCircle
);

Vue.component(FontAwesomeIcon.name, FontAwesomeIcon);
