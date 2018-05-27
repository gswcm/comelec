import axios from "axios";

export const state = () => ({
	email: ""
});

export const mutations = {
	SET_EMAIL(state, value) {
		state.email = value;
	}
};

export const actions = {
	async EVAL_EMAIL({ commit }, email) {
		try {
			const { data } = await axios.post('/api/user', { email });
			console.log(JSON.stringify(data,null,3));
		}
		catch (error) {
			if (error.response && error.response.status === 401) {
				throw new Error("Bad credentials");
			}
			throw error;
		}
	}
};
