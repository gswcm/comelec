import axios from '~/plugins/axios';

export const strict = false;

export const state = () => ({
	user: null,
	committees: null,
	uuid: null,
	storedService: null,
	history: null,
	authenticated: null,
	assignments: [],
	dataReady: false
});

export const mutations = {
	SET_USER(state, value) {
		state.user = value;
	},
	SET_COMMITTEES(state, value) {
		state.committees = value;
	},
	SET_UUID(state, value) {
		state.uuid = value
	},
	SET_STORED_SERVICE(state, value) {
		state.storedService = value
	},
	SET_AUTHENTICATED(state, value) {
		state.authenticated = value
	},
	SET_ASSIGNMENTS(state, value) {
		state.assignments = value;
	},
	SET_HISTORY(state, value) {
		state.history = value;
	},
	SET_DATA_READY(state, value) {
		state.dataReady = value;
	}
};

export const actions = {
	nuxtServerInit ({ commit }, { req }) {
	},
	async LOGIN({ commit }, { username, password }) {
		const { data } = await axios.post('/api/auth/login', { username, password });
		commit('SET_AUTHENTICATED', data);
	},
	async LOGOUT({ commit }) {
		try {
			await axios.post(`/api/auth/logout`);
			commit('SET_AUTHENTICATED', null);
		}
		catch(error) {
			throw new Error(error.message)
		}
	},
	async GET_USER_INFO({ state, commit, dispatch }, { email, showExOfficio }) {
		try {
			let response;
			commit('SET_DATA_READY', false);
			//-- user info
			response = await axios.get('/api/user/details', { params: { email } })
			commit('SET_USER', response.data);
			if(state.user) {
				//-- previously submitted service preference
				response = await axios.get('/api/service', {
					params: {
						person_id: state.user._id
					}
				})
				commit('SET_STORED_SERVICE', response.data ? response.data.committees.map(e => e ? e.id : null) : [ null, null, null ]);
				//-- history of previous services
				await dispatch('UPDATE_HISTORY', showExOfficio);
			}
			commit('SET_DATA_READY', true);
		}
		catch(error) {
			if(error.response && error.response.data) {
				throw new Error(error.response.data.message);
			}
			throw new Error(error.message);
		}
	},
	async UPDATE_HISTORY({ state, commit }, showExOfficio) {
		try {
			if(state.user) {
				const { data } = await axios.get('/api/user/last', { params: { user_id: state.user._id, showExOfficio } })
				commit('SET_HISTORY', (data && data.c) ? data.c : null);
			}
		}
		catch(error) {
			if(error.response && error.response.data) {
				throw new Error(error.response.data.message);
			}
			throw new Error(error.message);
		}
	},
	async GET_COMMITTEES({ commit, state }) {
		try {
			const { data } = await axios.get('/api/service/list');
			commit('SET_COMMITTEES', data);
		}
		catch(error) {
			if(error.response && error.response.data) {
				throw new Error(error.response.data.message);
			}
			throw new Error(error.message);
		}
	},
	async SET_STORED_SERVICE({ commit, state }, { reCaptchaResponse, user, storedService }) {
		try {
			const { data } = await axios.post('/api/service', {
				reCaptchaResponse,
				user,
				storedService,
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
	}
}
