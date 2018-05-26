<template>
	<section class="container">
		<div class="py-5">
			<h2 class="subtitle">
				GSW Committee Election Helper
			</h2>
			<hr>
			<!-- <email-handler/> -->
			<div class="py-5">
				<form @submit.prevent="emailUpdate">
					<!-- <h2>Please introduce yourself</h2> -->
					<b-form-group invalid-feedback="This is not a valid GSW e-mail address, try something that ends with <b>@gsw.edu</b>" :state="state">
						<b-form-input :state="state" name='email' :value="email" @input="debouncer" type="text" placeholder="Enter your GSW e-mail"></b-form-input>
					</b-form-group>
				</form>
			</div>
		</div>
	</section>
</template>

<script>
// import emailHandler from "~/components/emailHandler";
import { debounce } from 'lodash';
import { mapState } from "vuex";
export default {
	components: {
		// emailHandler
	},
	computed: {
		state () {
			return /^[^@]+@gsw[.]edu$/.test(this.email) || !this.email.length ? null : false;
		},
		...mapState({
			email: "email"
		}),
	},
	methods: {
		emailUpdate(e) {
			this.$store.commit('SET_EMAIL', typeof e === "string" ? e : e.target.email.value || "");
		},
		debouncer: debounce(function(e) {
			this.emailUpdate(e);
		}, 2000)
	}
};
</script>

<style>
	.container {
		min-height: 100vh;
		display: flex;
		justify-content: center;
		/* text-align: center; */
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
		/* outline: 0 !important; */
		box-shadow: none !important;
	}
</style>
