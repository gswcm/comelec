<template>
	<div class="p-3">
		<section id="header">
			<b-card
				header="Attention!!!"
				border-variant="danger"
				header-border-variant="danger"
				header-text-variant="danger">
				<p class="card-text">
					Incorrect use of this interface may result in unstable behavior of the application. Recovery from an archive is possible but does not guarfantee restoring of the most recent changes. Please use with caution.
				</p>
			</b-card>
		</section>
		<hr class="my-3">
		<section id="refresh">
			<refresh/>
		</section>
	</div>
</template>

<script>
import refresh from './refresh';
export default {
	components: {
		refresh
	}
}
</script>

