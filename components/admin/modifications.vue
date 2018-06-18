<template>
	<div>
		<section>
			<h4 class="my-3">This interface implements 2 features</h4>
			<ol>
				<li>
					<strong>Visualize</strong> modified lists of proposed committee members
				</li>
				<li>
					Add additional members including <strong>ex-officio</strong> ones
				</li>
			</ol>
		</section>
		<b-card no-body class="mt-5">
			<b-tabs pills card vertical>
				<b-tab
					v-for="(a,i) of all"
					:title="a.committee.title"
					:key="a.committee.id"
					title-item-class="rounded"
					:active="!i"
					class="h-100">
					<div class="d-flex flex-column justify-content-between h-100">
						<div>
							<div v-if="a.people.length">
								<h4>Proposed members</h4>
								<b-table responsive striped :items="a.people" :fields="fields">
									<template slot="idx" slot-scope="row">
										{{row.index + 1}}
									</template>
									<template slot="email" slot-scope="row">
										<a :href="`mailto:${row.value}`" target="_blank">{{row.value}}</a>
									</template>
									<template slot="x" slot-scope="row">
										<font-awesome-icon v-if="row.value" :icon="['fas', 'check']"/>
									</template>
								</b-table>
							</div>
							<b-alert v-else variant="light" show>
								This committee doesn't have any proposed members
							</b-alert>
						</div>
						<div>
							<b-btn variant="outline-info" class="d-block px-3 ml-auto">
								Add more...
							</b-btn>
						</div>
					</div>
				</b-tab>
			</b-tabs>
		</b-card>
	</div>
</template>

<script>
import { mapState } from "vuex";
export default {
	data: function() {
		return {
			fields: [
				{
					key: 'idx',
					label: '#'
				},
				{
					key: 'name',
				},
				{
					key: 'email',
					label: 'E-Mail'
				},
				{
					key: 'x',
					label: 'Ex-officio'
				}
			],
			added: []
		};
	},
	computed: {
		...mapState({
			assignments: "assignments"
		}),
		all() {
			return this.assignments.map(e => {
				let people = e.people.map(ee => ({...ee, x: false}));
				let added = this.added.find(ee => ee.committee.id === e.committee.id);
				if(added && added.people.length) {
					people.push(...added.people);
				}
				return {
					committee: e.committee,
					people
				}
			});
		}
	}
};
</script>

<style>
	.rounded a {
		border-radius: 10px !important;
	}
	.btn-add-more {

	}
</style>
