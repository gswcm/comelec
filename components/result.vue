<template>
	<div>
		<div v-for="s of items.filter(e => e.people.length)" :key="s.committee.id">
			<h4>
				{{s.committee.title}}
			</h4>
			<b-table
				v-if="s.people.length"
				class="my-3"
				bordered
				responsive
				:fields="fields"
				:items="s.people">
				<template slot="idx" slot-scope="row">
					{{row.index + 1}}
				</template>
				<template slot="x" slot-scope="row">
					<font-awesome-icon v-if="row.value" :icon="['fas', 'check']"/>
				</template>
			</b-table>
		</div>
	</div>
</template>

<script>
export default {
	props: ['items'],
	data: () => ({
		fields: [
			{ key: 'idx', label: '#'},
			{ key: 'name', label: 'Name'},
			{ key: 'email', label: 'E-Mail'},
			{ key: 'x', label: 'Ex-officio'}
		]
	})
}
</script>

