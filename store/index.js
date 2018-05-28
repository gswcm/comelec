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
