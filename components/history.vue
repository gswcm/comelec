<template>
	<div class="p-3 border rounded">
		<h5 class="text-info">Your previous committee assignments:</h5>
		<div v-if="services">
			<p>
				Over the last 3 years you have served in the following committees:
				<ul class="mt-2">
					<li v-for="(service, index) in services" :key="index">
						{{ service }}
					</li>
				</ul>
			</p>
			<p v-if="iecFlag">
				Also, according to the history of your service in the "<strong>Institutional Effectiveness</strong>" committee, <strong>we suggest</strong> you to serve in this committee for at least one more year.
			</p>
		</div>
		<p v-else>
			We cannot find any history of your previous committee service.
		</p>
	</div>
</template>

<script>
	import axios from 'axios';
	import { mapState } from "vuex";
	import moment from 'moment';

	export default {
		data: () => ({
			services: [],
			iecFlag: false
		}),
		mounted() {
			if(this.user) {
				this.updateServices();
			}
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
					let temp = await this.$store.dispatch('GET_IEC_FLAG', this.user._id);
					let threeYearsBack = moment().subtract(3, 'years').format('YYYY');
					console.log(threeYearsBack);
					this.iecFlag = false;
					if(temp.length > 0 && temp.length < 3 && temp.indexOf(threeYearsBack) === -1) {
						this.iecFlag = true;
					}
				}
				catch(error) {
					console.error(error.message);
				}
			}
		}
	}
</script>
