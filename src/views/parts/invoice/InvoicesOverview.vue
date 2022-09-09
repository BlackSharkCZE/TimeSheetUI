<template>
	<div>
		<invoice-form id="invoiceGenerateForm"></invoice-form>
		<invoice-table ref="invoiceTable"></invoice-table>
	</div>
</template>

<script>
import InvoiceForm from '@/views/parts/invoice/InvoiceForm'
import InvoiceTable from '@/views/parts/invoice/InvoiceTable'

export default {
	name: 'InvoicesOverview',
	components: { InvoiceForm, InvoiceTable }
}
</script>

<style scoped>

</style>
