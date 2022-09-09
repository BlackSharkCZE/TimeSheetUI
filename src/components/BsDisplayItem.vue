<template>
	<div class="item">
		<div class="item-label">{{label}}<slot name="label-append"></slot></div>
		<div class="item-value"><slot></slot></div>
	</div>
</template>

<script>
export default {
	name: 'BsDisplayItem',
	props: ['label']
}
</script>

<style scoped lang="scss">

.item {
	.item-label {
		font-weight: bold;
	}
	.item-value {
		color: #11998e;
		padding: 0 0 0.4rem 0.2rem;
	}
}

</style>
