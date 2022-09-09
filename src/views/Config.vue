<template>
	<div class="submenu-content">
		<div class="menu">
			<div class="menu-holder">
				<ul>
					<router-link tag="li" to="/config/companies">Společnosti</router-link>
					<router-link tag="li" to="/config/projects">Projekty</router-link>
					<router-link tag="li" to="/config/orders">Objednávky</router-link>
					<router-link tag="li" to="/config/remote-writer">Výkazy</router-link>
				</ul>
			</div>
		</div>
		<div class="content">
			<router-view/>
		</div>
	</div>
</template>VZP

<script>
export default {
	name: 'Config'
}
</script>

<style scoped>

</style>
