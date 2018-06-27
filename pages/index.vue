<template>
	<section id="index" class="container">
		<div class="py-5">
			<div class="py-2"><!-- vertical spacer --></div>
			<div class="card border-dark">
				<div class="card-header border-dark border bg-dark rounded text-light text-center">
					<h5>Please, identify yourself</h5>
				</div>
				<div class="card-body pb-1">
					<form @submit.prevent="emailUpdate">
						<b-form-group invalid-feedback="This is not a valid GSW e-mail address, try something that ends with <b>@gsw.edu</b>" :state="state">
							<b-form-input id="email" :state="state" ref="email" :value="email" name='email' @input="debouncer" type="text" placeholder="Enter your GSW e-mail"></b-form-input>
						</b-form-group>
					</form>
				</div>
			</div>
			<div v-if="dataReady" class="mt-5">
				<h3>Hello, {{salutation}}</h3>
				<p class="text-justify">
					If this is not you, please correct the email address and continue with submitting your committee preferences.
				</p>
				<!-- Summary of previous service  -->
				<div id="history" class="p-3 border">
					<div v-if="history">
						<p>
							Over the last 3 years you have served on the following committees:
						</p>
						<ul class="mt-2">
							<li v-for="(item, index) in history" :key="index">
								{{ item }}
							</li>
						</ul>
					</div>
					<p v-else>
						We cannot find any history of your previous committee service.
					</p>
					<!-- Show ex-officio members -->
					<hr v-if="history">
					<b-form-checkbox v-model="showExOfficio">
						Treat <strong>ex-officio</strong> service in committees as normal service
					</b-form-checkbox>
				</div>
				<!-- Form to provide new year preference -->
				<service :storedService="storedService"/>
			</div>
			<div v-else-if="user" class="d-flex justify-content-center align-items-center py-5">
				<h2>Loading...</h2>
			</div>
		</div>
	</section>
</template>

<script>
import { debounce } from 'lodash';
import { mapState } from 'vuex';
import moment from 'moment';
import service from '~/components/service';
export default {
	async fetch({ store, req }) {
		await store.dispatch('GET_COMMITTEES');
		let email = '';
		if(req && req.session && req.session.email) {
			email = req.session.email;
		}
		else if(store.state.user && store.state.user.email) {
			email = store.state.user.email;
		}
		if (email.length && !store.state.user) {
			await store.dispatch('GET_USER_INFO', {
				email,
				showExOfficio: false
			});
		}
		else {
			store.commit('SET_DATA_READY', false);
		}
	},
	data: () => ({
		rawEmail: '',
		showExOfficio: false
	}),
	components: {
		service
	},
	computed: {
		state () {
			return /^[^@]+@gsw[.]edu$/.test(this.rawEmail) || !this.rawEmail.length ? null : false;
		},
		email() {
			return this.user ? this.user.email : this.rawEmail;
		},
		salutation() {
			return this.user ? this.user.email.split(/[.]/)[0].split('').map((letter,index) => index ? letter : letter.toUpperCase()).join('') : 'User';
		},
		...mapState({
			user: "user",
			committees: "committees",
			storedService: "storedService",
			history: "history",
			dataReady: "dataReady"
		}),
	},
	watch: {
		async showExOfficio() {
			try {
				await this.$store.dispatch('UPDATE_HISTORY', this.showExOfficio);
			}
			catch(error) {
				console.error(error.message);
			}
		}
	},
	methods: {
		async evalEmail() {
			try {
				await this.$store.dispatch('GET_USER_INFO', {
					email: this.rawEmail,
					showExOfficio: this.showExOfficio
				});
			}
			catch(error) {
				console.error(error.message);
			}
		},
		emailUpdate(e) {
			this.rawEmail = (typeof e === "string" ? e : e.target.email.value || "").toLowerCase();
			if(this.state === null) {
				this.evalEmail();
			}
			else {
				this.$store.commit('SET_UUID', null);
				this.$store.commit('SET_DATA_READY', false);
			}
		},
		debouncer: debounce(function(e) {
			if(e !== this.rawEmail) {
				this.emailUpdate(e);
			}
		}, 500)
	}
};
</script>

<style>
	form {
		min-width: 80vw !important;
		text-align: center;
	}
	.card {
		border-radius: 11px;
	}
	.card-header {
		border-radius: 10px 10px 0 0 !important;
	}
	.container {
		min-height: 100vh;
		display: flex;
		justify-content: center;
	}
	#history {
		border-radius: 10px;
	}
	#email {
		text-transform: lowercase;
	}
	#index .form-control,
	#index .form-control:focus {
		border: none;
		border-bottom: 1px solid #ccc !important;
		box-shadow: none !important;
	}
	#index .card .form-control,
	#index .card .form-control:focus {
		border-bottom: none !important;
		text-align: center;
		font-size: large;
		font-weight: bold;
	}
</style>
