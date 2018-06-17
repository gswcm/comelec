<template>
	<div>
		<!-- <pre>{{JSON.stringify(assignments,null,3)}}</pre> -->
		<b-card no-body>
			<b-tabs pills card vertical>
				<b-tab
					v-for="(a,i) of assignments"
					:title="a.committee.title"
					:key="a.committee.id"
					title-item-class="rounded"
					:active="!i">
					<h4>Proposed members</h4>
					<ol v-if="a.people.length">
						<li v-for="p of a.people" :key="p.id">
							{{p.name}}
						</li>
					</ol>
					<b-alert v-else variant="light" show>
						This committee doesn't have any proposed assignments
					</b-alert>
				</b-tab>
			</b-tabs>
		</b-card>
	</div>
</template>

<script>
import { mapState } from "vuex";
export default {
	data: function() {
		return {};
	},
	computed: {
		...mapState({
			assignments: "assignments"
		})
	}
};
</script>

<style>
	.rounded a {
		border-radius: 10px !important;
	}
</style>
