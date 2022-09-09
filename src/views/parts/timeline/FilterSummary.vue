<template>
	<div class="filter-summary">
		<div class="content">
			<div class="item">Počet řádek ve filteru: <span class="value">{{ $store.getters.getFilterSummary.rows }}</span></div>
			<div>|</div>
			<div class="item">Odpracovaný čas v zobrazení: <span class="value">{{ $store.getters.getFilterSummary.workTime }}</span></div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'FilterSummary'
}
</script>

<style scoped lang="scss">

@import "../../../styles/custom-colors";
@import "../../../components/components";

.filter-summary {
	margin-top: 0.5rem;
	@include container-shadow;
	border: 1px solid $container-border-color;
	padding: 0.5em;
	margin-bottom: 1em;
	.content {
		display: flex;
		flex-flow: row;
		gap: 0.5rem;
		.value {
			font-weight: bold;
		}
	}
}
</style>
