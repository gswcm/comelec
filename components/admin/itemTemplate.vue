<template>
	<div class="p-3 border">
		<strong>{{`${item.firstName} ${item.lastName}`}}</strong>
		<span>{{ ` @ ${item.dept}` }}</span>
	</div>
</template>

<script>
export default {
	props: {
		item: { required: true },
		searchText: { required: true }
	}
};
</script>

<style>

</style>

