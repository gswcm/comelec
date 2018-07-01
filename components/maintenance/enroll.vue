<template>
	<b-card id="mtn-enroll" title="Faculty Senate Members" sub-title="Add / remove site administrators">
		<p class="card-text">
			Any GSW employee can be assigned with a role of <strong>ComElec site administrator</strong>, but this role is primarily intended for the members of the GSW Faculty Senate.
		</p>
		<section v-show="admins.length">
			<p>
				List of current site administrators is shown below
			</p>
			<b-table
				bordered
				responsive
				head-variant=""
				:items="admins"
				:fields="fields">
				<template slot="idx" slot-scope="row">
					{{row.index + 1}}
				</template>
				<template slot="email" slot-scope="row">
					<a :href="`mailto:${row.value}`" target="_blank">{{row.value}}</a>
				</template>
				<template slot="action" slot-scope="row">
					<b-btn variant="link" class="p-0" @click="trash(row.index)">
						<font-awesome-icon :icon="['far', 'trash-alt']"/>
					</b-btn>
				</template>
			</b-table>
		</section>
		<div class="d-flex justify-content-end">
			<b-btn variant="secondary" @click="refresh">
				Reset
			</b-btn>
			<b-btn variant="outline-danger" @click="submit" :disabled="loading" class="ml-3">
				<font-awesome-icon v-show="loading" :icon="['fas', 'spinner']" spin/>
				<strong :class="{'ml-2': loading}">Submit</strong>
			</b-btn>
		</div>
	</b-card>
</template>

<script>
import axios from '~/plugins/axios';
export default {
	mounted() {
		this.refresh();
	},
	data: () => ({
		loading: false,
		admins: [],
		fields: [
			{ key: 'idx', label: '#', thClass: 'idxColumn' },
			{ key: 'name', label: 'Name', thClass: 'nameColumn' },
			{ key: 'dept',	label: 'Department', thClass: 'deptColumn'},
			{ key: 'email', label: 'E-Mail', thClass: 'emailColumn' },
			'action'
		]
	}),
	methods: {
		trash(index) {
			this.admins.splice(index,1);
		},
		async refresh() {
			const { data } = await axios.get('/api/directory/all?adminOnly')
			this.admins = data.map(e => ({
				name: `${e.firstName} ${e.lastName}`,
				dept: e.dept,
				email: e.email
			}))
		},
		async submit() {

		}
	}
}
</script>

<style>
	#mtn-enroll .deptColumn {
		width: 30%;
	}
	#mtn-enroll .nameColumn {
		width: 25%;
	}
	#mtn-enroll .emailColumn {
		width: 25%;
	}
</style>




