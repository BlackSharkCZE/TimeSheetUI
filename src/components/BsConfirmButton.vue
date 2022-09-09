<template>

	<div class="confirmButton">

		<div type="button" class="button" @click="process">
			<slot name="button-content">Odstranit</slot>
		</div>

		<bs-modal-dialog ref="modalDialog" :label="label">
			<template slot="content">
				<slot name="dialog-content" v-bind="item">Opravdu chcete pložku odstranit?</slot>
			</template>
			<template slot="footer">
				<input type="button" class="bs-button" @click="confirm" value="Ano"/>
				<input type="button" class="bs-button success" @click="cancel" value="Ne"/>
			</template>
		</bs-modal-dialog>
	</div>
</template>

<script>
import BsModalDialog from '@/components/BsModalDialog'

export default {
	name: 'BsConfirmButton',
	components: { BsModalDialog },
	props: {
		confirmFunction: {
			type: Function,
			required: true
		},
		cancelFunction: {
			type: Function,
			required: true
		},
		item: {
			type: Object,
			required: true
		},
		label: {
			type: String,
			default: 'Odstranění položky'
		}
	},
	methods: {
		process() {
			this.$refs.modalDialog.display()
		},
		cancel() {
			this.$refs.modalDialog.hide(() => this.cancelFunction(this.item))
		},
		confirm() {
			this.$refs.modalDialog.hide(() => {
				this.confirmFunction(this.item)
			})
		}
	}
}
</script>

<style scoped>

</style>
