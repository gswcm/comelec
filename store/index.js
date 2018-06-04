import axios from "axios";

export const strict = false;

export const state = () => ({
	user: null,
	committees: null,
	reCAPTCHA_KEY: null,
	uuid: null,
	service: null
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
	},
	SET_UUID(state, value) {
		state.uuid = value
	},
	SET_SERVICE(state, value) {
		state.service = value
	}
};

export const actions = {
	nuxtServerInit({ commit, dispatch }, { env, req }) {
		if (req.session && req.session.authUser) {
			commit('SET_USER', req.session.authUser);
		}
		if(req.session && req.session.service) {
			commit('SET_SERVICE', req.session.service.committees.map(e => e ? e.id : null));
		}
		commit('SET_reCAPTCHA_KEY', env.reCAPTCHA_KEY);
	},
	async GET_USER({ commit }, email) {
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
	async GET_HISTORY({ commit }, id) {
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
	async GET_COMMITTEES({ commit }) {
		try {
			const { data } = await axios.get(`http://${process.env.HOST}:${process.env.PORT}/api/service/list`);
			commit('SET_COMMITTEES', data);
		}
		catch(error) {
			if(error.response && error.response.data) {
				throw new Error(error.response.data.message);
			}
			throw new Error(error.message);
		}
	},
	async SET_SERVICE({ commit, state }, { response, user, service }) {
		try {
			const { data } = await axios.post('/api/service', {
				response,
				user,
				service,
				uuid: state.uuid
			});
			commit('SET_UUID', data.uuid);
		}
		catch(error) {
			if(error.response && error.response.data) {
				throw new Error(error.response.data.message);
			}
			throw new Error(error.message);
		}
	},
	async GET_SERVICE({ commit, state }) {
		try {
			if(state.user) {
				const { data } = await axios.get('/api/service', {
					params: {
						person_id: state.user._id
					}
				})
				commit('SET_SERVICE', data ? data.committees.map(e => e ? e.id : null) : [ null, null, null ]);
			}
		}
		catch(error) {
			if(error.response && error.response.data) {
				throw new Error(error.response.data.message);
			}
			throw new Error(error.message);
		}
	},
}
