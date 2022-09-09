<template>

	<div style="overflow-y: scroll; max-height: 100vh;">
		<h2>{{ selectedMonth | asMonth }}
			<font-awesome-icon icon="download" class="fa-click" v-on:click="downloadInvoiceBulk()"/>
		</h2>

		<ul class="bs-tabs">
			<li :class="['fa-click', {current: index===monthIndex}]" v-for="(item, index) in months" v-bind:key="index" @click="selectMonth(index)">{{ item }}</li>
		</ul>

		<div>
			<h3>Vydané faktury</h3>
			<invoice-table :initial-filter="initialFilter" ref="invoiceTableIssued"></invoice-table>
		</div>

		<div>
			<h3>Přijaté faktury</h3>
			<invoice-table :initial-filter="initialFilterIn" ref="invoiceTableReceived"></invoice-table>
		</div>
	</div>

</template>

<script>

import { Toolbox } from '@/services/Toolbox'
import { TimesheetAPI } from '@/services/TimesheetAPI'
import InvoiceTable from '@/views/parts/invoice/InvoiceTable'
import moment from 'moment'

export default {
	name: 'DphOverview',
	components: { InvoiceTable },
	data() {
		return {
			selectedMonth: moment().startOf('month').set('year', parseInt(this.$route.params.year)).add(-1, 'month'),
			monthIndex: 0,
			mainCompanyId: 1 // todo shoud by primary company of the current acocunt
		}
	},
	mounted() {
		const table = this.getTable()
		table.getFieldsConfig().filter(it => it.key === 'issuerCompany')[0].filter.display = false
		table.getFieldsConfig().filter(it => it.key === 'vatPaymentDate')[0].filter.display = false
		this.monthIndex = this.selectedMonth.get('month') - 1
	},
	updated() {
	},
	computed: {
		year() {
			return this.$route.params.year
		},
		testMessage() {
			return this.message
		},
		months() {
			return Toolbox.months()
		},
		fromFilter() {
			return this.selectedMonth.format('YYYY-MM-DD')
		},
		toFilter() {
			return this.selectedMonth.endOf('month').add(1, 'days').format('YYYY-MM-DD')
		},
		initialFilter() {
			return {
				issuerCompany: {
					type: '=',
					value: this.mainCompanyId,
					childKey: 'id'
				},
				issueDate: {
					type: 'between',
					value: this.fromFilter + ';' + this.toFilter
				}
			}
		},
		initialFilterIn() {
			return {
				recipientCompany: {
					type: '=',
					value: this.mainCompanyId,
					childKey: 'id'
				},
				vatPaymentDate: {
					type: 'between',
					value: this.fromFilter + ';' + this.toFilter
				}
			}
		}
	},
	methods: {
		downloadInvoiceBulk() {
			TimesheetAPI.dph.downloadDphBulk(this.selectedMonth.subtract(1, 'month').format('YYYY-MM-DD'), this.mainCompanyId)
		},
		selectMonth(value) {
			this.selectedMonth = moment().set('month', value).startOf('month').set('year', parseInt(this.$route.params.year))
			this.monthIndex = this.selectedMonth.get('month')
		},
		getTable() {
			return this.$refs.invoiceTableIssued
		}
	}

}
</script>

<style scoped>

</style>
