<template>
	<section class="container">
		<div class="py-5">
			<div class="py-md-5">
				<form @submit.prevent="emailUpdate">
					<b-form-group invalid-feedback="This is not a valid GSW e-mail address, try something that ends with <b>@gsw.edu</b>" :state="state">
						<b-form-input :state="state" :value="email" name='email' @input="debouncer" type="text" placeholder="Enter your GSW e-mail"></b-form-input>
					</b-form-group>
				</form>
			</div>
			<div v-if="user">
				<h3>Welcome, {{user.firstName}}</h3>
				<p class="text-justify">
					If this is not you, please correct the email address and continue with submitting your committee preferences.
				</p>
			</div>
		</div>
	</section>
</template>

<script>
import { debounce } from 'lodash';
import { mapState } from "vuex";
export default {
	data: () => ({
		rawEmail: '',
	}),
	components: {
	},
	computed: {
		state () {
			return /^[^@]+@gsw[.]edu$/.test(this.rawEmail) || !this.rawEmail.length ? null : false;
		},
		email() {
			return this.user ? this.user.email : this.rawEmail;
		},
		...mapState({
			user: "user"
		}),
	},
	methods: {
		async evalEmail() {
			try {
				await this.$store.dispatch('EVAL_EMAIL', this.rawEmail);
				console.log(JSON.stringify(this.user,null,3));
			}
			catch(error) {
				console.error(error.message);
			}
		},
		emailUpdate(e) {
			console.log('--');
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
		min-width: 75vw !important;
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

	.form-control,
	.form-control:focus {
		border: none;
		border-bottom: 1px solid #ccc !important;
		box-shadow: none !important;
	}
</style>
