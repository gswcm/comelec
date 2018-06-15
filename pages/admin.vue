<template>
	<div class="p-3">
		<h3 class="text-center my-5">Restricted area only for members of the GSW Faculty Senate</h3>
		<b-card no-body>
			<b-tabs pills card>
				<b-tab title="Summary" active class="p-3">
					<committees :items="summaryItems"/>
				</b-tab>
				<b-tab title="Maintenance" title-item-class="ml-auto" class="p-3">
					Tab Contents 2
				</b-tab>
			</b-tabs>
		</b-card>
	</div>
</template>

<script>
import committees from '~/components/admin/committees';
import axios from 'axios';
export default {
	middleware: "auth",
	async asyncData({ error }) {
		try {
			const { data } = await axios.get(`${process.env.baseUrl}/api/service/list`);
			let summaryItems = data.map(e => ({
				title: e.title,
				first: 1,
				second: 2,
				third: 3
			}));
			return { summaryItems };
		}
		catch(err) {
			error({
				statusCode: 500,
				message: err.message
			})
		}
	},
	components: {
		committees
	}
};
</script>
