<template>
	<section class="container">
		<div class="py-5">
			<h2 class="subtitle">
				GSW Committee Election Helper
			</h2>
			<hr>
			<email-handler/>

		</div>
	</section>
</template>

<script>
import emailHandler from "~/components/emailHandler";
export default {
	components: {
		emailHandler
	}
};
</script>

<style>
.container {
	min-height: 100vh;
	display: flex;
	justify-content: center;
	/* text-align: center; */
}

.subtitle {
	font-weight: 300;
	font-size: 42px;
	color: #526488;
	word-spacing: 5px;
	padding-bottom: 15px;
}

</style>
