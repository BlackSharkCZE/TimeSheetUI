<template>

	<div class="form-container">

		<div style="display:flex;">
			<div>Hello World</div>
			<div>
				<bs-auto-complete :required="true"
				                  ref="autocomplete1"
				                  v-model="completeModel"
				                  :items="completeItems"
				                  label="Plátce"
				                  id="recipientCompanyAC"
				                  :formatter="(x)=>x.name">
				</bs-auto-complete>
			</div>
			<div>Greeting</div>
		</div>
	</div>

</template>

<script>
import BsAutoComplete from '@/components/BsAutoComplete'

export default {
	name: 'Lab',
	components: { BsAutoComplete },
	data() {
		return {
			completeModel: null,
			completeItems: [
				{
					id: 1,
					name: 'Fridrich'
				},
				{
					id: 2,
					name: 'Gazpaco'
				}
			]
		}
	}
}
</script>

<style scoped>

</style>
