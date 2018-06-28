<template>
	<div>
		<b-row>
			<b-col cols="12" sm>
				<h5>
					Submitted By
				</h5>
				<b-form-select v-model="name" :options="names" @input="update"/>
			</b-col>
			<b-col cols="12" sm>
				<h5>
					Submitted At
				</h5>
				<b-form-select :disabled="!item" v-model="id" :options="dates" @input="update"/>
			</b-col>
			<b-col cols="auto" align-self="end" class="pl-0">
				<b-btn variant="link" @click="refresh">
					<font-awesome-icon :icon="['fas', 'sync-alt']"/>
				</b-btn>
			</b-col>
		</b-row>
		<hr class="my-3">
		<pre>{{JSON.stringify(submission,null,3)}}</pre>
	</div>
</template>

<script>
import axios from '~/plugins/axios';
import { mapState } from 'vuex';
import moment from 'moment';
const dashes = {
	value: null,
	text: '--'
};
export default {
	data: () => ({
		items: [],
		name: null,
		id: null,
		submission: null
	}),
	mounted() {
		this.refresh();
	},
	watch: {
		hash() {
			this.refresh();
		}
	},
	computed: {
		...mapState({
			hash: "assignmentHash"
		}),
		names() {
			return [
				dashes,
				...this.items.map(e => ({
					value: e.name,
					text: e.name
				}))
			]
		},
		item() {
			return this.name ? this.items.find(e => e.name === this.name) : null;
		},
		dates() {
			return this.item ? [
				dashes,
				...this.item.ids.map(e => ({
					value: e.id,
					text: moment(e.createdAt).format('lll')
				}))
			] : dashes;
		}
	},
	methods: {
		async refresh() {
			try {
				this.items = (await axios.get('/api/assignment/group')).data;
			}
			catch(error) {
				console.error(error.message);
				this.$noty.error(error.message);
			}
		},
		async update() {
			try {
				if(this.name && this.id) {
					this.submission = (await axios.get(`/api/assignment/details?id=${this.id}`)).data;
				}
				else {
					this.submission = null;
				}
			}
			catch(error) {
				console.error(error.message);
				this.$noty.error(error.message);
			}
		}
	}
}
</script>

