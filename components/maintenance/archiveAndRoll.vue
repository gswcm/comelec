<template>
	<b-card title="Archive N' Roll" sub-title="Archive this year assignments as historical data, and clean up for the next year cycle">
		<ol>
			<li>
				This year committees assignments have to be saved as the next year historical data (<strong>archive</strong>)
			</li>
			<li>
				All service preferences submitted by faculty have to be removed (<strong>roll over</strong>)
			</li>
		</ol>
		<div class="d-flex justify-content-end">
			<b-btn variant="outline-danger" @click="anr(true)">
				Archive
			</b-btn>
			<b-btn variant="outline-danger" @click="anr(false)" class="ml-3">
				Roll Over
			</b-btn>
		</div>
	</b-card>
</template>

<script>
import axios from '~/plugins/axios';
export default {
	methods: {
		async anr(doArchive) {
			try {
				if(doArchive) {
					const { data } = await axios.patch('/api/anr/history');
					this.$noty.success(`The committees assignment for ${data.thisYear} year containing ${data.ycf.length} records has been used to populate historical data`);
				}
				else {
					const { data } = await axios.post('/api/anr/roll');
					this.$noty.success(`Service preferences have been removed`);
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





