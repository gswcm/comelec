<template>
	<div class="container">
	</div>
</template>

<script>
	export default {
		async fetch({ store, redirect }) {
			if(store.state.isLoggedIn) {
				await store.dispatch('LOGOUT');
			}
			redirect('/');
		}
	}
</script>

<style>
</style>


