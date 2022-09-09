<template>
	<div>
		<div class="row">
			<div class="item">
				<companies-table ref="companiesTable"></companies-table>
			</div>
			<div class="item">
				<button class="bs-button lg" @click="$refs.createCompanyDialog.display()">
					<font-awesome-icon icon="plus"/>
					Přidat společnost
				</button>
			</div>
		</div>
		<bs-modal-dialog ref="createCompanyDialog" label="Založit novou společnost">
			<template slot="content">
				<create-company-form ref="companyForm" v-on:ItemCreated="itemCreatedHandler" v-on:ItemError="itemErrorHandler"></create-company-form>
			</template>
			<template slot="footer">
				<input type="button" class="bs-button" @click="processCancel" value="Zavřít"/>
				<input type="button" class="bs-button success" @click="processSave" value="Uložit"/>
			</template>
		</bs-modal-dialog>
	</div>
</template>

<script>
import CompaniesTable from '@/views/parts/company/CompaniesTable'
import CreateCompanyForm from '@/views/parts/company/CreateCompanyForm'
import BsModalDialog from '@/components/BsModalDialog'

export default {
	name: 'Companies',
	components: {
		BsModalDialog,
		CompaniesTable,
		CreateCompanyForm
	},
	methods: {
		itemCreatedHandler(item) {
			this.$refs.companiesTable.reload()
			this.$refs.createCompanyDialog.hide()
		},
		itemErrorHandler(exception) {

		},
		processCancel() {
			this.$refs.createCompanyDialog.hide(() => {
				this.$refs.companyForm.resetFormStatus()
			})
		},
		processSave() {
			if (this.$refs.companyForm.validateForm()) {
				this.$refs.companyForm.save()
			}
		}
	}
}
</script>

<style scoped lang="scss">

.row {
	display: flex;
	flex-direction: column;

	.item {
		padding-bottom: 1rem;
	}
}

</style>
