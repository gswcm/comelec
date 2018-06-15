<template>
	<div>
		<b-navbar sticky toggleable="sm" type="dark" variant="dark" class="d-print-none">
			<!-- Left group -->
			<b-navbar-brand to="/">
				<img src="~/assets/gsw_logo_inverted_1.png" alt="GSW Logo"/>
				<span class="d-none d-sm-inline-block">
					GSW Commitee Election Helper, a.k.a. ComElec
				</span>
				<span class="d-inline-block d-sm-none">
					GSW ComElec
				</span>
			</b-navbar-brand>
			<b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
			<!-- right group -->
			<b-collapse is-nav id="nav_collapse">
				<b-navbar-nav class="ml-auto mr-2">
					<template v-if="$store.state.authenticated">
						<b-nav-item  @click="logout" class="ml-auto logout" v-b-tooltip.hover title="Logout">
							<font-awesome-icon :icon="['fas', 'sign-out-alt']" size="2x"/>
						</b-nav-item>
						<!-- <b-nav-item  to="/admin" class="ml-auto admin" v-b-tooltip.hover title="Faculty Senate interface ">
							<font-awesome-icon :icon="['fas', 'user-cog']" size="2x"/>
						</b-nav-item> -->
					</template>
					<b-nav-item v-else to="/login" class="ml-auto login" v-b-tooltip.hover title="Faculty Senate login">
						<font-awesome-icon :icon="['fas', 'sign-in-alt']" size="2x"/>
					</b-nav-item>
					<b-nav-item to="/help" class="ml-auto" v-b-tooltip.hover title="Help / About">
						<font-awesome-icon :icon="['far', 'question-circle']" size="2x"/>
					</b-nav-item>
				</b-navbar-nav>
			</b-collapse>
		</b-navbar>
		<nuxt/>
	</div>
</template>

<script>
export default {
	methods: {
		async logout() {
			try {
				await this.$store.dispatch('LOGOUT');
				this.$router.replace('/');
			}
			catch(error) {
				console.error(error.message);
			}
		}
	}
}
</script>


<style>
html {
	font-family: "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial,
		sans-serif;
	font-size: 16px;
	word-spacing: 1px;
	-ms-text-size-adjust: 100%;
	-webkit-text-size-adjust: 100%;
	-moz-osx-font-smoothing: grayscale;
	-webkit-font-smoothing: antialiased;
	box-sizing: border-box;
}

*,
*:before,
*:after {
	box-sizing: border-box;
	margin: 0;
}

.navbar-brand img {
	max-height: 30px !important;
	margin-right: 1em !important;
}

.admin svg {
	color: rgba(255,255,255, 0.7);
	cursor: pointer;
}
.admin svg:hover {
	color: #fff;
}
.login svg {
	color: rgba(67, 172, 106, 0.7);
	cursor: pointer;
}
.login svg:hover {
	color: rgba(67, 172, 106, 0.9);
}
.logout svg {
	color: rgba(240, 65, 36, 0.7);
	cursor: pointer;
}
.logout svg:hover {
	color: rgba(240, 65, 36, 0.9);
}

</style>
