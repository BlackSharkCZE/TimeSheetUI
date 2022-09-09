<template>
	<div>
		<bs-table
				ref="bsTable"
				v-on:itemSelected="onItemSelected"
				v-on:displayDetail="handleShowDetail"
				v-bind:fields="fields"
				:autofocus="true"
				:sort="sortField"
				:page-size="pageSize"
				:resourceUrl="datatableUrl">
			<template v-slot:col(NotExistingKey)="props">
				<div class="colum-buttons">
					<div class="button">
						<font-awesome-icon icon="trash" class="fa-click" v-on:click="confirmDelete(props)"/>
					</div>

					<div class="button">
						<font-awesome-icon icon="edit" class="fa-click" v-on:click="editRow(props)"/>
					</div>

					<div class="button first">
						<font-awesome-icon icon="bars" class="fa-click" v-on:click="onRowClick(props)"/>
					</div>
				</div>
			</template>
			<template v-slot:col(remoteWriters)="props">
				<div class="writers" v-if="props.writers.length>0">
					<div class="writer"
					     :class="{'wrote': isWrote(w, props.remoteWriteTimestamp)}"
					     v-for="(w, $index) in props.writers"
					     v-bind:key="$index">{{ w }} <span> | </span>
					</div>
				</div>
				<div class="writers" v-if="props.writers.length===0"></div>
			</template>
			<template v-slot:col(day)="props">
				<span> {{ props.fromTime | asDay }}</span>
			</template>
			<template v-slot:col(date)="props">
				<font-awesome-icon icon="filter" class="fa-click small" v-on:click="updateTableFilter('date', props)"/>
				<span> {{ props.fromTime | asDate }}</span>
			</template>

			<template v-slot:col(projectEntity)="props">
				{{ props.projectName }}
			</template>

		</bs-table>

		<bs-modal-dialog ref="detailDialog" label="Detail položky">
			<template v-slot:content>
				<timeline-detail :timeline="currentRow" @jiraWrote="jiraWroteHandler"/>
			</template>
		</bs-modal-dialog>

		<bs-modal-dialog ref="confirmDeleteDialog" label="Odstranění záznamu">
			<template v-slot:content>
				<div v-if="currentRow" class="timeline-detail">
					<bs-display-item label="Poznámka">{{ currentRow.note }}</bs-display-item>
					<bs-display-item label="Název projektu">{{ currentRow.projectName }}</bs-display-item>
					<bs-display-item label="Od - Do">{{ currentRow.fromTime | asTime }} - {{ currentRow.toTime | asTime }}</bs-display-item>
					<bs-display-item label="Datum">{{ currentRow.fromTime | asDay }}, {{ currentRow.fromTime | asDate }}</bs-display-item>

					<bs-display-item label="Pauza">{{ currentRow.pause }}</bs-display-item>
					<bs-display-item label="Odpracováno">{{ currentRow.workTime }}</bs-display-item>
				</div>
			</template>
			<template v-slot:footer>
				<input type="button" class="bs-button" @click="closeDialog('confirmDeleteDialog')" value="Close"/>
				<input type="button" class="bs-button success" @click="processDelete(currentRow)" value="Delete"/>
			</template>
		</bs-modal-dialog>

		<bs-modal-dialog ref="editRowModalDialog" label="Record edit">
			<template v-slot:content>
				<timeline-form ref="editTimelineForm" id="editForm" @timelineEdit="itemEditHandler" :edit="$store.state.currentTimeLine"/>
			</template>
		</bs-modal-dialog>
	</div>
</template>

<script>
import TimelineTableFields from '@/views/parts/timeline/TimelineTableFields'
import BsTable from '@/components/BsTable'
import BsDisplayItem from '@/components/BsDisplayItem'
import BsModalDialog from '@/components/BsModalDialog'
import TimelineDetail from '@/views/parts/timeline/TimelineDetail'
import TimelineForm from '@/views/parts/timeline/TimelineForm'

import { TimesheetAPI } from '@/services/TimesheetAPI'
import moment from 'moment/moment'

export default {
	name: 'TimelineTable',
	components: {
		TimelineForm,
		TimelineDetail,
		BsModalDialog,
		BsTable,
		BsDisplayItem
	},
	props: {
		pageSize: {
			type: Number,
			default: 25
		}
	},
	data() {
		return {
			fields: TimelineTableFields,
			sortField: 'fromTime',
			currentRow: null
		}
	},

	mounted() {
	},

	computed: {
		datatableUrl() {
			return process.env.VUE_APP_SERVER_URL + '/datatable/timeline'
		}
	},
	methods: {
		isWrote(writer, remoteWriteTimestamp) {
			if (remoteWriteTimestamp !== null && remoteWriteTimestamp.length > 0) {
				let found = false
				for (let i = 0; i < remoteWriteTimestamp.length; i++) {
					if (remoteWriteTimestamp[i].name === writer) {
						found = remoteWriteTimestamp[i].success === true
						break
					}
				}
				return found
			} else {
				return false
			}
		},
		jiraWroteHandler(data) {
			this.reload()
		},
		itemEditHandler(data) {
			// TODO update row directly in data model instead of reloading
			this.reload()
			this.closeDialog('editRowModalDialog')
			this.$store.dispatch('loadCurrentReport')
		},
		updateTableFilter(field, props) {
			this.$refs.bsTable.updateFilter('date', moment(props.fromTime).format('DD.MM.YYYY'))
		},
		closeDialog(ref) {
			this.$refs[ref].hide()
		},
		handleShowDetail($event) {
			this.currentRow = $event
			this.$refs.detailDialog.display()
		},
		onItemSelected(data) {
			this.$store.dispatch('setCurrentTimeline', data)
		},
		confirmDelete(data) {
			this.currentRow = data
			this.$refs.confirmDeleteDialog.display()
		},
		onRowClick(data) {
			this.currentRow = data
			this.$refs.detailDialog.display()
		},
		editRow(data) {
			this.$store.dispatch('setCurrentTimeline', data).then(() => {
				this.$refs.editTimelineForm.initializeFromStore()
				this.$refs.editRowModalDialog.display()
			})
		},
		processDelete(data) {
			TimesheetAPI.timeline.delete(data.id)
			            .then(json => {
				            this.currentRow = null
				            this.reload()
				            this.$store.dispatch('loadCurrentReport')
			            })
			            .catch(ex => {
				            console.error('Can not delete item: ', data, ex)
			            })
			            .finally(() => {
				            this.$refs.confirmDeleteDialog.hide()
			            })
		},
		reload() {
			this.$refs.bsTable.reload()
		}
	}
}
</script>

<style scoped lang="scss">

.writers {
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	justify-content: left;

	.writer {
		font-style: normal;
		padding-right: 0.2rem;
		color: $bs-error-dark;

		&.wrote {
			color: $bs-primary;
		}
		span {
			color: $bs-table-color;
		}
	}
}

.timeline-detail {
	max-width: 600px;
	padding: 0.5rem 0.4rem;
}
</style>
