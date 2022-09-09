<template>
  <div>
    <div class="row">
      <div class="col-grow">
        <bs-auto-complete
          v-model="form.project"
          :items="timesheetProjects"
          label="GEM Projekt"
          id="projectAutocomplete36372"
          :formatter="(x)=>x.text"
        />
      </div>
      <div class="col-grow">
        <bs-auto-complete
          v-model="form.subproject"
          :items="subprojects"
          label="Fáze"
          id="'subProject747647'"
          :formatter="(x)=>x.text"
        />
      </div>

      <div class="col-grow">
        <bs-input
          v-model="form.pattern"
          label="Vzor"
        />
      </div>

      <div
        class="col"
        v-for="(rw, index) of remoteWriterList"
        :key="index"
      >
        <bs-checkbox
          :id="'checkbox_'+index"
          v-model="form.remoteWriters[rw]"
          :label="rw"
        />
      </div>
      <div class="col">
        <button
          type="button"
          class="bs-button"
        >
          Přidat
        </button>
      </div>
    </div>
    <div class="row">
      <div class="col-grow">
        <div class="table-container">
          <table class="data-table">
            <thead class="table-head">
              <tr>
                <th>ID</th>
                <th>Project Root ID</th>
                <th>Project ID</th>
                <th>Key Pattern</th>
              </tr>
            </thead>
            <tr
              v-for="row of settings"
              :key="row.id"
            >
              <th>{{ row.id }}</th>
              <th>{{ row.projectRootId }}</th>
              <th>{{ row.projectId }}</th>
              <th>{{ row.keyPattern }}</th>
            </tr>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { TimesheetGraph } from '@/services/TimesheetGraph'
import { TimesheetAPI } from '@/services/TimesheetAPI'
import bsAutoComplete from '@/components/BsAutoComplete'
import BsCheckbox from '@/components/BsCheckbox'
import BsInput from '@/components/BsInput'

export default {
	name: 'RemoteWriters',
	components: {
		BsInput,
		BsCheckbox,
		bsAutoComplete
	},
	data() {
		return {
			settings: [],
			timesheetProjects: [],
			remoteWriterList: [],
			form: {
				project: null,
				subproject: null,
				remoteWriters: {},
				pattern: null

			}
		}
	},
	computed: {
		subprojects: function() {
			if (this.form.project === null) {
				return []
			} else {
				return this.form.project.projects
			}
		}
	},
	mounted() {
		this.reloadSettings()
		TimesheetAPI.project.remoteWriterList().then(data => {
			this.remoteWriterList = data
		}).catch(exc => {
			console.error('Can not get remote writers list!', exc)
		})
		TimesheetGraph.projects.allGemTsProjects().then(data => {
			this.timesheetProjects = data.data.allProjects
		}).catch(err => {
			console.log('Can not download timesheet data: ', err)
		})
	},
	methods: {
		reloadSettings() {
			TimesheetGraph.remoteWriters.getAll().then(data => {
				this.settings = data.data.allConfigs
			}).catch(ex => {
				console.error('Can not load settings: ', ex)
			})
		}
	}
}
</script>

<style scoped lang="scss">

</style>
