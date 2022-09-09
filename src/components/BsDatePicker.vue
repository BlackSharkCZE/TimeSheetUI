<template>
	<div>
		<vc-date-picker
				is-dark
				color="blue"
				v-model="calendarValue"
				mode="date"
				ref="datePicker"
				@dayclick="dayclickhandle">
			<template v-slot="{ inputValue, togglePopover }">
				<div class="date-input">
					<div class="flex-item" style="width: 100%;">
						<div :class="['form__group', 'field', statusClass]">
							<label :for="id" class="form__label">{{ label }}</label>
							<input
									autocomplete="nope"
									:value="displayValue"
									type="text" class="form__field" :placeholder="label"
									:name="id" :id='id' @input="updateCustomValue($event.target.value)"/>
						</div>
					</div>
					<div class="flex-item">
						<button class="calendar-button" @click="togglePopover({ placement: 'auto-start' })">
							<font-awesome-icon icon="calendar"/>
						</button>
					</div>

				</div>
			</template>
		</vc-date-picker>
	</div>
</template>

<script>
import moment from 'moment/moment'

export default {
	name: 'BsDatePicker',
	components: {},
	emits: ['input', 'value-changed'],
	props: {
		format: {
			type: String,
			default: 'DD.MM.YYYY'
		},
		value: {
			type: Object,
			default: null
		},
		label: String,
		id: {
			type: String,
			required: true
		},
		required: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			calendarValue: null,
			displayValue: null,
			statusClass: '',
			errors: []
		}
	},
	mounted() {
		if (this.$props.value !== null) {
			this.displayValue = this.$props.value.format(this.$props.format)
			this.$refs.datePicker.updateValue(this.$props.value.toDate())
		}
	},
	methods: {
		validate() {
			this.errors = []
			if (this.required && (this.calendarValue === null)) {
				this.statusClass = 'invalid'
				this.errors.push('Value is required.')
			} else {
				this.statusClass = ''
			}
		},
		getErrors() {
			return this.errors
		},
		isValid() {
			return this.statusClass === ''
		},
		dayclickhandle($event) {
			const momentValue = moment($event.date).startOf('day')
			this.displayValue = momentValue.format(this.$props.format)
			this.$emit('input', momentValue)
			this.$emit('value-changed', momentValue)
			this.statusClass = ''
		},
		updateCustomValue(value) {
			if (value.length === 0) {
				this.displayValue = null
				this.$refs.datePicker.updateValue(null)
				if (this.required) {
					this.statusClass = 'invalid'
				}
			} else {
				const m1 = moment(value, this.$props.format)
				const m2 = m1.format(this.$props.format)
				if (m2 === value) {
					this.$refs.datePicker.updateValue(m1.toDate())
					this.$emit('input', m1)
					this.$emit('value-changed', m1)
					this.statusClass = ''
				}
			}
		}
	}
}
</script>

<style scoped lang="scss">
@import "components";

$vertical-align: 15px;

.datepicker-wrapper {
}

.date-input {
	margin-top: $vertical-align;
	width: 100%;
	display: flex;
	flex-direction: row;
	align-items: flex-end;

	.flex-item {
		//padding-right: 30px;
	}

	.calendar-button {
		border: 1px solid $bs-gray;
		background-color: #3A5977;
		color: #869198;
		padding: 0.2em 0.5em;
		border-bottom: 2px solid $bs-gray;
		cursor: pointer;

		&:HOVER {
			background-color: #4c7197;
			color: #c5d7e0;
		}

	}
}

.form__group {
	position: relative;
	padding: $vertical-align 0 0;
	display: inline;

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
