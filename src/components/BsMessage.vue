<template>
	<transition name="fade">
		<div class="bs-message" v-show="visible">
			<div :class="['content',error ? 'error' : '']">
				<font-awesome-icon icon="info-circle" v-if="!error"></font-awesome-icon>
				<font-awesome-icon icon="exclamation-triangle" v-if="error"></font-awesome-icon>
				{{ message }}
			</div>
		</div>
	</transition>
</template>

<script>
export default {
	name: 'BsMessage',
	props: {
		autohide: {
			type: Boolean,
			default: true
		},
		hideTimeout: {
			type: Number,
			default: 2000
		}
	},
	data() {
		return {
			message: null,
			error: false,
			visible: false
		}
	},
	methods: {
		hide() {
			this.message = null
			this.visible = false
		},
		showMessage(msg, autohide) {
			this.message = msg
			this.error = false
			this.visible = true
			this.initializeHide(autohide === undefined ? this.autohide : autohide)
		},
		showError(msg, autohide) {
			this.message = msg
			this.error = true
			this.visible = true
			this.initializeHide(autohide === undefined ? this.autohide : autohide)
		},
		initializeHide(hide) {
			if (hide === true) {
				setTimeout(() => {
					this.hide()
				}, this.hideTimeout)
			}
		}
	}
}
</script>

<style scoped lang="scss">

.fade-enter-active, .fade-leave-active {
	transition: opacity .5s;
}

.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
{
	opacity: 0;
}

</style>
