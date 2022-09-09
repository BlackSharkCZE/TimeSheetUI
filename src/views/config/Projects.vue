<template>

	<div>
		<div class="row">
			<div class="item">
				<projects-table ref="projectsTable"></projects-table>
			</div>
			<div class="item">
				<button class="bs-button lg" @click="$refs.createProjectDialog.display()">
					<font-awesome-icon icon="plus"/>
					Přidat projekt
				</button>
			</div>
		</div>
		<bs-modal-dialog ref="createProjectDialog" label="Přidat projekt">
			<template slot="content">
				<create-project-form ref="projectForm" v-on:ItemCreated="itemCreatedHandler"></create-project-form>
			</template>
			<template slot="footer">
				<input type="button" class="bs-button" @click="processCancel" value="Zavřít"/>
				<input type="button" class="bs-button success" @click="processSave" value="Uložit"/>
			</template>
		</bs-modal-dialog>
	</div>

</template>

<script>
import ProjectsTable from '@/views/parts/project/ProjectsTable'
import BsModalDialog from '@/components/BsModalDialog'
import CreateProjectForm from '@/views/parts/project/CreateProjectForm'

export default {
	name: 'Projects',
	components: {
		ProjectsTable,
		BsModalDialog,
		CreateProjectForm
	},
	methods: {
		itemCreatedHandler(item) {
			this.$refs.projectsTable.reload()
			this.$refs.createProjectDialog.hide()
		},
		processCancel() {
			this.$refs.createProjectDialog.hide(() => {
			})
		},
		processSave() {
			if (this.$refs.projectForm.validateForm()) {
				this.$refs.projectForm.save()
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
