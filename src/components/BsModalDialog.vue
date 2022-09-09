<template>
	<div class="modal-dialog-wrapper" ref="modalDialog">
		<div class="modal-focus" v-if="isVisible">
		</div>
		<transition name="fade" @after-enter="$refs.modalDialog.focus()" v-on:after-leave="processHideCallback">
			<div class="modal" v-show="isVisible">
				<div class="header">{{ label }}</div>
				<div class="body">
					<div class="content">
						<slot name="content"></slot>
					</div>
				</div>
				<div class="footer">
					<div class="content">
						<slot name="footer">
							<input type="button" class="bs-button" @click="closeButtonClick()" value="Close"/>
						</slot>
					</div>
				</div>
			</div>
		</transition>
	</div>

</template>

<script>
export default {
	name: 'BsModalDialog',
	props: {
		label: String,
		cancelFunc: Function,
		okFunc: Function
	},
	data() {
		return {
			isVisible: false,
			hideCallBack: null
		}
	},
	mounted() {
		window.addEventListener('keyup', event => {
			if (event.key === 'Escape' && this.isVisible) {
				event.preventDefault()
				this.closeButtonClick()
			}
		})
	},
	methods: {
		processHideCallback() {
			if (this.hideCallBack) {
				this.hideCallBack()
				this.hideCallBack = null
			}
		},
		handleKeyPress(event) {
		},
		closeButtonClick() {
			if (this.$props.cancelFunc !== undefined && this.$props.cancelFunc !== null) {
				this.$props.cancelFunc()
			}
			this.isVisible = false
		},
		display() {
			this.$refs.modalDialog.focus()
			this.isVisible = true
		},
		hide(callback) {
			if (callback && typeof callback === 'function') {
				this.hideCallBack = callback
			}
			this.isVisible = false
		}
	}
}
</script>

<style lang="scss" scoped>
$body-padding: 0.2em;
$modal-dialog-body-color: #2b2b2b;
$modal-dialog-base-color: #393b3d;
$modal-dialog-header-color: #292f34;
$modal-text-color: #A8A8A8;

.modal-dialog-wrapper {
	.fade-enter-active, .fade-leave-active {
		transition: opacity .5s;
	}

	.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
	{
		opacity: 0;
	}
}

.modal {
	border: 1px solid black;
	/* background-color: #2b2b2b; */
	background-color: $modal-dialog-base-color;
	min-width: 300px;
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	z-index: 2;
	-webkit-box-shadow: 5px 5px 15px -4px #000000;
	box-shadow: 5px 5px 15px -4px #000000;

	.header {
		background-color: $modal-dialog-header-color;
		color: $modal-text-color;
		padding: 0.1em 0.2em;
		font-size: 1.1em;
		border-bottom: 1px solid #202529;
	}

	.body {
		padding: $body-padding;

		.content {
			font-size: 0.9em;
			color: $modal-text-color;
			padding: $body-padding 0.2em 1em $body-padding;
			background-color: $modal-dialog-body-color;
		}
	}

	.footer {
		padding: 0 $body-padding 0.3em $body-padding;

		.content {
			//float: right;
			padding: $body-padding;
			text-align: right;
		}
	}
}

.modal-focus {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	margin: 0;
	padding: 0;
	z-index: 1;
	background-color: rgba(0, 0, 0, 0.7);
	backdrop-filter: blur(2px);
}

.bs-button {
	border: 1px solid #5f6161;
	color: #8aacaf;
	background-color: #4d5153;
	padding: 0.2em 0.4em;
}
</style>
