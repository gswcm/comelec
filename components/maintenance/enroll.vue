<template>
	<b-card id="mtn-enroll" title="Faculty Senate Members" sub-title="Add / remove site administrators">
		<p class="card-text">
			Any GSW employee can be assigned with a role of <strong>ComElec site administrator</strong>, but this role is primarily intended for the members of the GSW Faculty Senate.
		</p>
		<section v-show="admins.length">
			<h6>
				<strong>List of current site administrators is shown below</strong>
			</h6>
			<b-table
				bordered
				responsive
				head-variant=""
				:items="admins"
				:fields="fields">
				<template slot="idx" slot-scope="row">
					{{row.index + 1}}
				</template>
				<template slot="email" slot-scope="row">
					<a :href="`mailto:${row.value}`" target="_blank">{{row.value}}</a>
				</template>
				<template slot="action" slot-scope="row">
					<b-btn variant="link" class="p-0" @click="trash(row.index)">
						<font-awesome-icon :icon="['far', 'trash-alt']"/>
					</b-btn>
				</template>
			</b-table>
		</section>
		<section id="addMore" class="mt-3 mb-5">
			<h6>
				<strong>Add more...</strong>
			</h6>
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
					<b-btn variant="link" class="" @click="add" :disabled="!person">
						<font-awesome-icon :icon="['fas', 'plus']" size="lg"/>
					</b-btn>
				</b-col>
			</b-row>
		</section>
		<div class="d-flex justify-content-end">
			<b-btn variant="secondary" @click="refresh">
				Reset
			</b-btn>
			<b-btn variant="outline-danger" @click="submit" :disabled="loading || !admins.length" class="ml-3">
				<font-awesome-icon v-show="loading" :icon="['fas', 'spinner']" spin/>
				<strong :class="{'ml-2': loading}">Submit</strong>
			</b-btn>
		</div>
	</b-card>
</template>

<script>
import axios from '~/plugins/axios';
import debounce from 'lodash/debounce';
import itemTemplate from '~/components/itemTemplate';
export default {
	mounted() {
		this.refresh();
	},
	data: () => ({
		loading: false,
		admins: [],
		fields: [
			{ key: 'idx', label: '#', thClass: 'idxColumn' },
			{ key: 'name', label: 'Name', thClass: 'nameColumn' },
			{ key: 'dept',	label: 'Department', thClass: 'deptColumn'},
			{ key: 'email', label: 'E-Mail', thClass: 'emailColumn' },
			'action'
		],
		person: null,
		people: [],
		template: itemTemplate,
	}),
	methods: {
		trash(index) {
			this.admins.splice(index,1);
		},
		add() {
			let person = this.admins.find(e => e.email === this.person.email);
			if(!person) {
				this.admins.push({
					name: `${this.person.firstName} ${this.person.lastName}`,
					email: this.person.email,
					dept: this.person.dept
				});
			}
		},
		async refresh() {
			const { data } = await axios.get('/api/directory/all?adminOnly')
			this.admins = data.map(e => ({
				name: `${e.firstName} ${e.lastName}`,
				dept: e.dept,
				email: e.email
			}))
		},
		getLabel(item) {
			return item ? `${item.firstName} ${item.lastName}` : '';
		},
		itemSelected(item) {
			this.person = {...item};
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
		async submit() {
			const { data } = await axios.patch('/api/directory/admins', {
				admins: this.admins
			});
			await this.refresh();
			this.$noty.success(`List of admins has been updated`);
		}
	}
}
</script>

<style lang="scss">
	#mtn-enroll {
		.deptColumn {
			width: 30%;
		}
		.nameColumn {
			width: 25%;
		}
		.emailColumn {
			width: 25%;
		}
	}
	#addMore {
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
	}
</style>




