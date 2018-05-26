import Vuex from "vuex";

const createStore = () => {
	return new Vuex.Store({
		state: {
			email: ''
		},
		mutations: {
			SET_EMAIL(state, value) {
				state.email = value;
			}
		}
	});
};

export default createStore;
