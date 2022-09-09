<template>
	<div class="item-holder">
		<div class="item">
			<bs-display-item :label="data.projectName">Vykázáno: {{ data.workTimeOnProject | asDuration }} [h]</bs-display-item>
		</div>
	</div>
</template>

<script>
import bsDisplayItem from '@/components/BsDisplayItem'

export default {
	name: 'ProjectReport',
	components: { bsDisplayItem },
	props: {
		data: {
			type: Object,
			required: true
		}
	}
}
</script>

<style scoped>

</style>
