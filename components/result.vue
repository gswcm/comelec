<template>
	<div>
		<div v-for="s of items.filter(e => e.people.length)" :key="s.committee.id">
			<h4 class="pl-3">
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
				<template slot="email" slot-scope="row">
					<a :href="`mailto:${row.value}`" target="_blank">{{row.value}}</a>
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
			{ key: 'idx', label: '#', thClass: 'idxColumn'},
			{ key: 'name', label: 'Name', thClass: 'nameColumn'},
			{ key: 'email', label: 'E-Mail', thClass: 'emailColumn'},
			{ key: 'x', label: 'Ex-officio'}
		]
	})
}
</script>

<style lang="scss">
	.nameColumn {
		width: 50%;
	}
	.emailColumn {
		width: 30%;
	}
	.idxColumn {
		width: 10%;
	}
</style>


