import Vue from "vue";
import vueNoty from 'vuejs-noty';

Vue.use(vueNoty, {
	killer: true,
	theme: 'bootstrap-v4',
	timeout: 4000,
	progressBar: false,
	layout: 'top',
	animation: {
		open: 'animated slideInDown',
		close: 'animated slideOutUp'
	}
});
