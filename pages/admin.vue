<template>
	<div class="p-3">
		<h3 class="text-center my-5">Restricted area only for members of the GSW Faculty Senate</h3>
		<div>
			<b-card no-body>
				<b-tabs pills card>
					<b-tab title="Committee assignments" active class="p-3" title-item-class="">
						<preferences :items="prefItems"/>
					</b-tab>
					<b-tab title="Modifications" class="p-3" title-item-class="">
						<modifications/>
					</b-tab>
					<b-tab title="Maintenance" title-item-class="ml-auto" class="p-3" disabled>
						Tab Contents 2
					</b-tab>
				</b-tabs>
			</b-card>
		</div>
		<div v-if="false" class="d-flex justify-content-center align-items-center py-5">
			<h2>Loading...</h2>
		</div>
	</div>
</template>

<script>
import preferences from '~/components/admin/preferences';
import modifications from '~/components/admin/modifications';
import axios from '~/plugins/axios';

export default {
	// middleware: "auth",
	async asyncData({ store, error }) {
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
	components: {
		preferences, modifications
	}
};
</script>


