<template>
	<bs-table
			ref="bsTable"
			:initial-filter="initialFilter"
			v-bind:fields="fields"
			:autofocus="true"
			:sort="sortField"
			:page-size="pageSize"
			:resourceUrl="datatableUrl">
		<template v-slot:col(price)="props">
			{{ props }}
		</template>
		<template v-slot:col(issuerCompany)="props">
			{{ props.issuerCompany.companyName }}
		</template>
		<template v-slot:col(recipientCompany)="props">
			{{ props.recipientCompany.companyName }}
		</template>
		<template v-slot:col(price)="props">
			{{ getPrice(props.items) }}
		</template>
		<template v-slot:col(priceWithVat)="props">
			{{ getPriceWithVat(props.items) }}
		</template>
		<template v-slot:col(buttons)="props">
			<div class="colum-buttons">
				<div class="button">
					<font-awesome-icon icon="download" class="fa-click" v-on:click="downloadInvoice(props)"/>
				</div>
				<div class="button first">
					<font-awesome-icon icon="bars" class="fa-click" v-on:click="showDetail(props)"/>
				</div>
			</div>
		</template>
	</bs-table>
</template>

<script>
import InvoiceTableFields from '@/views/parts/invoice/InvoiceTableFields'
import BsTable from '@/components/BsTable'
import { Toolbox } from '@/services/Toolbox'
import { TimesheetAPI } from '@/services/TimesheetAPI'

export default {
	name: 'InvoiceTable',
	components: { BsTable },
	props: {
		initialFilter: {
			type: Object,
			required: false,
			default: () => { }
		}
	},
	data() {
		return {
			fields: InvoiceTableFields,
			sortField: 'vatPaymentDate',
			currentRow: null,
			pageSize: 25
		}
	},
	computed: {
		datatableUrl() {
			return process.env.VUE_APP_SERVER_URL + '/datatable/invoices'
		}
	},
	methods: {
		reload() {
			this.$refs.bsTable.reload()
		},
		downloadInvoice(item) {
			TimesheetAPI.invoice.downloadPDF(item.id, item.number)
		},
		showDetail(item) {
			this.$store.dispatch('setCurrentInvoice', item).then(() => {
				this.$router.push({
					name: 'Invoice',
					params: { id: item.id }
				})
			})
		},
		getQuery() {
			return this.$refs.bsTable.currentQuery
		},
		getFieldsConfig() {
			return this.fields
		},
		getPrice(items) {
			return Toolbox.formatPrice(items.reduce((curr, acc) => acc.price + curr, 0).toFixed(2))
		},
		getPriceWithVat(items) {
			return Toolbox.formatPrice(items.reduce((curr, acc) => acc.totalPrice + curr, 0).toFixed(2))
		}
	}
}
</script>

<style scoped>

</style>
