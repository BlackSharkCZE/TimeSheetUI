<template>
	<div class="bs-form">
		<slot></slot>
		<transition name="fade">
			<div class="error-container" v-if="errors.length>0">
				<div class="error-item">
					<font-awesome-icon icon="exclamation-triangle"/>
				</div>
				<div class="error-item" v-for="(error, index) in errors" v-bind:key="index">{{ error }}</div>
			</div>
		</transition>
	</div>
</template>

<script>

export default {
	name: 'BsForm',
	data() {
		return {
			errors: []
		}
	},
	mounted() {
	},
	updated() {
	},
	methods: {
		resetFormStatus() {
			this.errors = []
		},
		validate() {
			this.errors = []
			if (this.$slots.default[0].context.$refs) {
				const refs = this.$slots.default[0].context.$refs
				const keys = Object.keys(refs)
				for (let i = 0; i < keys.length; i++) {
					const ref = refs[keys[i]]
					if (typeof ref.validate === 'function' && ref.$vnode.componentOptions.tag !== 'bs-form') {
						ref.validate()
						if (typeof ref.isValid === 'function') {
							if (ref.isValid() === false) {
								this.errors.push(ref.$props.label + ': ' + ref.getErrors())
							} else {
							}
						}
					}
				}
			}
			return this.errors.length === 0
		}
	}
}
</script>

<style scoped lang="scss">
</style>
