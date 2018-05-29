<template>
	<div>
		<b-navbar sticky toggleable="md" type="dark" variant="dark" class="d-print-none">
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
			<!-- right group -->
			<b-navbar-nav class="ml-auto">
				<b-nav-item href="/help" class="ml-auto">
					<font-awesome-icon :icon="['far', 'question-circle']" size="2x"/>
				</b-nav-item>
			</b-navbar-nav>
		</b-navbar>
		<nuxt/>
	</div>
</template>

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

</style>
