<template>
	<div class="py-5">
		<form @submit.prevent="emailUpdate">
			<!-- <h2>Please introduce yourself</h2> -->
			<b-form-group
				invalid-feedback="This is not a valid GSW e-mail address, try something that ends with <b>@gsw.edu</b>"
				:state="state">
				<b-form-input :state="state" name='email' :value="email" @input="debouncer" type="text" placeholder="Enter your GSW e-mail"></b-form-input>
			</b-form-group>
		</form>
	</div>
</template>

<script>
	import { debounce } from 'lodash';
	export default {
		data: () => ({
			email: "",
		}),
		computed: {
			state () {
				return /^[^@]+@gsw[.]edu$/.test(this.email) || !this.email.length ? null : false;
			},
		},
		methods: {
			emailUpdate(e) {
				this.email = typeof e === 'string' ? e : e.target.email.value || '';

			},
			debouncer: debounce(function(e) {
				this.emailUpdate(e);
			}, 500)
		}
	}
</script>

<style>
	.form-control,
	.form-control:focus {
		border: none;
		border-bottom: 1px solid #ccc !important;
		/* outline: 0 !important; */
		box-shadow: none !important;
	}
</style>

