<template>
	<bs-table
			ref="bsTable"
			v-bind:fields="fields"
			:autofocus="true"
			:sort="sortField"
			:page-size="pageSize"
			:resourceUrl="datatableUrl">

	</bs-table>
</template>

<script>

import BsTable from '@/components/BsTable'
import ProjectTableFields from '@/views/parts/project/ProjectsFields'
export default {
	name: 'ProjectsTable',
	components: {
		BsTable
	},
	data() {
		return {
			fields: ProjectTableFields,
			sortField: 'name',
			currentRow: null,
			pageSize: 25
		}
	},
	computed: {
		datatableUrl() {
			return process.env.VUE_APP_SERVER_URL + '/datatable/projects'
		}
	},
	methods: {
		reload() {
			this.$refs.bsTable.reload()
		}
	}
}
</script>

<style scoped>

</style>
