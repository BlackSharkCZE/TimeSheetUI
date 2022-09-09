<template>
	<div class="form-container">
		<div class="timesheet_form">
			<div class="flex-item">
				<div class="display-item">
					Měsíc: <strong>{{ month }}</strong>
					<font-awesome-icon
							@click="$refs.selectMonthDialog.display()"
							style="margin-left: 0.4em;"
							class="fa-click"
							icon="edit"/>
				</div>
			</div>
			<div class="flex-item">
				Odpracováno: <strong>{{ workTime }}</strong>
			</div>
			<div class="flex-item">
				Výdělek: <strong>{{ earning }}</strong>
			</div>
			<div class="flex-item">
				Odpracováno dnes: <strong>{{ dailyWorkTime }}</strong>
			</div>
			<div class="flex-item grow text-align-right">
				<div>
					<bs-drop-down
							@change="panelForCompany"
							emptyText="--vyberte--"
							v-model="company"
							:items="allCompanies"
							:display-func="i=>i.companyName"></bs-drop-down>
				</div>
			</div>
		</div>
		<bs-modal-dialog ref="selectMonthDialog" label="Změna zobrazeného měsíce">
			<template slot="content">
				<slot name="dialog-content">
					Zadejte nový měsíc ve formátu RRRR-MM
					<bs-input :focus-on-update="true" v-model="newMonth" label="Nový měsíc" :button-callback="monthSelectConfirm">
						<font-awesome-icon icon="check"/>
					</bs-input>
				</slot>
			</template>
			<template slot="footer">
				<input type="button" class="bs-button success" @click="$refs.selectMonthDialog.hide()" value="Zrušit"/>
			</template>
		</bs-modal-dialog>
	</div>
</template>

<script>
import moment from 'moment/moment'
import BsDropDown from '@/components/BsDropDown'
import BsModalDialog from '@/components/BsModalDialog'
import BsInput from '@/components/BsInput'

export default {
	name: 'ReportPanel',
	components: {
		BsInput,
		BsDropDown,
		BsModalDialog
	},
	data() {
		return {
			company: null,
			newMonth: this.month
		}
	},
	created() {
		this.udpatePanel(null)
		this.newMonth = this.month
		this.$store.dispatch('loadDailyWorkTime')
		this.$store.dispatch('fetchCompanies').then(() => {
			this.company = this.$store.getters.getPrefferedCompany
			this.udpatePanel(this.company.id)
		})
	},
	computed: {
		allCompanies() {
			const x = [{
				id: null,
				companyName: 'Vše'
			}]
			if (this.$store.getters.getAllCompanies !== null && this.$store.getters.getAllCompanies.length > 0) {
				x.push(...this.$store.getters.getAllCompanies)
			}
			return x
		},
		earning() {
			return this.$store.state.earning
		},
		workTime() {
			return this.$store.state.workTime
		},
		month() {
			return this.$store.state.month
		},
		dailyWorkTime() {
			return this.$store.state.dailyWorkTime
		}
	},
	methods: {
		monthSelectConfirm() {
			this.udpatePanel(null, moment(this.newMonth + '-01'))
			this.$refs.selectMonthDialog.hide()
		},
		udpatePanel(companyID, forceDate) {
			let momentDate = moment()
			if (forceDate !== undefined && forceDate !== null) {
				momentDate = forceDate
			}
			const _fromDate = momentDate.startOf('month').format('YYYY-MM-DD')
			const _toDate = momentDate.endOf('month').format('YYYY-MM-DD')
			this.$store.dispatch('loadReport', {
				fromDate: _fromDate,
				toDate: _toDate,
				company: companyID
			})
			this.$store.dispatch('loadDailyWorkTime', { companyID: companyID })
		},
		panelForCompany(item) {
			this.udpatePanel(item.id)
		}
	}
}
</script>

<style scoped lang="scss">

@import "../../styles/custom-colors";
@import "../../components/components";

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

	.timesheet_form {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;

		.flex-item {
			padding: 0 0.5em;
			border-right: 1px solid $container-border-color;

			&.grow {
				flex-grow: 1;
			}
		}
	}
}

</style>
