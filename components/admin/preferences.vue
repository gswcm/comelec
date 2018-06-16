<template>
	<div class="px-1">
		<p>
			The following table summarizes preferences of individual faculty members and provides possible draft of committee assignments
		</p>
		<b-table responsive striped bordered :items="items" :fields="fields">
			<template slot="1" slot-scope="item">
				<ul class="list-unstyled">
					<li v-for="(v,i) of item.value" :key="i">
						{{v}}
					</li>
				</ul>
			</template>
			<template slot="2" slot-scope="item">
				<ul class="list-unstyled">
					<li v-for="(v,i) of item.value" :key="i">
						{{v}}
					</li>
				</ul>
			</template>
			<template slot="3" slot-scope="item">
				<ul class="list-unstyled">
					<li v-for="(v,i) of item.value" :key="i">
						{{v}}
					</li>
				</ul>
			</template>
			<template slot="details" slot-scope="row">
				<b-btn variant="link" @click="row.toggleDetails">
					<font-awesome-icon :icon="['far', 'plus-square']"/>
				</b-btn>
			</template>
			<template slot="row-details" slot-scope="row">
				<pre>{{JSON.stringify(row.item,null,3)}}</pre>
			</template>
		</b-table>
	</div>
</template>

<script>
export default {
	props: ['items'],
	data: () => ({
		fields: [
			{
				label: 'Committee',
				key: 'title',
				variant: 'dark',
				tdClass: 'nowrap'
			},
			{
				label: '1<span class="superscript">st</span> preference',
				key: '1',
				thClass: 'nowrap',
				tdClass: 'nowrap'
			},
			{
				label: '2<span class="superscript">nd</span> preference',
				key: '2',
				thClass: 'nowrap',
				tdClass: 'nowrap'
			},
			{
				label: '3<span class="superscript">rd</span> preference',
				key: '3',
				thClass: 'nowrap',
				tdClass: 'nowrap'
			},
			{
				label: '',
				key: 'details'
			}
		]
	}),
	methods: {
		showDetails(item) {
			console.log(item.index);
		}
	}

}
</script>

<style>
	.thead-dark {
		/* background-color: #333 */
	}
	.superscript {
		vertical-align: super;
	}
	ul {
		margin-bottom: 0 !important;
	}
	.nowrap {
		white-space: nowrap;
	}
	.h-100 {
		height: 100% !important;
	}

</style>

