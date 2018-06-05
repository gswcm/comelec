<template>
	<section class="container">
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
			<div v-if="user && dataReady" class="mt-5">
				<h3>Hello, {{salutation}}</h3>
				<p class="text-justify">
					If this is not you, please correct the email address and continue with submitting your committee preferences.
				</p>
				<!-- Summary of previous service  -->
				<div id="history" class="p-3 border">
					<div v-if="serviceSummary">
						<p>
							Over the last 3 years you have served on the following committees:
						</p>
						<ul class="mt-2">
							<li v-for="(service, index) in serviceSummary" :key="index">
								{{ service }}
							</li>
						</ul>
						<p v-if="iecFlag">
							Also, according to the history of your service in the "<strong>Institutional Effectiveness</strong>" committee, <strong>we suggest</strong> you to serve in this committee for at least one more year.
						</p>
					</div>
					<p v-else>
						We cannot find any history of your previous committee service.
					</p>
				</div>
				<!-- Form to provide new year preference -->
				<service :storedService="service"/>
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
import axios from 'axios';
import moment from 'moment';
import service from '~/components/service';
export default {
	/*
	//-- Auto focus doesn't properly work in IE
	mounted() {
		this.$nextTick(() => {
			if(this.$refs && this.$refs.email) {
				this.$refs.email.focus();
			}
		});
	},
	*/
	async fetch({ store, req }) {
		await store.dispatch('GET_COMMITTEES');
	},
	data: () => ({
		rawEmail: '',
		serviceSummary: [],
		iecFlag: false,
		dataReady: false
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
			service: "service"
		}),
	},
	methods: {
		async evalEmail() {
			try {
				await this.$store.dispatch('GET_USER', this.rawEmail);
				await this.$store.dispatch('GET_SERVICE');
				this.serviceSummary = await this.$store.dispatch('GET_HISTORY', this.user._id);
				const iecYears = await this.$store.dispatch('GET_IEC_FLAG', this.user._id);
				const threeYearsBack = moment().subtract(3, 'years').format('YYYY');
				if(iecYears.length > 0 && iecYears.length < 3 && iecYears.indexOf(threeYearsBack) === -1) {
					this.iecFlag = true;
				}
			}
			catch(error) {
				console.error(error.message);
			}
		},
		emailUpdate(e) {
			this.rawEmail = (typeof e === "string" ? e : e.target.email.value || "").toLowerCase();
			if(this.state === null) {
				this.evalEmail();
				this.dataReady = true;
			}
			else {
				this.dataReady = false;
				this.$store.commit('SET_USER', null);
				this.$store.commit('SET_SERVICE', null);
				this.$store.commit('SET_UUID', null);
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
</style>
