<template>
	<div class="simple-content">
		<timeline-form id="createForm" v-on:timelineCreated="timelineCreated"></timeline-form>
		<report-panel></report-panel>
		<timeline-table ref="timelineTable" :page-size="20"></timeline-table>
		<filter-summary></filter-summary>
	</div>
</template>

<script>
import TimelineTable from '@/views/parts/timeline/TimelineTable'
import TimelineForm from '@/views/parts/timeline/TimelineForm'
import ReportPanel from '@/views/parts/ReportPanel'
import FilterSummary from '@/views/parts/timeline/FilterSummary'

export default {
	name: 'Timesheet',
	components: {
		FilterSummary,
		TimelineForm,
		TimelineTable,
		ReportPanel
	},
	data() {
		return {}
	},
	methods: {
		timelineCreated(timelineVo) {
			this.$refs.timelineTable.reload()
			this.$store.dispatch('loadCurrentReport')
		}
	}
}

</script>

<style lang="scss">
</style>
