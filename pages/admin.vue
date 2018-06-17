<template>
	<div class="p-3">
		<h3 class="text-center my-5">Restricted area only for members of the GSW Faculty Senate</h3>
		<b-card no-body>
			<b-tabs pills card>
				<b-tab title="Preferences" active class="p-3">
					<preferences :items="prefItems"/>
				</b-tab>
				<b-tab title="Maintenance" title-item-class="ml-auto" class="p-3">
					Tab Contents 2
				</b-tab>
			</b-tabs>
		</b-card>
	</div>
</template>

<script>
import preferences from '~/components/admin/preferences';
import axios from '~/plugins/axios';
export default {
	// middleware: "auth",
	async asyncData({ error }) {
		try {
			const preferences = (await axios.get('/api/service/preferences')).data;
			let prefItems = (await axios.get('/api/service/list')).data.map(e => ({
				title: e.title,
				1: [],
				2: [],
				3: [],
				people: []
			}));
			for(let p of preferences) {
				let committee = prefItems.find(e => e.title === p.committee.title);
				committee[p.committee.preference] = [...p.people.map(e => e.name)];
				committee.people.push(...p.people.map(e => e.id));
			}
			for(let e of prefItems) {
				e.departments = (e.people && e.people.length) ? (await axios.get('/api/directory/group', {
					params: {
						query: e.people
					}
				})).data : []
			}
			return { prefItems };
		}
		catch(err) {
			error({
				statusCode: 500,
				message: err.message
			})
		}
	},
	components: {
		preferences
	}
};
</script>
