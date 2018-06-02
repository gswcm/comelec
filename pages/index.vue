<template>
	<section class="container">
		<div class="py-5">
			<div class="card border-dark">
				<div class="card-header border-dark border bg-dark rounded text-light text-center">
					<h5>Please, identify yourself</h5>
				</div>
				<div class="card-body pb-1">
					<form @submit.prevent="emailUpdate">
						<b-form-group invalid-feedback="This is not a valid GSW e-mail address, try something that ends with <b>@gsw.edu</b>" :state="state">
							<b-form-input :state="state" ref="email" :value="email" name='email' @input="debouncer" type="text" placeholder="Enter your GSW e-mail"></b-form-input>
						</b-form-group>
					</form>
				</div>
			</div>
			<div v-if="user" class="mt-5">
				<h3>Hello, {{salutation}}</h3>
				<p class="text-justify">
					If this is not you, please correct the email address and continue with submitting your committee preferences.
				</p>
				<history/>
				<service :committees="committees"/>
			</div>
		</div>
	</section>
</template>

<script>
import { debounce } from 'lodash';
import { mapState } from 'vuex';
import axios from 'axios';
import history from '~/components/history'
import service from '~/components/service'
export default {
	mounted() {
		this.$nextTick(() => {
			if(this.$refs && this.$refs.email) {
				this.$refs.email.focus();
			}
		});
	},
	async fetch({ store }) {
		await store.dispatch('SET_COMMITTEES');
	},
	data: () => ({
		rawEmail: '',
	}),
	components: {
		history, service
	},
	computed: {
		state () {
			return /^[^@]+@gsw[.]edu$/.test(this.rawEmail) || !this.rawEmail.length ? null : false;
		},
		email() {
			return this.user ? this.user.email : this.rawEmail;
		},
		salutation() {
			return this.user.email.split(/[.]/)[0].split('').map((letter,index) => index ? letter : letter.toUpperCase()).join('')
		},
		...mapState({
			user: "user",
			committees: "committees"
		}),
	},
	methods: {
		async evalEmail() {
			try {
				await this.$store.dispatch('EVAL_EMAIL', this.rawEmail);
			}
			catch(error) {
				console.error(error.message);
			}
		},
		emailUpdate(e) {
			this.rawEmail = typeof e === "string" ? e : e.target.email.value || "";
			if(this.state === null) {
				this.evalEmail();
			}
			else {
				this.$store.commit('SET_USER', null);
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

	.subtitle {
		font-weight: 300;
		font-size: 42px;
		color: #526488;
		word-spacing: 5px;
		padding-bottom: 15px;
	}


</style>
