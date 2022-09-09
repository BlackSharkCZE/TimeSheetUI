<template>
	<bs-form ref="bsFormRef">
		<div class="form">
			<div class="row">
				<div class="item">
					<bs-input ref="projectName" v-model="project.name" :required="true" label="Název projektu"></bs-input>
				</div>
				<div class="item">
					<bs-auto-complete ref="companySelect" v-model="project.company" :items="companies" label="Společnost" id="companiesAutoComplete"
					                  :formatter="(x)=>x.companyName"/>
				</div>
			</div>

			<div class="row">
				<div class="item">
					<bs-input ref="key" v-model="project.key" :required="true" label="Project Key"></bs-input>
				</div>
				<div class="item">
					<bs-auto-complete id="rootProjectSelectID" label="GEM Root Project"
					                  v-on:change="rootProjectChanged"
					                  :items="gemRootProjects"
					                  v-model="rootProject"
					                  :formatter="rootProjectDisplayFunc"/>
				</div>
				<div class="item">
					<bs-input ref="key" v-model="project.projectId" :required="true" label="Project ID"></bs-input>
					<bs-auto-complete
							ref="projectList"
							id="projectSelectID"
							label="GEM Project"
							:items="gemProjects"
							v-model="gemProject"
							:formatter="rootProjectDisplayFunc"/>

				</div>

			</div>

			<div class="row">
				<div class="item">
					<div>Remote Writers:</div>
					<ul class="simple">
						<li v-for="(item, $index) in remoteWriters" v-bind:key="$index">
							<input type="checkbox" :checked="isSelected(item)" v-on:change="switchItem($event, item)"/>
							{{ item }}
						</li>
					</ul>
				</div>
			</div>
		</div>
	</bs-form>
</template>

<script>
import BsInput from '@/components/BsInput'
import { TimesheetAPI } from '@/services/TimesheetAPI'
import { TimesheetGraph } from '@/services/TimesheetGraph'
import BsForm from '@/components/BsForm'
import BsAutoComplete from '@/components/BsAutoComplete'

export default {
	name: 'CreateProjectForm',
	components: {
		BsForm,
		BsInput,
		BsAutoComplete
	},
	emits: ['ItemCreated', 'ItemError'],
	data() {
		return {
			errors: [],
			gemRootProjects: [],
			rootProject: null,
			gemProject: null,

			project: {
				name: null,
				company: null,
				key: null,
				remoteWriterList: [],
				rootProjectId: null,
				projectId: null
			},
			remoteWriters: []
		}
	},
	mounted() {
		TimesheetGraph.projects.allGemTsProjects().then(data => {
			this.gemRootProjects = data.data.allProjects
		})
		TimesheetAPI.project.remoteWriterList().then(data => {
			this.remoteWriters = data
		})
	},
	computed: {
		gemProjects() {
			console.log('Compute projects!')
			if (this.rootProject != null) {
				return this.rootProject.projects
			} else {
				return []
			}
		},
		companies() {
			if (this.$store.getters.getAllCompanies === null || this.$store.getters.getAllCompanies.length === 0) {
				this.$store.dispatch('fetchCompanies')
			}
			return this.$store.getters.getAllCompanies
		}
	},
	methods: {
		rootProjectChanged(newItem) {
			this.rootProject = newItem
			this.gemProject = newItem.projects[0]
			console.log('gemProject set to ', this.gemProject)
			this.$refs.projectList.$forceUpdate()
		},
		rootProjectDisplayFunc(item) {
			return item.text
		},
		switchItem(event, item) {
			const index = this.project.remoteWriterList.indexOf(item)
			if (index >= 0) {
				this.project.remoteWriterList.splice(index, 1)
			} else {
				this.project.remoteWriterList.push(item)
			}
		},
		isSelected(item) {
			return this.project.remoteWriterList.indexOf(item) >= 0
		},
		validateForm() {
			return this.$refs.bsFormRef.validate()
		},
		resetFormStatus() {
			return this.$refs.bsFormRef.resetFormStatus()
		},
		save() {
			const _data = {
				id: null,
				name: this.project.name,
				companyID: this.project.company.id,
				companyName: this.project.company.companyName
			}
			TimesheetAPI.project.save(_data)
			            .then(response => response.json()
			                                      .then(data => {
				                                      this.$emit('ItemCreated', data)
			                                      }))
			            .catch(exc => {
				            this.$refs.bsFormRef.errors.push('Save: Can not save data! ' + exc.message)
				            this.$emit('ItemError', exc)
			            })
		}
	}
}
</script>

<style scoped lang="scss">

ul {
	&.simple {
		list-style: none;
		margin: 0;
		padding: 0;
	}
}

.row {
	display: flex;
	flex-direction: row;

	.item {
		padding: 0.3rem;
	}
}

</style>
