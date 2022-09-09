<template>

	<div class="company-box" v-if="company">
		<div class="label">{{ label }}</div>
		<div class="item-holder">
			<div class="item">
				<bs-display-item label="Název společnosti">{{ company.companyName }}</bs-display-item>
			</div>
			<div class="item">
				<bs-display-item label="IČ">{{ company.ic }}</bs-display-item>
			</div>
			<div class="item">
				<bs-display-item label="Plátce DPH">{{ company.platceDph ? 'ANO' : 'NE' }}</bs-display-item>
			</div>
			<div class="item">
				<bs-display-item label="DIČ" v-if="company.dic">{{ company.dic }}</bs-display-item>
			</div>
		</div>
		<div class="item-holder">
			<div class="item">
				<bs-display-item label="Číslo účtu">{{ company.bankAccountNumber }}</bs-display-item>
			</div>
		</div>
		<div class="item-holder">
			<div class="item">
				<bs-display-item label="Email">{{ company.email }}</bs-display-item>
			</div>
			<div class="item">
				<bs-display-item label="Telefon">{{ company.phoneNumber }}</bs-display-item>
			</div>
		</div>
		<div class="item-holder">
			<div class="item">
				<bs-display-item label="Adresa">{{ company.ulice }} {{ company.cisloDomu }} {{ company.obec }} / {{ company.castObce }}</bs-display-item>
			</div>
		</div>
	</div>

</template>

<script>

import BsDisplayItem from '@/components/BsDisplayItem'

export default {
	name: 'CompanyBox',
	components: { BsDisplayItem },
	props: {
		label: {
			type: String
		},
		company: {
			type: Object,
			required: true
		}
	}
}
</script>

<style scoped lang="scss">

@import "../../../components/components";

.company-box {
	margin-top: .4rem;
	border: 1px solid #2d2f31;
	padding: 0.9rem 0.6rem;
	@include container-shadow;
	.label {
		margin-left: -0.2rem;
		margin-top: -1.4rem;
		position: absolute;
		display: inline-block;
		padding: 0 0.4rem;
		font-weight: normal;
		font-size: $font-size * 1.2;
		background-color: $main-background-color;
	}

	.item-holder {
		display: flex;
		flex-direction: row;

		.item {
			padding-right: 1rem;
		}
	}
}

</style>
