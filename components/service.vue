<template>
	<div class="mt-5">
		<h4>Please provide your preference for next year committee service</h4>
		<div v-for="index in 3" :key="`tl_${index}`" class="my-3">
			<b-row align-v="center">
				<b-col cols="12" sm="auto">
					<label><strong>Preference {{index}}</strong></label>
				</b-col>
				<b-col col>
					<!-- <b-select :value="preference[index-1] || null" @change="prefChanged(index-1, $event)"> -->
					<b-select v-model="preference[index-1]">
						<option :value="null">--</option>
						<option v-for="(committee,index) in options" v-show="committee.show" :value="committee" :key="`option_${index}`">{{committee.title}}</option>
					</b-select>
				</b-col>
				<b-col cols="auto" class="pl-0">
					<b-btn variant="link" v-b-modal.info size="lg" :disabled="!preference[index-1]" @click="renderInfo(index-1)">
						<font-awesome-icon :icon="['fas', 'info-circle']"/>
					</b-btn>
				</b-col>
			</b-row>
		</div>
		<b-modal centered no-fade header-bg-variant="dark" header-text-variant="light" ok-only ok-variant="outline-dark" id="info" :title="modalTitle">
			<p class="text-justify p-3">
				{{modalText}}
			</p>
		</b-modal>
	</div>
</template>

<script>
	import axios from 'axios';
	import { mapState } from "vuex";
	import moment from 'moment';
	export default {
		props: {
			committees: {
				validator: function (value) {
					return Array.isArray(value);
				}
			}
		},
		data: function() {
			return {
				preference: [null, null, null],
				modalTitle: null,
				modalText: null,
			};
		},
		computed: {
			options() {
				return this.committees.map(e => {
					e.show = !this.preference.reduce((a, i) => a || (i ? i.title === e.title : false), false)
					return e;
				});
			}
		},
		methods: {
			renderInfo(index) {
				this.modalTitle = this.preference[index].title;
				this.modalText = this.preference[index].desc;
			}
		}
	}
</script>
