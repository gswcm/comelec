<template>
	<div class="p-3">
		<h3 class="text-center my-5">Restricted area only for members of the GSW Faculty Senate</h3>
		<div v-if="$store.state.dataReady">
			<b-card no-body>
				<b-tabs pills card>
					<b-tab title="Initial assignments" active class="p-3" title-item-class="">
						<preferences :items="prefItems"/>
					</b-tab>
					<b-tab title="Modifications" class="p-3" title-item-class="">
						<modifications/>
					</b-tab>
					<b-tab title="Publish" class="p-3" title-item-class="">
						<no-ssr>
							<report/>
						</no-ssr>
					</b-tab>
					<b-tab title="Maintenance" title-item-class="ml-auto" class="p-3" disabled>
						Tab Contents 2
					</b-tab>
				</b-tabs>
			</b-card>
		</div>
		<div v-else class="d-flex justify-content-center align-items-center py-5">
			<spinner
			:status="true"
			color="#4fc08d"
			:size="50"
			:depth="3"
			:rotation="true"
			:speed="0.8"/>
		</div>
	</div>
</template>

<script>
import preferences from '~/components/admin/preferences';
import modifications from '~/components/admin/modifications';
import report from '~/components/admin/report';
import axios from '~/plugins/axios';
import spinner from 'vue-spinner-component/src/Spinner.vue'

export default {
	middleware: [
		'admin'
	],
	data: () => ({
	}),
	async asyncData({ store, error }) {
		store.commit('SET_DATA_READY', false);
		try {
			const preferences = (await axios.get('/api/service/preferences')).data;
			let prefItems = (await axios.get('/api/service/list')).data.map(e => ({
				committee: {
					title: e.title,
					id: e._id
				},
				1: [],
				2: [],
				3: [],
				people: []
			}));
			for(let p of preferences) {
				let committee = prefItems.find(e => e.committee.title === p.committee.title);
				committee[p.committee.preference] = [...p.people];
				committee.people.push(...p.people);
			}
			for(let e of prefItems) {
				e.departments = (e.people && e.people.length) ? (await axios.get('/api/directory/group', {
					params: {
						query: e.people.map(e => e.id)
					}
				})).data : []
			}
			return { prefItems};
		}
		catch(err) {
			error({
				statusCode: 500,
				message: err.message
			})
		}
	},
	mounted() {
		this.$store.commit('SET_DATA_READY', true);
	},
	components: {
		preferences, modifications, spinner, report
	}
};
</script>


