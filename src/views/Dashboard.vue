<template>
	<div class="simple-content">

		<bs-display-item label="Měsíc">{{ displayDate }}</bs-display-item>

		<div v-if="dasboardData!=null">

			<bs-display-item label="Celkem hodin v měsíci">
				{{ dasboardData.workTimeDashboard.hoursInMonth }}
			</bs-display-item>

			<bs-display-item label="Odpracováno hodin">
				{{ dasboardData.workTimeDashboard.hoursDone }}
			</bs-display-item>

			<bs-display-item label="Zbývá k odpracování">
				{{ dasboardData.workTimeDashboard.hoursInMonth - dasboardData.workTimeDashboard.hoursDone }}
			</bs-display-item>

			<project-report v-for="(item, $index) of dasboardData.projectReportList" v-bind:key="$index" :data="item"></project-report>

		</div>
		<div v-else>
			Data not available!
		</div>

	</div>
</template>

<script>

import { TimesheetGraph } from '@/services/TimesheetGraph'
import BsDisplayItem from '@/components/BsDisplayItem'
import ProjectReport from '@/views/parts/dashboard/ProjectReport'

export default {
	name: 'Dashboard',
	components: {
		BsDisplayItem,
		ProjectReport
	},
	data() {
		return {
			displayDate: '2021-11-01',
			dasboardData: null
		}
	},
	mounted() {
		TimesheetGraph.dashboard.dashboardData(this.displayDate).then(res => {
			this.dasboardData = res.data.dashboard
		})
	}
}
</script>

<style scoped>

</style>
