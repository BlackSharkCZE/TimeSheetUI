<template>
	<div id="app">
		<div id="nav">
			<ul class="main-menu">
				<router-link tag="li" to="/timesheet">Timesheet</router-link>
				<router-link tag="li" to="/invoices">Faktury</router-link>
				<router-link tag="li" to="/todo">Todo list</router-link>
				<router-link tag="li" to="/dph">DPH</router-link>
				<router-link tag="li" to="/config">Konfigurace</router-link>
			</ul>
		</div>
		<div id="root-content">
			<router-view/>
		</div>

	</div>
</template>

<style lang="scss">
@import 'styles/main.scss';

body {
	font-family: sans-serif;
	font-size: 0.8rem;
	background-color: $main-background-color;
	color: #869198;
	margin: 0;
	padding: 0;
}

#app {
	#nav {
		background-color: $main-nav-background-color;
		border-bottom: 1px solid $bs-table-background;
		ul {
			&.main-menu {
				list-style: none;
				margin: 0;
				padding: 0;

				li {
					display: inline-block;
					padding: 0.7em 1em;
					cursor: pointer;
					&.router-link-active {
						background-color: $router-link-active-background;
					}
					a {
						color: #869198;
						text-decoration: none;
					}

					&:HOVER {
						background-color: #4d5153;
					}
				}
			}
		}
	}

	#root-content {
		//padding: 1em 1em;
	}
}
</style>
