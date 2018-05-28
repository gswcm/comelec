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
						<b-form-input :state="state" name='email' @input="debouncer" type="text" placeholder="Enter your GSW e-mail"></b-form-input>
					</b-form-group>
				</form>
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
			this.rawEmail = typeof e === "string" ? e : e.target.email.value || "";
			if(this.state === null) {
				this.evalEmail();
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
		/* outline: 0 !important; */
		box-shadow: none !important;
	}
</style>
