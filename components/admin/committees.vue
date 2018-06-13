<template>
	<div class="px-1">
		<p>
			The following table summarizes preferences of individual faculty members and provides possible draft of committee assignments
		</p>
		<b-table responsive striped :items="items" :fields="fields"/>
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
				thClass: 'cols-auto'
			},
			{
				label: '1<span class="superscript">st</span> preference',
				key: 'first',
			},
			{
				label: '2<span class="superscript">nd</span> preference',
				key: 'second',
			},
			{
				label: '3<span class="superscript">rd</span> preference',
				key: 'third',
			}
		]
	})
}
</script>

<style>
	.thead-dark {
		/* background-color: #333 */
	}
	.superscript {
		vertical-align: super;
	}

</style>

