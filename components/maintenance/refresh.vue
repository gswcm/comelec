<template>
	<b-card title="Database refresh" sub-title="Synchronize application users with  GSW employee directory">
		<p class="card-text">
			The internal collection of users of the ComElec application needs to be kept synchronized with any changes projected to the GSW employees directory. Each synchronization may take up to 20-25 seconds and needs to be repeated periodically but not more than once per month.
		</p>
		<p>
			In case when only a few users need to be updated, a list of their comma-separated <strong>last names</strong> needs to be provided in the field below
		</p>
		<b-form @submit.prevent="refresh">
			<div class="d-flex justify-content-between">
				<div class="flex-grow-1">
					<b-input id="query" v-model="query" placeholder="Comma-separated list of last names, e.g. weaver, Lee, ronaldinho, Schwarzenegger"/>
				</div>
				<b-btn variant="outline-danger" @click="refresh" :disabled="loading" class="ml-3">
					<font-awesome-icon v-show="loading" :icon="['fas', 'spinner']" spin/>
					<strong :class="{'ml-2': loading}">Synchronize database</strong>
				</b-btn>
			</div>
		</b-form>
	</b-card>
</template>

<script>
import axios from '~/plugins/axios';
export default {
	data: () => ({
		loading: false,
		query: ''
	}),
	methods: {
		async refresh() {
			try {
				this.loading = true;
				const { data } = await axios.get(`/api/directory/refresh${this.query ? '?query=' + this.query.toLowerCase() : ''}`);
				if(data) {
					this.$noty.success(`Success: ${data.all} record(s) matched, ${data.new} record(s) added, ${data.upd} record(s) modified`);
				}
			}
			catch(error) {
				console.error(error.message);
				this.$noty.error(error.message);
			}
			finally {
				this.query = '';
				this.loading = false;
			}
		}
	}
}
</script>

<style>
	#query:focus {
		box-shadow: none;
	}
</style>




