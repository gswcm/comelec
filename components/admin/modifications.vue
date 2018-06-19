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
							<b-btn variant="info" v-b-modal.addMore class="d-block px-3 ml-auto rounded" @click="renderModal(a.committee)">
								Add more...
							</b-btn>
						</div>
					</div>
				</b-tab>
			</b-tabs>
			<b-modal
				centered size="lg"
				no-fade
				header-bg-variant="dark"
				header-text-variant="light"
				ok-title="Submit"
				ok-variant="info"
				@ok="processModal"
				no-close-on-esc
				id="addMore">
				<div slot="modal-title">
					<h5 class="modal-title" v-html="modalTitle"></h5>
				</div>
				<div class="p-3">
					<section class="mt-3 mb-4">
						<h4>Instructions</h4>
						<ol class="mt-3">
							<li>
								Start typing the <strong>official name</strong> (a.k.a. HR record) of GSW employee <strong>OR</strong> name of the <strong>School / Department</strong> select from the list of options.
								<b-alert show variant="light" class="mt-2 p-3">
									<strong>Hint</strong>: If you are not sure about spelling, type all variants separated by a space, e.g. <i>brian bryan</i>
								</b-alert>
							</li>
							<li>
								Check <strong>ex-officio</strong> mark (if needed), and click on <font-awesome-icon :icon="['fas', 'plus']" transform="down-2"/> to add to the list of proposed additions.
							</li>
							<li>
								Submit modifications by clicking "<strong>Add</strong>" button or simply close the form to discard changes.
							</li>
						</ol>
					</section>
					<hr class="my-4">
					<b-row align-v="center">
						<b-col cols="">
							<no-ssr>
								<v-autocomplete
									:items="people"
									:v-model="person"
									:get-label="getLabel"
									:component-item="template"
									:auto-select-one-item="false"
									@change="debouncer"
									@item-selected="itemSelected"
									:min-len="3"
									:input-attrs="{
										placeholder: 'Start entering the name...'
									}"/>
							</no-ssr>
						</b-col>
						<b-col cols="auto">
							<b-btn variant="outline-info" class="rounded" @click="addToList" :disabled="!person">
								<font-awesome-icon :icon="['fas', 'plus']"/>
								Add
							</b-btn>
						</b-col>
					</b-row>
					<section class="result mt-3" v-if="modalData && modalData.people && modalData.people.length">
						<h4 class="mt-4 mb-3">
							Proposed additions:
						</h4>
						<b-table
							bordered
							responsive
							head-variant=""
							:items="modalData.people"
							:fields="modalTableFields">
							<template slot="idx" slot-scope="row">
								{{row.index + 1}}
							</template>
							<template slot="x" slot-scope="row">
								<b-form-checkbox :id="`ex-officio-flag-${row.index}`" v-model="row.item.x"/>
							</template>
							<template slot="action" slot-scope="row">
								<b-btn variant="link" class="p-0">
									<font-awesome-icon :icon="['far', 'trash-alt']"/>
								</b-btn>
							</template>
						</b-table>
					</section>
				</div>
			</b-modal>
		</b-card>
	</div>
</template>

<script>
import { mapState } from 'vuex';
import { debounce } from 'lodash';
import axios from '~/plugins/axios';
import itemTemplate from './itemTemplate';
export default {
	data: function() {
		return {
			modalTableFields: [
				{
					key: 'idx',
					label: '#'
				},
				{
					key: 'name',
				},
				{
					key: 'x',
					label: 'Ex-officio'
				},
				{
					key: 'action',
					label: 'Action'
				}
			],
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
					committee: {...e.committee},
					people
				}
			});
		}
	},
	methods: {
		addToList() {
			let person = this.modalData.people.find(e => e.id === this.person._id);
			if(!person) {
				this.modalData.people.push({
					name: `${this.person.firstName} ${this.person.lastName}`,
					email: this.person.email,
					id: this.person._id,
					x: false
				});
			}
		},
		itemSelected(item) {
			this.person = {...item};
		},
		getLabel(item) {
			return item ? `${item.firstName} ${item.lastName}` : '';
		},
		debouncer: debounce(function(e) {
			this.UpdateItems(e);
		}, 500),
		async UpdateItems (text) {
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
			this.modalData = JSON.parse(JSON.stringify(this.added.find(e => e.committee.id === committee.id)));
		},
		processModal() {
			if(this.modalData && this.modalData.committee && this.modalData.people && this.modalData.people.length) {
				this.added.find(e => e.committee.id === this.modalData.committee.id).people = [...this.modalData.people];
			}
			this.modalData = null;
		},
	}
};
</script>

<style lang="scss">
	hr {
		border: 1px solid #888;
	}
	ol {
		li {
			margin-bottom: 0.5rem;
		}
	}
	.modal-footer {
		button {
			border-radius: 5px !important;
		}
	}
	.rounded {
		border-radius: 5px !important;
		a {
			border-radius: 5px !important;
		}
	}
	.v-autocomplete {
		.v-autocomplete-input-group {
			.v-autocomplete-input {
				// font-size: 1.5em;
				padding: 6px 15px;
				box-shadow: none;
				border: 1px solid #157977;
				border-radius: 5px;
				width: 100%;
				outline: none;
			}
		}
		.v-autocomplete-input-group.v-autocomplete-selected {
			.v-autocomplete-input {
				color: #008000;
				background-color: #f2fff2;
			}
		}
		.v-autocomplete-list {
			width: 100%;
			text-align: left;
			border: none;
			border-top: none;
			overflow-y: auto;
			border-bottom: 1px solid #157977;
			.v-autocomplete-list-item {
				cursor: pointer;
				background-color: #fff;
				padding: 10px;
				border-bottom: 1px solid #157977;
				border-left: 1px solid #157977;
				border-right: 1px solid #157977;
				&:last-child {
					border-bottom: none;
				}
				&:hover {
					background-color: #eee;
				}
			}
		}
	}

</style>
