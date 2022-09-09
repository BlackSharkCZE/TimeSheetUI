<template>
	<div class="submenu-content">

		<div class="menu">
			<div class="menu-holder">
				<ul>
					<router-link tag="li" v-for="item in yearlist" :to="item" v-bind:key="item">{{ item }}</router-link>
				</ul>
			</div>
		</div>
		<div class="content">
			<router-view/>
		</div>
	</div>
</template>

<script>

import moment from 'moment'

export default {
	name: 'DphLayout',
	data() {
		return {
			yearlist: []
		}
	},
	created() {
		const now = moment().get('year')
		for (let i = now; i > 2018; i--) {
			this.yearlist.push(i.toString(10))
		}
	}
}
</script>

<style scoped>

</style>
