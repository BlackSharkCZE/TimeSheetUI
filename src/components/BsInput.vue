<template>

	<div class="input-container">
		<div class="flex-item">
			<div :class="['form__group', 'field', statusClass]">
				<input
						ref="input"
						:id='id'
						autocomplete="off"
						type="text"
						class="form__field"
						:value="value"
						:placeholder="label"
						:required="required"
						@blur="validate()"
						@focus="focused=true;validate()"
						@input="updateValue($event.target.value)"/>
				<label :for="id" class="form__label">{{ label }}</label>
			</div>
		</div>
		<div class="flex-item" v-if="buttonCallback">
			<button class="bs-button" @click="processButtonClick">
				<slot>
					<font-awesome-icon icon="hand-pointer"/>
				</slot>
			</button>
		</div>
	</div>

</template>

<script>

import { Toolbox } from '@/services/Toolbox'

export default {
	name: 'BsInput',
	props: {
		focusOnUpdate: {
			type: Boolean,
			default: false
		},
		id: String,
		label: String,
		value: [String, Number],
		required: {
			type: Boolean,
			default: true
		},
		type: {
			type: String,
			default: 'text'
		},
		buttonCallback: {
			type: Function,
			default: null
		}
	},
	data() {
		return {
			focused: false,
			statusClass: '',
			errors: []
		}
	},
	mounted() {
		if (this.required && !Toolbox.isValue(this.value)) {
			this.errors.push('Value is required')
		}
	},
	updated() {
		this.errors = []
		if (this.required && !Toolbox.isValue(this.value)) {
			this.errors.push('Value is required')
		}
	},
	methods: {
		processButtonClick() {
			if (this.buttonCallback) {
				this.buttonCallback(this.value)
			}
		},
		isValid() {
			return this.errors.length === 0
		},
		getErrors() {
			return this.errors
		},
		validate(value) {
			if (value === undefined) {
				value = this.value
			}
			this.errors = []
			// && this.focused && (value === null || value.length === 0)
			if (this.required && (value === null || value.length === 0)) {
				this.statusClass = 'invalid'
				this.errors.push('Value is required.')
			} else {
				if (!this.isValidFormat(value)) {
					this.statusClass = 'invalid'
					this.errors.push('Value is not valid.')
				} else {
					this.statusClass = ''
				}
				this.statusClass = ''
			}
		},
		updateValue(value) {
			this.validate(value)
			this.$emit('input', value)
		},
		isValidFormat(value) {
			switch (this.type.toUpperCase()) {
				case 'NUMBER':
					return !isNaN(value)
				case 'TIME': {
					const x = value.match(/^\d{2}:\d{2}$/)
					if (x) {
						const data = value.split(':')
						if (data.length === 2) {
							const hour = parseInt(data[0], 10)
							const min = parseInt(data[0], 10)
							return hour >= 0 && hour < 24 && min >= 0 && min < 60
						}
					}
					return false
				}
				default:
					return true
			}
		}
	}
}
</script>

<style scoped lang="scss">
@import "components";

.input-container {
	width: 100%;
	display: flex;
	align-items: flex-end;
	flex-direction: row;

	.flex-item {
		flex-grow: 1;
		padding: 0;
	}

	.bs-button {
		border: 1px solid $bs-gray;
		border-bottom: 2px solid $bs-gray;
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
