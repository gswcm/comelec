<template>
	<div class="p-3">
		<div v-if="ok">
			<b-alert show dismissible variant="success">
				Success
			</b-alert>
			<p>
				Your last preference submission(s) have been successfully confirmed. In 10 seconds you will be automatically redirected to the home page.
			</p>
		</div>
	</div>
</template>

<script>
	import axios from '~/plugins/axios';;
	export default {
		head() {
			return {
				meta: [
					{ 'http-equiv': 'refresh', content: '10; URL=/' }
				]
			}
		},
		async asyncData ({ query, error }) {
			try {
				const{ data } = await axios.get('/api/email', { params: query })
				return {
					ok: data.ok
				};
			}
			catch(err) {
				error({
					statusCode: err.statusCode ? err.statusCode : 500,
					message: (err.response && err.response.data) ? err.response.data.message : err.message
				})
			}
		}
	}
</script>
