<template>
	<div class="frame d-flex flex-column justify-content-center align-items-center">
		<h3 class="my-5">Please login</h3>
		<p class="mb-3 text-center">
			Use your CanesNet credentials to login.
			<br>
			<span class="text-warning">Only members of the <strong>GSW Faculty Senate</strong> are allowed in this area.</span>
		</p>
		<b-form @submit.prevent="login" class="d-flex justify-content-center w-100">
			<!-- Username -->
			<div class="col col-12 col-sm-7 col-md-6 col-lg-5">
				<b-input-group  class="mt-3 group group-username">
					<b-input-group-prepend class="px-3 icon d-flex align-items-center">
						<font-awesome-icon :icon="['fas', 'user']"/>
					</b-input-group-prepend>
					<b-form-input :state="state" v-model="username" type="text" placeholder="username"/>
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
					<b-btn type="submit" variant="dark" class="d-block mx-auto px-3" :disabled="!username.length || !password.length">
						Login
					</b-btn>
				</div>
			</div>
		</b-form>
	</div>
</template>

<script>
export default {
	data: () => ({
		username: '',
		password: ''
	}),
	middleware: [
		'login'
	],
	computed: {
		state () {
			return /^[^.]+/.test(this.username) || !this.username.length ? null : false;
		},
		disabled() {
			return !this.username.length || this.state === false
		},
		usernameFiltered() {
			return this.username.toLowerCase().split(/@/)[0]
		}
	},
	methods: {
		async login() {
			try {
				await this.$store.dispatch('LOGIN', {
					username: this.usernameFiltered,
					password: this.password
				});
				this.$router.push('/admin');
			}
			catch(error) {
				console.error(error.message);
				this.$noty.error(`Access denied or authentication server failure`);
			}
		}
	}
}
</script>

<style>
	.group .icon {
		box-shadow: inset 0px 0px 0px 1px rgb(204,204,204);
	}
	.group svg {
		color: #888;
	}
	.group-username input {
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
</style>


