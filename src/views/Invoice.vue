<template>
	<div class="simple-content border">

		<div class="invoice-detail-container" v-if="invoice">
			<div class="header">
				<h2>Faktura č: {{ invoice.number }}
					<div class="button" style="display: inline-block">
						<font-awesome-icon icon="download" class="fa-click" v-on:click="downloadInvoice(invoice)"/>
					</div>
				</h2>
				<h2 class="text-align-right">
					<div class="button" style="display: inline-block">
						<font-awesome-icon icon="backward" class="fa-click" v-on:click="$router.go(-1)"/>
					</div>
				</h2>
			</div>
			<div class="row">
				<div class="col">
					<bs-display-item label="Datum vystavení">{{ invoice.issueDate | asDate }}</bs-display-item>
				</div>
				<div class="col">
					<bs-display-item label="Datum splatnosti">{{ invoice.paymentDate | asDate }}</bs-display-item>
				</div>
				<div class="col">
					<bs-display-item label="Datum uskutečení daňového plnění">{{ invoice.vatPaymentDate | asDate }}</bs-display-item>
				</div>
			</div>
			<div class="invoice-header">
				<div class="row">
					<div class="col-grow">
						<company-box label="Vystavil" :company="invoice.issuerCompany"></company-box>
					</div>
					<div class="col-grow">
						<company-box label="Příjemce" :company="invoice.recipientCompany"></company-box>
					</div>
				</div>
			</div>
			<div class="items">
				<table class="data-table">
					<thead>
					<tr>
						<th class="label" style="width: 48px;">No.</th>
						<th class="label" style="width: 12rem;">Objednávka</th>
						<th class="label">Popis</th>
						<th class="label" style="width: 6rem;">Cena</th>
						<th class="label" style="width: 6rem;">Celková cena</th>
						<th class="label" style="width: 48px;">#</th>
					</tr>
					</thead>
					<tbody>
					<tr v-for="(item, index) of invoice.items" v-bind:key="item.id">
						<td>{{ index + 1 }}</td>
						<td>{{ getCustomerNumber(item) }}</td>
						<td>{{ getNote(item) }}</td>
						<td class="number">{{ item.price }}</td>
						<td class="number">{{ item.totalPrice }}</td>
						<td class="buttons">
							<bs-confirm-button
									:label="'Odstranění položky No.' + (index+1)"
									:item="item"
									:cancel-function="cancelDelete"
									:confirm-function="processDelete">
								<template slot="button-content">
									<font-awesome-icon icon="trash" class="fa-click"></font-awesome-icon>
								</template>
								<template v-slot:dialog-content="item">
									Opravdu chcete položku <strong>{{ item.note }}</strong> odstranit?
								</template>
							</bs-confirm-button>

						</td>
					</tr>
					</tbody>
					<tfoot>
					<td></td>
					<td>Přidat nový záznam:</td>
					<td><input type="text" class="input text" placeholder="Popis" v-model="newItem.description"/></td>
					<td><input type="number" class="input number" placeholder="Cena" v-model="newItem.price"/></td>
					<td><input type="number" class="input number" placeholder="Sazba DPH" v-model="newItem.vatRate"/></td>
					<td class="text-align-right" style="padding-right: 4px;">
						<font-awesome-icon
								v-if="newItem.price && newItem.description && newItem.vatRate"
								icon="save"
								class="fa-click"
								@click="addNewItem">
						</font-awesome-icon>
					</td>
					</tfoot>
				</table>
			</div>
		</div>
		<bs-modal-dialog ref="ConfirmInvoiceLineDelete" label="Odstranění záznamu">
			<template v-slot:content>
				Odstranění řádku: {{ row }}
			</template>

			<template v-slot:footer>
				<input type="button" class="bs-button" @click="cancelDelete" value="Close"/>
				<input type="button" class="bs-button success" @click="processDelete" value="Delete"/>
			</template>
		</bs-modal-dialog>
	</div>
</template>

<script>

import { TimesheetAPI } from '@/services/TimesheetAPI'
import BsDisplayItem from '@/components/BsDisplayItem'
import CompanyBox from '@/views/parts/company/CompanyBox'
import BsModalDialog from '@/components/BsModalDialog'
import BsConfirmButton from '@/components/BsConfirmButton'

export default {
	name: 'Invoice',
	components: {
		CompanyBox,
		BsDisplayItem,
		BsModalDialog,
		BsConfirmButton
	},
	data() {
		return {
			invoice: null,
			row: null,
			newItem: {
				description: null,
				price: null,
				vatRate: null
			}
		}
	},
	mounted() {
		this.reloadInvoice()
	},
	methods: {
		addNewItem() {
			const vatRate = this.newItem.vatRate / 100 + 1.0
			const data = {
				description: this.newItem.description,
				price: this.newItem.price,
				id: null,
				vatRate: vatRate.toFixed(2),
				vatAmount: (this.newItem.price * vatRate - this.newItem.price).toFixed(2),
				priceWithVat: (this.newItem.price * vatRate).toFixed(2)
			}
			TimesheetAPI.invoice.addInvoiceItem(this.invoice.id, data).then(response => {
				if (response.status === 201) {
					this.reloadInvoice()
				} else {
					this.dispalyError('Can not add invoice item to invoice!', response)
				}
			})
		},
		dispalyError() {
			let message = ''
			for (let i = 0; i < arguments.length; i++) {
				message += ' ' + arguments[i]
			}
			console.error(message)
		},
		processDelete(item) {
			for (let i = 0; i < this.invoice.items.length; i++) {
				if (this.invoice.items[i].id === item.id) {
					this.invoice.items.splice(i, 1)
					break
				}
			}
			TimesheetAPI.invoice.deleteInvoiceItem(this.invoice.number, item.id)
			            .then(response => {
				            if (response.status === 200) {
					            this.reloadInvoice()
				            }
			            })
			            .catch(ex => {
				            this.dispalyError('Can not delete item ', item.id, ex)
			            })
		},
		cancelDelete(item) {
		},
		reloadInvoice() {
			if (!this.$route.params.id) {
				this.invoice = this.$store.state.currentInvoice
			} else {
				TimesheetAPI.invoice.detail(this.$route.params.id).then(i => {
					this.invoice = i
				})
			}
		},
		getNote(item) {
			if (item.requisition) {
				return item.requisition.note
			} else {
				return item.note
			}
		},
		getCustomerNumber(item) {
			if (item.requisition) {
				return item.requisition.customerNumber
			} else {
				return 'n/a'
			}
		},
		downloadInvoice(item) {
			TimesheetAPI.invoice.downloadPDF(item.id, item.number)
		}
	}
}
</script>

<style scoped lang="scss">
</style>
