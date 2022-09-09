<template>

	<div class="submenu-content">

		<div class="menu">
			<div class="menu-holder">
				<ul>
					<router-link tag="li" to="/invoices/overivew">Přehled faktur</router-link>
					<router-link tag="li" to="/invoices/received">Přijaté faktury</router-link>
				</ul>
			</div>
		</div>
		<div class="content">
			<router-view/>
		</div>
	</div>

</template>

<script>
export default {
	name: 'Invoices',
	components: {},
	methods: {}
}
</script>

<style scoped>
</style>
