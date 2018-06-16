import Vue from 'vue';
import FontAwesomeIcon from '@fortawesome/vue-fontawesome';
import fontawesome from '@fortawesome/fontawesome';
import {
	faQuestionCircle,
	faEyeSlash,
	faPlusSquare
} from '@fortawesome/fontawesome-free-regular';

import {
	faInfoCircle,
	faLock,
	faAt,
	faUser,
	faSignInAlt,
	faSignOutAlt,
	faUserCog,
} from '@fortawesome/fontawesome-free-solid';

fontawesome.library.add(
	faQuestionCircle,
	faInfoCircle,
	faLock,
	faAt,
	faEyeSlash,
	faUser,
	faSignInAlt,
	faSignOutAlt,
	faUserCog,
	faPlusSquare
);

Vue.component(FontAwesomeIcon.name, FontAwesomeIcon);
