import Vue from 'vue';
import FontAwesomeIcon from '@fortawesome/vue-fontawesome';
import fontawesome from '@fortawesome/fontawesome';
import { faQuestionCircle } from '@fortawesome/fontawesome-free-regular';

fontawesome.library.add(
	faQuestionCircle
);

Vue.component(FontAwesomeIcon.name, FontAwesomeIcon);
