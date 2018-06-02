import axios from "axios";

export const state = () => ({
	user: {},
	committees: [],
	reCAPTCHA_KEY: ''
});

export const mutations = {
	SET_USER(state, value) {
		state.user = value;
	},
	SET_COMMITTEES(state, value) {
		state.committees = value;
	},
	SET_reCAPTCHA_KEY(state, value) {
		state.reCAPTCHA_KEY = value;
	}
};

export const actions = {
	nuxtServerInit({ commit }, { env, req }) {
		if (req.session && req.session.authUser) {
			commit('SET_USER', req.session.authUser)
		}
		else {
			commit('SET_USER', null)
		}
		commit('SET_reCAPTCHA_KEY', env.reCAPTCHA_KEY);
	},
	async EVAL_EMAIL({ commit }, email) {
		try {
			const { data } = await axios.get('/api/user/details', { params: { email } })
			commit('SET_USER', data);
		}
		catch(error) {
			if(error.response && error.response.data) {
				throw new Error(error.response.data.message);
			}
			throw new Error(error.message);
		}
	},
	async GET_LAST_SERVICES({ commit }, id) {
		try {
			const { data } = await axios.get('/api/user/last', { params: { id } })
			return (data && data.c) ? data.c : null;
		}
		catch(error) {
			if(error.response && error.response.data) {
				throw new Error(error.response.data.message);
			}
			throw new Error(error.message);
		}
	},
	async GET_IEC_FLAG({ commit }, id) {
		try {
			const { data } = await axios.get('/api/user/iec', { params: { id } })
			return data;
		}
		catch(error) {
			if(error.response && error.response.data) {
				throw new Error(error.response.data.message);
			}
			throw new Error(error.message);
		}
	},
	async SET_COMMITTEES({ commit }) {
		try {
			const { data } = await axios.get('http://localhost:3000/api/committee/list');
			commit('SET_COMMITTEES', data);
		}
		catch(error) {
			if(error.response && error.response.data) {
				throw new Error(error.response.data.message);
			}
			throw new Error(error.message);
		}
	}
}
