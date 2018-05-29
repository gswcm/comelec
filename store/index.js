import axios from "axios";

export const state = () => ({
	user: {}
});

export const mutations = {
	SET_USER(state, value) {
		state.user = value;
	}
};

export const actions = {
	nuxtServerInit({ commit }, { req }) {
		if (req.session && req.session.authUser) {
			commit('SET_USER', req.session.authUser)
		}
		else {
			commit('SET_USER', null)
		}
	},
	async EVAL_EMAIL({ commit }, email) {
		try {
			const { data } = await axios.post('/api/user', { email })
			commit('SET_USER', data);
		}
		catch(error) {
			throw new Error(`Store.actions.EVAL_EMAIL: ${error.message}`);
		}
	}
}
