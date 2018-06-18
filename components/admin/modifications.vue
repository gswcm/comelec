<template>
	<div>
		<section>
			<h4 class="my-3">This interface implements 2 features</h4>
			<ol>
				<li>
					<strong>Visualize</strong> modified lists of proposed committee members
				</li>
				<li>
					Add additional members including <strong>ex-officio</strong> ones
				</li>
			</ol>
		</section>
		<b-card no-body class="mt-5">
			<b-tabs pills card vertical>
				<b-tab
					v-for="(a,i) of all"
					:title="a.committee.title"
					:key="a.committee.id"
					title-item-class="rounded"
					:active="!i"
					class="h-100">
					<div class="d-flex flex-column justify-content-between h-100">
						<div>
							<div v-if="a.people.length">
								<h4>Proposed members</h4>
								<b-table responsive striped :items="a.people" :fields="fields">
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
							<b-alert v-else variant="light" show>
								This committee doesn't have any proposed members
							</b-alert>
						</div>
						<div>
							<b-btn variant="info" v-b-modal.addMore class="d-block px-3 ml-auto" @click="renderModal(a.committee)">
								Add more...
							</b-btn>
						</div>
					</div>
				</b-tab>
			</b-tabs>
			<b-modal centered size="lg" no-fade header-bg-variant="dark" header-text-variant="light" ok-title="Add" ok-variant="outline-dark" id="addMore">
				<div slot="modal-title">
					<h5 class="modal-title" v-html="modalTitle"></h5>
				</div>
				<section class="mt-3 mb-4">
					<h4>Instructions</h4>
					<ol>
						<li>
							Start typing the <strong>official name</strong> (a.k.a. HR record) of GSW employee and select from the list of options.
						</li>
						<li>
							Check <strong>ex-officio</strong> mark (if needed), and click on <font-awesome-icon :icon="['fas', 'plus']" transform="down-2"/> to add to the list of proposed additions.
						</li>
						<li>
							Submit modifications by clicking "Add" button or simply close the form to discard changes.
						</li>
					</ol>
				</section>
				<b-row align-v="center">
					<b-col cols="">
						<no-ssr>
							<v-autocomplete
							:items="people"
							v-model="person"
							:get-label="item => item ? `${item.firstName} ${item.lastName}` : ''"
							:component-item="template"
							@update-items="acUpdateItems"
							:input-attrs="{
								class: 'form-control'
							}"
							>
							</v-autocomplete>
						</no-ssr>
					</b-col>
					<b-col cols="auto">
						<b-form-checkbox id="ex-officio-flag" v-model="x">
							Ex-officio
						</b-form-checkbox>
					</b-col>
					<b-col cols="auto">
						<b-btn variant="outline-info">
							<font-awesome-icon :icon="['fas', 'plus']"/>
						</b-btn>
					</b-col>
				</b-row>
				<section class="result mt-3">
					<pre>{{JSON.stringify(modalData,null,3)}}</pre>
				</section>
			</b-modal>
		</b-card>
	</div>
</template>

<script>
import { mapState } from "vuex";
import axios from '~/plugins/axios';
import itemTemplate from './itemTemplate';
export default {
	data: function() {
		return {
			fields: [
				{
					key: 'idx',
					label: '#'
				},
				{
					key: 'name',
				},
				{
					key: 'email',
					label: 'E-Mail'
				},
				{
					key: 'x',
					label: 'Ex-officio'
				}
			],
			added: [],
			modalTitle: '',
			modalData: null,
			person: null,
			people: [],
			x: false,
			template: itemTemplate
		};
	},
	computed: {
		...mapState({
			assignments: "assignments",
		}),
		all() {
			return this.assignments.map(e => {
				let people = e.people.map(ee => ({...ee, x: false}));
				let added = this.added.find(ee => ee.committee.id === e.committee.id);
				if(added && added.people.length) {
					people.push(...added.people);
				}
				return {
					committee: e.committee,
					people
				}
			});
		}
	},
	methods: {
		async acUpdateItems (text) {
			try {
				const { data } = await axios.get(`/api/directory/find?query=${text || '.'}`);
				this.people = data;
			}
			catch(error) {
				if(error.response && error.response.data) {
					console.error(error.response.data.message);
				}
				else {
					console.error(error.message);
				}
			}
		},
		renderModal(committee) {
			this.modalTitle = `Add more members to the <strong>${committee.title}</strong> committee`;
			let added = this.added.find(e => e.committee.id === committee.id);
			if(!added || !added.people) {
				this.added.push({
					committee,
					people: []
				})
			}
			this.modalData = this.added.find(e => e.committee.id === committee.id);
		}
	}
};
</script>

<style>
	.rounded a {
		border-radius: 10px !important;
	}
	.btn-add-more {

	}
</style>
