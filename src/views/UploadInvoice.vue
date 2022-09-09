<template>

	<div class="simple-content border">
		<div class="invoice-detail-container">
			<bs-form ref="bsFormRef">
				<div class="header">
					<h2>Zadání nové faktury</h2>
					<h2 class="text-align-right">
						<div class="button" style="display: inline-block">
							<font-awesome-icon icon="backward" class="fa-click" v-on:click="$router.go(-1)"/>
						</div>
					</h2>
				</div>
				<div class="row">
					<div class="col">
						<bs-input v-model="invoice.invoiceNumber" :required="true" label="Číslo faktury"></bs-input>
					</div>
					<div class="col">
						<bs-auto-complete ref="issuerCompany"
						                  :required="true"
						                  v-model="invoice.issuerCompany"
						                  :items="companyList"
						                  label="Vystavil"
						                  id="issuerCompanyAC"
						                  :formatter="(x)=>x.companyName"/>
					</div>
					<div class="col">
						<bs-auto-complete ref="recipientCompany"
						                  :required="true"
						                  v-model="invoice.recipientCompany"
						                  :items="companyList"
						                  label="Plátce"
						                  id="recipientCompanyAC"
						                  :formatter="(x)=>x.companyName"/>
					</div>
				</div>
				<div class="row">
					<div class="col-grow">
						<bs-date-picker :required="true" ref="issueDate" v-model="invoice.issueDate" label="Datum vystavení" id="issueDate"></bs-date-picker>
					</div>
					<div class="col-grow">
						<bs-date-picker :required="true" ref="paymentDate" v-model="invoice.paymentDate" label="Datum splatnosti" id="paymentDate"></bs-date-picker>
					</div>
					<div class="col-grow">
						<bs-date-picker v-model="invoice.vatPaymentDate" ref="vatPaymentDate" label="Datum uskutečení daňového plnění" id="vatPaymentDate"></bs-date-picker>
					</div>
				</div>
				<div class="row">
					<div class="col-grow">
						<bs-file-upload @change="selectedFilesChanged" :multiple="false"></bs-file-upload>
					</div>
				</div>
				<div class="invoice-header">
					<div class="row">
						<div class="col-grow">
							<company-box label="Vystavil" :company="invoice.issuerCompany" v-if="invoice.issuerCompany !== null"></company-box>
						</div>
						<div class="col-grow">
							<company-box label="Příjemce" :company="invoice.recipientCompany" v-if="invoice.recipientCompany !== null"></company-box>
						</div>
					</div>
				</div>
				<div class="row">
					<div class="col-grow">
						<bs-message :hideTimeout="6000" ref="displayMessage"></bs-message>
					</div>
				</div>
				<div class="row">
					<div class="col-grow">
						<button class="bs-button lg" @click="processUpload">
							<font-awesome-icon icon="upload"></font-awesome-icon>
							Nahrát
						</button>
					</div>
				</div>
			</bs-form>
		</div>
	</div>

</template>

<script>
import BsDatePicker from '@/components/BsDatePicker'
import BsAutoComplete from '@/components/BsAutoComplete'
import CompanyBox from '@/views/parts/company/CompanyBox'
import BsFileUpload from '@/components/BsFileUpload'
import BsForm from '@/components/BsForm'
import BsInput from '@/components/BsInput'
import BsMessage from '@/components/BsMessage'
import { TimesheetAPI } from '@/services/TimesheetAPI'

export default {
	name: 'UploadInvoice',
	components: {
		BsMessage,
		BsInput,
		BsForm,
		BsFileUpload,
		BsDatePicker,
		BsAutoComplete,
		CompanyBox
	},
	data() {
		return {
			invoice: {
				invoiceNumber: null,
				issueDate: null,
				paymentDate: null,
				vatPaymentDate: null,
				issuerCompany: null,
				recipientCompany: null,
				files: []
			}
		}
	},
	created() {
		this.$store.dispatch('fetchCompanies').then(() => {
		})
	},
	computed: {
		companyList() {
			return this.$store.state.companies
		}
	},
	methods: {
		selectedFilesChanged(files) {
			this.invoice.files = files
		},
		processUpload() {
			const file = this.invoice.files[0]
			const req = {
				issuerID: this.invoice.issuerCompany.id,
				recipientID: this.invoice.recipientCompany.id,
				invoiceNumber: this.invoice.invoiceNumber,
				issueDate: this.$options.filters.asIsoDate(this.invoice.issueDate),
				paymentDate: this.$options.filters.asIsoDate(this.invoice.paymentDate),
				vatPaymentDate: this.$options.filters.asIsoDate(this.invoice.vatPaymentDate)
			}
			const formData = new FormData()
			formData.append('file', file)
			formData.append('metadata', JSON.stringify(req))
			TimesheetAPI.invoice.upload(formData).then(response => {
				response.json().then(data => {
					if (data.success === true) {
						const invoiceID = data.data.id
						if (invoiceID > 0) {
							this.$router.push({
								name: 'Invoice',
								params: { id: invoiceID }
							})
						}
					} else {
						this.$refs.displayMessage.showError('Nelze nahrát fakturu. ' + data.message, true)
					}
				})
			}).catch(exception => {
				console.error(exception)
				this.$refs.displayMessage.showError('Nelze nahrát fakturu. ' + exception.message, true)
			})
		}
	}
}
</script>

<style scoped>

</style>
