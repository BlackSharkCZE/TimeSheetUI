<template>

	<div class="autocomplete">
		<div :class="['form__group', 'field', statusClass]">
			<input
					ref="sInput"
					:id='id'
					autocomplete="off"
					type="text"
					:name="id"
					class="form__field"
					v-model="inputValue"
					:placeholder="label"
					:required="required"
					@keydown.esc="processEscape"
					@keydown.up="selectPrevItem"
					@keydown.down="selectNextItem"
					@keydown.enter="confirmSelect(selectedItem)"
					@click="processClick"
					@input="processInput($event)"
					@blur="processBlur"
					@focus="processFocus"/>
			<label :for="id" class="form__label">{{ label }}</label>
		</div>
		<transition name="fade">
			<div class="search-panel" v-if="displaySearchPanel" @mouseleave="mouseLeave">
				<ul>
					<li
							:class="{'selected': item===selectedItem}"
							v-for="(item, $index) of filteredItems" v-bind:key="$index" @click="confirmSelect(item)">
						<slot name="displayValue" v-bind:item="item">{{ formatter(item) }}</slot>
					</li>
				</ul>
			</div>
		</transition>
		<div class="debug">
			<table>
				<tr>
					<td>Value:</td>
					<td>{{ value }}</td>
				</tr>
				<tr>
					<td>Items:</td>
					<td>{{ items }}</td>
				</tr>
				<tr>
					<td>Filterd Items:</td>
					<td>{{ filteredItems }}</td>
				</tr>
				<tr>
					<td>Display Value:</td>
					<td>{{ displayValue }}</td>
				</tr>
			</table>
		</div>
	</div>
</template>

<script lang="js">
export default {
	name: 'BsAutoComplete',
	props: {
		id: {
			type: String,
			required: true
		},
		value: Object,
		label: String,
		formatter: Function,
		items: Array,
		required: {
			type: Boolean,
			default: false
		}
	},

	computed: {
		filteredItems() {
			if (!this.justClick) {
				if (this.inputValue !== null && this.inputValue.length > 0) {
					return this.items.filter(item => {
						return this.formatter(item).toLowerCase().indexOf(this.inputValue.toLowerCase()) === 0
					})
				} else {
					return this.items
				}
			} else {
				return this.items
			}
		},
		displayValue() {
			if (this.$props.value) {
				if (this.$props.formatter) {
					return this.$props.formatter(this.$props.value)
				} else {
					return this.$props.value
				}
			} else {
				return null
			}
		}
	},

	data() {
		return {
			displaySearchPanel: false,
			statusClass: '',
			errors: [],
			inputValue: null,
			selectedItem: null,
			justClick: false
		}
	},

	watch: {
		items(newValue, oldValue) {
			if (newValue !== oldValue && oldValue.length > 0) {
				if (newValue.length > 0) {
					this.confirmSelect(newValue[0])
				}
			}
		}
	},

	methods: {
		processBlur() {
			this.displaySearchPanel = false
			this.validate()
		},
		processEscape() {
			this.displaySearchPanel = false
			this.$refs.sInput.focus()
		},
		processFocus() {
			this.focused = true
			this.validate()
			if (!this.displaySearchPanel) {
				this.displaySearchPanel = true
			}
		},
		selectNextItem() {
			const fItem = this.filteredItems
			if (fItem.length > 0) {
				if (!this.displaySearchPanel) {
					this.displaySearchPanel = true
				}
				const index = fItem.indexOf(this.selectedItem)
				if (index + 1 >= fItem.length) {
					this.selectedItem = fItem[0]
				} else {
					this.selectedItem = fItem[index + 1]
				}
			}
		},
		selectPrevItem() {
			const fItem = this.filteredItems
			if (fItem.length > 0) {
				if (!this.displaySearchPanel) {
					this.displaySearchPanel = true
				}
				const index = fItem.indexOf(this.selectedItem)
				if (index - 1 < 0) {
					this.selectedItem = fItem[fItem.length - 1]
				} else {
					this.selectedItem = fItem[index - 1]
				}
			}
		},
		mouseLeave() {
			this.displaySearchPanel = false
		},
		processClick() {
			this.justClick = true
			if (this.displaySearchPanel === false) this.displaySearchPanel = true
			// this.displaySearchPanel = !this.displaySearchPanel
			const fItems = this.filteredItems
			if (fItems.length > 0) {
				this.selectedItem = fItems[0]
			} else {
				this.selectedItem = null
			}
		},
		isValid() {
			this.errors = []
			if (this.required === true) {
				if (this.value === null) {
					this.errors.push('Value is required!')
					return false
				}
			}
			return true
		},
		getErrors() {
			return this.errors
		},
		confirmSelect(item) {
			this.$emit('input', item)
			this.$emit('change', item)
			this.inputValue = this.formatter(item)
			this.displaySearchPanel = false
			// this.$refs.input.$el.value = this.formatter(item)
		},
		validate() {
			/* */
		},
		processInput(event) {
			if (this.justClick) {
				this.justClick = false
			}
			if (this.displaySearchPanel === false) {
				this.displaySearchPanel = true
			}
			const fItem = this.filteredItems
			if (fItem.indexOf(this.selectedItem) === -1) {
				if (fItem.length > 0) {
					this.selectedItem = fItem[0]
				} else {
					this.selectedItem = null
				}
			}
		}
	}
}
</script>

<style lang="scss" scoped>
@import "components";

.debug {
	display: none;
	margin-top: 20px;
}

.autocomplete {

	.fade-enter-active, .fade-leave-active {
		transition: opacity .5s;
	}

	.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
	{
		opacity: 0;
	}

	.search-panel {
		z-index: 1000;
		position: absolute;
		background-color: $main-nav-background-color;
		border: 1px solid $bs-table-border-color;
		@include container-shadow;

		ul {
			margin: 0;
			padding: 0;

			li {
				list-style: none;
				padding: 0.2rem 1rem;
				cursor: pointer;

				&:HOVER {
					background-color: $bs-table-color-selected-hover;
				}

				&.selected {
					background-color: $bs-table-color-selected-hover;
				}
			}
		}
	}

}

.form__group {
	position: relative;
	padding: 15px 0 0;

	&.invalid {
		input {
			&.form__field {
				border-image: linear-gradient(to right, $bs-error-dark, $bs-error-light);
				border-image-slice: 1;
			}
		}

		label {
			&.form__label {
				color: $bs-error-text;
			}
		}
	}

	.form__field {
		font-family: inherit;
		width: 100%;
		border: 0;
		border-bottom: 2px solid $bs-gray;
		outline: 0;
		font-size: $component-font-size;
		color: $bs-primary;
		padding: 2px 0;
		background: transparent;
		transition: border-color 0.2s;

		&::placeholder {
			color: transparent;
		}

		&:placeholder-shown ~ .form__label {
			font-size: $component-font-size;
			cursor: text;
			top: 20px;
		}
	}

	.form__label {
		position: absolute;
		top: 0;
		display: block;
		transition: 0.2s;
		font-size: 0.8*$component-font-size;
		color: $bs-gray;
	}

	.form__field:focus {
		~ .form__label {
			position: absolute;
			top: 0;
			display: block;
			transition: 0.2s;
			font-size: 0.8*$component-font-size;
			color: $bs-primary;
			font-weight: normal;
		}

		padding-bottom: 2px;
		font-weight: normal;
		border-width: 2px;
		border-image: linear-gradient(to right, $bs-primary, $bs-secondary);
		border-image-slice: 1;

	}

	/* reset input */
	.form__field {
		&:required, &:invalid {
			box-shadow: none;
		}
	}
}

</style>
