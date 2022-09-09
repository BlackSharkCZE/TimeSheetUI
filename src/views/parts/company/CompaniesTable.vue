<template>
	<bs-table
			ref="bsTable"
			v-bind:fields="fields"
			:autofocus="true"
			:sort="sortField"
			:page-size="pageSize"
			:resourceUrl="datatableUrl">
		<template v-slot:col(platceDph)="props">
			{{props.platceDph ? 'ano' : 'ne'}}
		</template>
		<template v-slot:col(primary)="props">
			<font-awesome-icon :icon="primaryIcon(props)"></font-awesome-icon>
		</template>
	</bs-table>
</template>

<script>
import CompaniesTableFields from '@/views/parts/company/CompaniesFields'
import BsTable from '@/components/BsTable'
export default {
	name: 'CompaniesTable',
	components: {
		BsTable
	},
	data() {
		return {
			fields: CompaniesTableFields,
			sortField: 'companyName',
			currentRow: null,
			pageSize: 25
		}
	},
	computed: {
		datatableUrl() {
			return process.env.VUE_APP_SERVER_URL + '/datatable/companies'
		}
	},
	methods: {
		reload() {
			this.$refs.bsTable.reload()
		},
		primaryIcon(item) {
			if (item.primary === true) {
				return 'check-circle'
			} else {
				return 'ban'
			}
		}
	}
}
</script>

<style scoped>

</style>
