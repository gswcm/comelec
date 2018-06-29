<template>
	<div class="container p-3">
		<div v-if="submission">
			<h3 class="my-5 d-flex justify-content-center">
				GSW Standing Committees for {{year}} academic year
			</h3>
			<result :items="submission.submission"/>
		</div>
		<div v-else class="h-100 d-flex justify-content-center align-items-center">
			<h3>
				Nothing to show
				<br>
				<small>
					please contact GSW Faculty Senate for clarifications
				</small>
			</h3>
		</div>
	</div>
</template>

<script>
import axios from '~/plugins/axios';
import result from '~/components/result';
import moment from 'moment';
export default {
	async asyncData() {
		const { data } = await axios.get('/api/assignment');
		return {
			submission: data
		}
	},
	computed: {
		year() {
			return moment().format('YYYY');
		}
	},
	components: {
		result
	}
}
</script>

<style scoped>
	.container {
		height: 50vh;
	}
</style>

