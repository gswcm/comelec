<template>
	<div>
		<section id="header">
			<b-row>
				<b-col cols="12" sm>
					<h4 class="my-3">This interface implements 2 features</h4>
					<ol>
						<li>
							Selection and <strong>observance</strong> of previously saved committee assignment
						</li>
						<li>
							<strong>Publishing</strong> of the selected assignment to be viewed by the public
						</li>
					</ol>
				</b-col>
				<b-col cols="12" sm="auto">
					<b-btn variant="primary" :disabled="!submission || errorFlag">
						<strong>Yes, make it public</strong>
					</b-btn>
				</b-col>
			</b-row>
		</section>
		<section id="selector" class="mt-5">
			<b-row>
				<b-col cols="12" sm>
					<h5>
						Submitted By
					</h5>
					<b-form-select v-model="name" :options="names" @input="nameUpdate"/>
				</b-col>
				<b-col cols="12" sm>
					<h5>
						Submitted At
					</h5>
					<b-form-select :disabled="!item" v-model="id" :options="dates" @input="dateUpdate"/>
				</b-col>
				<b-col cols="auto" align-self="end" class="pl-0">
					<b-btn variant="link" v-b-modal.trash>
						<font-awesome-icon :icon="['far', 'trash-alt']" transform="grow-8"/>
					</b-btn>
				</b-col>
			</b-row>
			<b-modal
				centered
				no-fade
				id="trash"
				header-text-variant="light"
				header-bg-variant="dark"
				title="Are you sure?"
				@ok="trash"
				ok-title="Yes, I'm sure"
				ok-variant="primary">
				This is non-recoverable action, are you sure you'd like to delete submission made by <strong>{{name}}</strong> on <strong>{{date}}</strong>?
			</b-modal>
		</section>
		<section id="content-ok" v-if="submission" class="mt-5">
			<b-alert
				variant="light"
				:show="errorFlag"
				class="my-3 border border-danger text-dark">
				<h4 class="text-danger">Error</h4>
				<hr class="my-3">
				<p>
					The following committees have no assigned members:
				</p>
				<ol>
					<li v-for="s of submission.submission.filter(e => !e.people.length)" :key="s.committee.id">
						{{s.committee.title}}
					</li>
				</ol>
				<p>
					<strong>This submission cannot be published</strong>.
				</p>
			</b-alert>
			<result :items="submission.submission"/>
		</section>
		<section id="content-nok" v-else>
			<b-alert
			variant="light"
			show
			class="my-3 border border-warning text-dark">
			Make sure to select a submission
			</b-alert>
		</section>
	</div>
</template>

<script>
import axios from '~/plugins/axios';
import { mapState } from 'vuex';
import moment from 'moment';
import result from '~/components/result';
const dashes = {
	value: null,
	text: '--'
};
export default {
	components: {
		result
	},
	data: () => ({
		items: [],
		name: null,
		id: null,
		submission: null,
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
		errorFlag() {
			return this.submission.submission.reduce((a,i) => a || !i.people.length,false);
		},
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
		date() {
			return this.item ? moment(this.item.ids.find(e => e.id === this.id).createdAt).format('lll') : ''
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
				if(this.items.length) {
					let selected = this.items.find(e => e.name === this.name);
					if(!selected) {
						this.name = this.items[0].name;
					}
					this.nameUpdate();
				}
				else {
					this.name = null;
					this.id = null;
				}
			}
			catch(error) {
				console.error(error.message);
				this.$noty.error(error.message);
			}
		},
		nameUpdate() {
			let item = this.items.find(e => e.name === this.name);
			if(item && item.ids.length) {
				if(!item.ids.find(e => e.id === this.id)) {
					this.id = item.ids[0].id;
				}
			}
			else {
				this.id = null;
			}
		},
		async dateUpdate() {
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
		},
		async trash() {
			try {
				const { data } = await axios.delete('/api/assignment', { params: { id: this.id } });
				this.$noty.success('Submission successfully deleted');
				this.refresh();
			}
			catch(error) {
				console.error(error.message);
				this.$noty.error(error.message);
			}
		}
	}
}
</script>

