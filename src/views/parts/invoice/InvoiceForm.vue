<template>
	<div class="form-container">
		<div class="timesheet_form">
			<div class="flex-item w80">
				<bs-input ref="generateForDate" :required="true" v-model="form.generateForDate" type="date" label="Měsíc"/>
			</div>
			<div class="flex-item w160">
				<bs-auto-complete ref="companySelect" :required="true" v-model="form.company" :items="companyList" label="Společnost" :id="id+':companyAutocomplete'"
				                  :formatter="(x)=>x.companyName"/>
			</div>
			<div class="flex-item w160">
				<div style="padding-top: 4px;">
					<button class="bs-button lg" @click="generateSummary">
						<font-awesome-icon icon="eye"/>
						Generovat náhled
					</button>
				</div>
			</div>

			<div class="flex-item w120" v-if="summary">
				<bs-display-item label="Odpracovaný čas">{{ summary.workTime }} [Hod]</bs-display-item>
			</div>

			<div class="flex-item w200" v-if="summary">
				<bs-display-item label="K fakturaci (bez DPH)">{{ summary.earning }} Kč</bs-display-item>
			</div>

			<div class="flex-item" v-if="summary">
				<div style="padding-top: 4px;" class="text-align-right">
					<button class="bs-button lg" @click="generateInvoice">
						<font-awesome-icon icon="save"/>
						Vystavit fakturu
					</button>
				</div>
			</div>

			<div class="flex-item w160">
				<div style="padding-top: 4px;">
					<button class="bs-button lg" @click="addInvoice">
						<font-awesome-icon icon="plus"/>
						Nahrát fakturu
					</button>
				</div>
			</div>

		</div>
		<transition name="fade">
			<div class="error-container" v-if="errors.length>0">
				<div class="error-item">
					<font-awesome-icon icon="exclamation-triangle"/>
				</div>
				<div class="error-item" v-for="(error, index) in errors" v-bind:key="index">{{ error }}</div>
			</div>
		</transition>
	</div>
</template>

<script>
import moment from 'moment/moment'
import BsInput from '@/components/BsInput'
import BsAutoComplete from '@/components/BsAutoComplete'
import { TimesheetAPI } from '@/services/TimesheetAPI'
import { Toolbox } from '@/services/Toolbox'
import BsDisplayItem from '@/components/BsDisplayItem'

export default {
	name: 'InvoiceForm',
	components: {
		BsDisplayItem,
		BsAutoComplete,
		BsInput
	},
	props: {
		id: {
			type: String,
			required: true
		}
	},
	data() {
		return {
			form: {
				generateForDate: moment().format('YYYY-MM'),
				company: null
			},
			errors: [],
			summary: null
		}
	},
	created() {
		this.$store.dispatch('fetchCompanies').then(() => {
			this.form.company = this.$store.getters.getPrefferedCompany
		})
	},
	mounted() {
	},
	computed: {
		companyList() {
			return this.$store.state.companies
		}
	},
	methods: {
		addInvoice() {
			this.$router.push({
				name: 'uploadInvoice',
				params: {}
			})
		},
		generateInvoice() {
			this.basicValidate()
			if (this.errors.length === 0) {
				if (this.summary !== null) {
					const from = moment(this.form.generateForDate + '-01', 'YYYY-MM-DD')
					TimesheetAPI.invoice
					            .generateInvoice(
							            from.format('YYYY-MM-DD'),
							            from.endOf('month').format('YYYY-MM-DD'),
							            this.form.company.id).then(data => {
						            if (data.success === true) {
							            this.$router.push({
								            name: 'Invoice',
								            params: { id: data.data.id }
							            })
						            } else {
							            this.errors.push('Can not generate invoice: ' + data.message)
						            }
					            })
					            .catch(e => {
						            this.errors.push('Can not generate invoice. ' + e.message())
						            console.error(e)
					            })
				}
			}
		},
		generateSummary() {
			this.basicValidate()
			if (this.errors.length === 0) {
				this.summary = null
				const from = moment(this.form.generateForDate + '-01', 'YYYY-MM-DD')
				TimesheetAPI.invoice
				            .summaryPreview(
						            from.format('YYYY-MM-DD'),
						            from.endOf('month').format('YYYY-MM-DD'),
						            this.form.company.id)
				            .then(data => {
					            this.summary = {
						            workTime: Toolbox.formatTime(data.workTime),
						            earning: Toolbox.formatPrice(data.earning)
					            }
				            })
			}
		},
		basicValidate() {
			this.errors = []
			for (const key in this.$refs) {
				if (typeof this.$refs[key].isValid === 'function') {
					const valid = this.$refs[key].isValid()
					if (!valid) {
						this.errors.push(key + ': ' + this.$refs[key].getErrors() + '. ')
					}
				}
			}
			if (this.errors.length === 0) {
				this.processBusinessErrors()
			}
		},
		async processBusinessErrors() {
			const input = moment(this.form.generateForDate + '-01', 'YYYY-MM-DD')
			const verInput = input.format('yyyy-MM')
			if (this.form.generateForDate !== verInput) {
				this.errors.push('Invlaid generate date!')
			}
		}
	}
}
</script>

<style scoped lang="scss">
@import "../../../styles/custom-colors";
@import "../../../components/components";

@mixin flexStep($value) {
	flex-grow: $value;
	//min-width: 5px * $value;
}

@mixin forceWidth($value) {
	min-width: $value;
	width: $value;
}

.form-container {

	.fade-enter-active, .fade-leave-active {
		transition: opacity .5s;
	}

	.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
	{
		opacity: 0;
	}

	@include container-shadow;
	border: 1px solid $container-border-color;
	padding: 0.5em;
	margin-bottom: 1em;

	.error-container {
		font-size: 0.9 * $font-size;
		padding: 0.5rem 0.5rem 0 0.5rem;
		color: $bs-error-light;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: right;

		.error-item {
			padding-right: 0.4rem;
		}
	}

	.timesheet_form {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;

		.flex-item {
			&.note {
				min-width: 40rem;
			}

			padding: 0 0.5em;
			@include flexStep(1);

			&.w40 {
				@include forceWidth(40px)
			}

			&.w80 {
				@include forceWidth(80px)
			}

			&.w120 {
				@include forceWidth(120px)
			}

			&.gr-2 {
				@include flexStep(2);
			}

			&.gr-4 {
				@include flexStep(4);
			}

			&.gr-8 {
				@include flexStep(8);
			}

			&.gr-12 {
				@include flexStep(12);
			}
		}
	}
}
</style>
