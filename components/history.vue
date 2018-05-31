<template>
	<div class="p-3 border rounded">
		<h5 class="text-info">Your previous committee assignments:</h5>
		<p v-if="services">
			Over the last 3 years you have served in the following committees:
			<ul>
				<li v-for="(service, index) in services" :key="index">
					{{ service }}
				</li>
			</ul>
		</p>
		<p v-else>
			We cannot find any history of your previous committee service.
		</p>
	</div>
</template>

<script>
	import axios from 'axios';
	import { mapState } from "vuex";
	export default {
		data: () => ({
			services: []
		}),
		mounted() {
			this.updateServices();
		},
		watch: {
			user() {
				this.updateServices();
			}
		},
		computed: {
			...mapState({
				user: "user",
			}),
		},
		methods: {
			async updateServices() {
				try {
					this.services = await this.$store.dispatch('GET_LAST_SERVICES', this.user._id);
				}
				catch(error) {
					console.error(error.message);
				}
			}
		}
	}
</script>
