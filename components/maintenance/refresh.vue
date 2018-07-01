<template>
	<b-card title="Database refresh" sub-title="Synchronize application users with  GSW employee directory">
		<p class="card-text">
			The internal collection of users of the ComElec application needs to be kept synchronized with any changes projected to the GSW employees directory. Each synchronization may take up to 20-25 seconds and needs to be repeated periodically but not more than once per month.
		</p>
		<div class="d-flex justify-content-end">
			<b-btn variant="outline-danger" @click="refresh" :disabled="loading">
				<font-awesome-icon v-show="loading" :icon="['fas', 'spinner']" spin/>
				<strong :class="{'ml-2': loading}">Synchronize database</strong>
			</b-btn>
		</div>
	</b-card>
</template>

<script>
import axios from '~/plugins/axios';
export default {
	data: () => ({
		loading: false
	}),
	methods: {
		async refresh() {
			try {
				this.loading = true;
				const { data } = await axios.get('/api/directory/refresh');
				if(data) {
					this.$noty.success(`Success: ${data.all} records examined, ${data.new} records added, ${data.upd} records modified`);
				}
				this.loading = false;
			}
			catch(error) {
				console.error(error.message);
				this.$noty.error(error.message);
				this.loading = false;
			}
		}
	}
}
</script>

