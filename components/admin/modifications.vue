<template>
	<div>
		<section id="header">
			<h4 class="my-3">This interface implements 3 features</h4>
			<ol>
				<li>
					<strong>Visualize</strong> modified lists of proposed committee members
				</li>
				<li>
					Add additional members to particular committees including <strong>ex-officio(s)</strong>
				</li>
				<li>
					<strong>Save</strong> modifications for later <strong>publishing</strong>
				</li>
			</ol>
		</section>
		<section id="main">
			<b-card no-body class="mt-5">
				<b-tabs pills card vertical nav-class="">
					<b-tab
						v-for="(a,i) of all"
						:title="a.committee.title"
						:key="a.committee.id"
						title-item-class=""
						:active="!i"
						class="h-100">
						<div class="h-100 d-flex flex-column">
							<div class="h-100">
								<div v-if="a.people.length">
									<h4>Proposed members</h4>
									<b-table responsive :items="a.people" :fields="fields">
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
								<b-btn variant="primary" v-b-modal.addMore class="d-block px-3 ml-auto" @click="renderModal(a.committee)">
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
					ok-variant="primary"
					@ok="processModal"
					no-close-on-esc
					id="addMore">
					<div slot="modal-title">
						<h5 v-html="modal.title"/>
					</div>
					<div class="p-3 modal-sections">
						<section id="instructions">
							<h4>Instructions</h4>
							<ol>
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
						<section id="search">
							<h4>
								Search...
							</h4>
							<b-row align-v="center">
								<b-col cols="">
									<no-ssr>
										<v-autocomplete
											:items="people"
											:get-label="getLabel"
											:component-item="template"
											:auto-select-one-item="false"
											@change="debouncer"
											@item-selected="itemSelected"
											:input-attrs="{
												placeholder: 'Start entering person\'s name or department...'
											}"/>
									</no-ssr>
								</b-col>
								<b-col cols="auto pl-0">
									<b-btn variant="primary" class="" @click="addToList" :disabled="!person">
										<font-awesome-icon :icon="['fas', 'plus']"/>
										<span class="ml-3">Add</span>
									</b-btn>
								</b-col>
							</b-row>
						</section>
						<section id="result">
							<div v-if="modal.data && modal.data.people && modal.data.people.length">
								<h4>
									Records to be added
								</h4>
								<b-table
									bordered
									responsive
									head-variant=""
									:items="modal.data.people"
									:fields="modal.fields">
									<template slot="idx" slot-scope="row">
										{{row.index + 1}}
									</template>
									<template slot="x" slot-scope="row">
										<b-form-checkbox :id="`ex-officio-flag-${row.index}`" v-model="row.item.x"/>
									</template>
									<template slot="action" slot-scope="row">
										<b-btn variant="link" class="p-0" @click="trash(row.index)">
											<font-awesome-icon :icon="['far', 'trash-alt']"/>
										</b-btn>
									</template>
								</b-table>
							</div>
							<h4 v-else >No records added yet...</h4>
						</section>
					</div>
				</b-modal>
			</b-card>
		</section>
		<section id="footer">
			<div class="mt-3">
				<b-btn variant="primary" size="lg" class="d-block mx-auto my-5 px-3" @click="savePreHandler">
					<font-awesome-icon :icon="['far', 'save']"/>
					<span class="ml-3">Save</span>
				</b-btn>
			</div>
			<b-modal
				centered
				no-fade
				header-bg-variant="dark"
				header-text-variant="light"
				title="Warning"
				@ok="saveHandler"
				ok-title="Save"
				ok-variant="primary"
				ref="saveConfirm">
				Some committees are not assigned with members. Would you like to save anyway?
			</b-modal>
		</section>
	</div>
</template>

<script>
import { mapState } from 'vuex';
import { debounce, pick } from 'lodash';
import axios from '~/plugins/axios';
import itemTemplate from './itemTemplate';
export default {
	data: function() {
		return {
			modal: {
				fields: [
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
				title: '',
				data: null,
			},
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
			person: null,
			people: [],
			template: itemTemplate,
		};
	},
	computed: {
		...mapState({
			assignments: "assignments",
			authenticated: "authenticated"
		}),
		all() {
			return this.assignments.map(e => {
				let people = e.people.map(ee => ({...ee, x: false, _rowVariant: 'light'}));
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
			let person = this.modal.data.people.find(e => e.id === this.person._id);
			if(!person) {
				this.modal.data.people.push({
					name: `${this.person.firstName} ${this.person.lastName}`,
					email: this.person.email,
					id: this.person._id,
					x: false
				});
			}
		},
		trash(index) {
			this.modal.data.people.splice(index,1);
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
				if(!data.length) {
					this.person = null;
				}
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
			this.modal.title = `Add more members to the <strong>${committee.title}</strong> committee`;
			let added = this.added.find(e => e.committee.id === committee.id);
			if(!added || !added.people) {
				this.added.push({
					committee,
					people: []
				})
			}
			this.modal.data = JSON.parse(JSON.stringify(this.added.find(e => e.committee.id === committee.id)));
		},
		processModal() {
			if(this.modal.data && this.modal.data.committee && this.modal.data.people && Array.isArray(this.modal.data.people)) {
				this.added.find(e => e.committee.id === this.modal.data.committee.id).people = [...this.modal.data.people];
			}
			this.modal.data = null;
		},
		savePreHandler() {
			let warning = this.all.reduce((a,i) => a || !i.people.length, false);
			if(warning) {
				this.$refs.saveConfirm.show();
			}
			else {
				this.saveHandler();
			}
		},
		async saveHandler() {
			try {
				const person = this.authenticated ? (await axios.get(`/api/directory/findById?id=${this.authenticated}`)).data : null;
				const { data } = await axios.post('/api/assignment', {
					assignments: this.all.map(({ committee, people }) => ({
						committee,
						people: people.map(e => pick(e,['email','id','name','x']))
					})),
					contributor: person ? `${person.firstName} ${person.lastName}` : 'N/A'
				});
				this.$store.commit('SET_ASSIGNMENT_HASH', data);
				this.$noty.success(`Submission has been successfully saved and can now be published`);
			}
			catch(error) {
				let message = error.message;
				if(error.response && error.response.data) {
					message = error.response.data.message;
				}
				this.$store.commit('SET_ASSIGNMENT_HASH', null);
				this.$noty.error(`Failure: ${message}, try reloading this page`);
			}
		}
	}
};
</script>

<style lang="scss">
	.modal-sections {
		section {
			margin-bottom: 1.5rem;
		}
	}
	hr {
		border: 1px solid #888;
	}
	ol {
		li {
			margin-bottom: 0.5rem;
		}
	}
	.v-autocomplete {
		.v-autocomplete-input-group {
			.v-autocomplete-input {
				// font-size: 1.5em;
				padding: 8px 15px;
				box-shadow: none;
				border: 1px solid #157977;
				width: 100%;
				outline: none;
				background-color: #fff;
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
			z-index: 10;
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
