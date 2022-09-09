<template>

	<div class="bs-dropdown">
		<div class="display-item" @click="openDropdown">{{ displayValue }}</div>
		<transition name="fade">
			<div class="dropdown-list" v-if="display" @mouseleave="display=false">
				<ul v-if="items && items.length>0">
					<li v-for="(item, index) in items" v-bind:key="item.id" @click="selectItem(item, index)">
						{{ displayFunc(item) }}
					</li>
				</ul>
			</div>
		</transition>
	</div>

</template>

<script>
export default {
	name: 'BsDropDown',
	props: {
		emptyText: String,
		value: Object,
		items: Array,
		displayFunc: Function
	},
	data() {
		return {
			selected: 0,
			selectedItem: null,
			display: false,
			empty: {
				id: -1,
				companyName: this.emptyText
			}
		}
	},
	mounted() {
		// this.selectedItem = this.items[this.selected]
	},
	computed: {
		displayValue() {
			if (this.value === null) {
				return this.emptyText
			} else {
				return this.displayFunc(this.value)
			}
		}
	},
	methods: {
		openDropdown() {
			this.display = true
		},
		selectItem(item, index) {
			this.selectedItem = item
			this.selected = index
			this.display = false
			this.$emit('input', item)
			this.$emit('change', item)
		}
	}
}
</script>

<style scoped lang="scss">

.bs-dropdown {

	.fade-enter-active, .fade-leave-active {
		transition: opacity .2s;
	}

	.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
	{
		opacity: 0;
	}

	.display-item {
		cursor: pointer;
		text-decoration: underline dotted;

		&:HOVER {
			color: $bs-primary
		}
	}

	.dropdown-list {
		@include container-shadow();
		border: 1px solid $bs-table-border-color;
		background-color: $main-nav-background-color;
		position: absolute;
		margin-top: 0.1rem;
		padding: 0.3rem 0;

		ul {
			list-style: none;
			padding: 0;
			margin: 0;

			li {
				padding: 0.2rem 1rem;
				cursor: pointer;

				&:HOVER {
					background-color: $bs-table-border-color;
				}
			}
		}
	}
}
</style>
