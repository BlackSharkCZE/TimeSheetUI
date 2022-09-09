<template>

	<div class="input-container" @click="updateValue">
		<div :class="['checkbox',value===true ? 'checked' : '']">
			<div><font-awesome-icon icon="check"></font-awesome-icon></div>
		</div>
		<label :for="id">{{ label }}</label>
	</div>

</template>

<script>

let ID = 1

export default {
	name: 'BsCheckbox',
	props: {
		label: String,
		value: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			id: 'BSCHBOX_' + (ID++),
			focused: false,
			statusClass: '',
			errors: []
		}
	},
	mounted() {
		this.$emit('input', this.value)
	},
	updated() {
	},
	methods: {
		updateValue() {
			this.$nextTick(() => {
				this.$emit('input', !this.value)
			})
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

	label {
		margin-left: 0.5rem;
	}

	.flex-item {
		flex-grow: 1;
		padding: 0;
	}

	.checkbox {
		border: 0.1em solid $bs-gray;
		border-radius: 0;
		display: inline-block;
		width:1rem;
		height:$font-size;
		color: transparent;
		//color: white;
		transition: .2s;
		div {
			margin-left: 0.2rem;
			//margin-top: 0.1rem;*/
		}

		&.checked {
			background-color: $primary;
			border-color: $primary;
			color: $bs-white;
		}
	}
}
</style>
