<template>
	<div class="frame d-flex flex-column justify-content-center align-items-center">
		<h3 class="my-5">Please login</h3>
		<b-form @submit.prevent="submit" class="col col-12 col-sm-7 col-md-6 col-lg-5">
			<!-- E-mail -->
			<b-input-group  class="mt-3 group group-email">
				<b-input-group-prepend class="px-3 icon d-flex align-items-center">
					<font-awesome-icon :icon="['fas', 'at']"/>
				</b-input-group-prepend>
				<b-form-input :state="state" v-model="email" type="text" placeholder="Your GSW e-mail"/>
			</b-input-group>
			<!-- Password -->
			<b-input-group class="mt-3 group group-password">
				<b-input-group-prepend class="px-3 icon d-flex align-items-center">
					<font-awesome-icon :icon="['fas', 'lock']"/>
				</b-input-group-prepend>
				<b-form-input v-model="password" type="password" placeholder="Password"/>
			</b-input-group>
			<!-- Buttons -->
			<div class="mt-5">
				<b-btn variant="outline-dark" class="d-block mx-auto px-3">
					Login
				</b-btn>
			</div>
		</b-form>
		<!-- Forgotten -->
		<div class="footer py-5">
			<b-link>
				Forgot password?
			</b-link>
		</div>
	</div>
</template>

<script>
export default {
	data: () => ({
		email: '',
		password: ''
	}),
	computed: {
		state () {
			return /^[^@]+@gsw[.]edu$/.test(this.email) || !this.email.length ? null : false;
		}
	}
}
</script>

<style>
	.group .icon {
		box-shadow: inset 0px 0px 0px 1px rgb(204,204,204);
	}
	.group-email input {
		text-transform: lowercase;
	}
	.frame {
		min-height: 75vh;
	}
	.group .form-control,
	.group .form-control:focus {
		box-shadow: none;
	}
	.group-password .form-control:focus {
		border-color: rgb(204,204,204);
	}
	.footer {
		position: absolute;
		bottom: 0;
	}
</style>


