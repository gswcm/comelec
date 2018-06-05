<template>
	<div class="mt-5">
		<h4>Please provide your preference for next year committee service</h4>
		<div v-for="index in 3" :key="`tl_${index}`" class="my-3">
			<b-row align-v="center">
				<b-col cols="12" sm="auto">
					<label><strong>Preference {{index}}</strong></label>
				</b-col>
				<b-col col>
					<b-select v-model="service[index-1]">
						<option :value="null">--</option>
						<option v-for="option in options" v-show="option.show" :value="option._id" :key="option._id">{{option.title}}</option>
					</b-select>
				</b-col>
				<b-col cols="auto" class="pl-0">
					<b-btn variant="link" v-b-modal.info size="lg" :disabled="!service[index-1]" @click="renderInfo(service[index-1])">
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

		<!-- <div class="my-3 p-3 border border-right-0 border-top-0 border-bottom-0 border-warning text-warning">
			<Strong>Note:</Strong> feel free to make multiple submissions, we will use the most recent one.
		</div> -->

		<b-alert variant="light" show class="my-4 rounded">
		<b-row class="">
			<b-col cols="auto">
				<strong>Notes:</strong>
			</b-col>
			<b-col cols class="pl-0">
				<ol>
					<li>
						You can make <i>multiple submissions</i>, we will use the most recent one
					</li>
					<li>
						Your submission <i>must be confirmed</i> by following a link from an automated e-mail
					</li>
				</ol>
			</b-col>
		</b-row>
		</b-alert>


		<div id="recaptcha" class="d-flex justify-content-end">
			<g-recaptcha
				:data-sitekey="reCAPTCHA_KEY"
				:data-validate="() => !incomplete"
				data-btn-class="btn btn-primary px-4"
				:data-btn-disabled="incomplete"
				:data-callback="submit">
				<strong>Submit</strong>
			</g-recaptcha>
		</div>
	</div>
</template>

<script>
	import axios from 'axios';
	import { mapState } from "vuex";
	import moment from 'moment';
	import gRecaptcha from '@finpo/vue2-recaptcha-invisible';
	export default {
		components: {
			gRecaptcha
		},
		props: ['storedService'],
		data: function() {
			return {
				modalTitle: null,
				modalText: null,
				//-- Array of _id of committee entries
				service: this.storedService ? [...this.storedService] : [null, null, null]
			};
		},
		watch: {
			storedService() {
				this.service = this.storedService ? [...this.storedService] : [null, null, null]
			}
		},
		computed: {
			options() {
				return this.committees.map(e => {
					e.show = !this.service.reduce((a, i) => a || (i ? i === e._id : false), false)
					return e;
				});
			},
			incomplete() {
				//-- There must be set all 3 service preference, otherwise incomplete
				return !this.service.reduce((a,i) => a && !!i, true)
			},
			...mapState({
				user: "user",
				committees: "committees",
				reCAPTCHA_KEY: "reCAPTCHA_KEY"
			}),
		},
		methods: {
			preferenceUpdate(index, value) {
				this.service[index] = value;
				console.log(this.service);
			},
			renderInfo(service_id) {
				const option = this.options.find(e => e._id === service_id)
				this.modalTitle = option.title;
				this.modalText = option.desc;
			},
			async submit(response) {
				try {
					await this.$store.dispatch('SET_SERVICE', {
						response,
						user: this.user,
						service: this.service.map(service_id => {
							const option = this.options.find(e => e._id === service_id)
							return {
								id: option._id,
								title: option.title
							};
						}),
					});
					this.$noty.success(`Your preference submission has been received`);
				}
				catch(error) {
					console.error(error.message);
				}
			}
		}
	}
</script>

<style>
	#recaptcha button {
		border-radius: 5px;
	}
</style>

