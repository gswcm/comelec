<template>
	<div>
		<section id="header">
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
		<section id="main">
			<b-card no-body class="mt-5">
				<b-tabs pills card vertical>
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
								<b-btn variant="info" v-b-modal.addMore class="d-block px-3 ml-auto" @click="renderModal(a.committee)">
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
						<h5 v-html="modal.Title"/>
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
									<b-btn variant="info" class="p-2" @click="addToList" :disabled="!person">
										<font-awesome-icon :icon="['fas', 'plus']"/>
										Add
									</b-btn>
								</b-col>
							</b-row>
						</section>
						<section id="result">
							<div v-if="modal.Data && modal.Data.people && modal.Data.people.length">
								<h4>
									Records to be added
								</h4>
								<b-table
									bordered
									responsive
									head-variant=""
									:items="modal.Data.people"
									:fields="modal.Fields">
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
			modal: {
				Fields: [
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
				Title: '',
				Data: null,
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
			template: itemTemplate
		};
	},
	computed: {
		...mapState({
			assignments: "assignments",
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
			let person = this.modal.Data.people.find(e => e.id === this.person._id);
			if(!person) {
				this.modal.Data.people.push({
					name: `${this.person.firstName} ${this.person.lastName}`,
					email: this.person.email,
					id: this.person._id,
					x: false
				});
			}
		},
		trash(index) {
			this.modal.Data.people.splice(index,1);
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
			this.modal.Title = `Add more members to the <strong>${committee.title}</strong> committee`;
			let added = this.added.find(e => e.committee.id === committee.id);
			if(!added || !added.people) {
				this.added.push({
					committee,
					people: []
				})
			}
			this.modal.Data = JSON.parse(JSON.stringify(this.added.find(e => e.committee.id === committee.id)));
		},
		processModal() {
			if(this.modal.Data && this.modal.Data.committee && this.modal.Data.people && Array.isArray(this.modal.Data.people)) {
				this.added.find(e => e.committee.id === this.modal.Data.committee.id).people = [...this.modal.Data.people];
			}
			this.modal.Data = null;
		},
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
