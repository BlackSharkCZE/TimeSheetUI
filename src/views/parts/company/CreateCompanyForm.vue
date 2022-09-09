<template>
	<bs-form ref="bsFormRef">
		<div class="form">
			<div class="row">
				<div class="item">
					<bs-input ref="icInput" v-model="company.ic" :required="true" label="IČ" :button-callback="loadDataFromAres">
						<font-awesome-icon :icon="searchAresIcon" :spin="searchAresIcon==='spinner'"></font-awesome-icon>
					</bs-input>
				</div>
				<div class="item">
					<bs-input v-model="company.dic" label="DIČ"/>
				</div>
				<div class="item">
					<bs-input ref="nameInput" v-model="company.companyName" :required="true" label="Název společnosti"/>
				</div>
			</div>

			<div class="row">
				<div class="item">
					<bs-input ref="nazevObce" :required="true" v-model="company.nazevObce" label="Obec"/>
				</div>
				<div class="item">
					<bs-input ref="nazevCastiObce" :required="true" v-model="company.nazevCastiObce" label="Část obce"/>
				</div>
				<div class="item">
					<bs-input ref="nazevUlice" :required="true" v-model="company.nazevUlice" label="Ulice"/>
				</div>
				<div class="item">
					<bs-input ref="cisloDomovni" :required="true" v-model="company.cisloDomovni" label="Číslo domu"/>
				</div>
				<div class="item">
					<bs-input v-model="company.nazevOkresu" label="Název okresu"/>
				</div>
			</div>

			<div class="row">
				<div class="item">
					<bs-input ref="email" :required="true" v-model="company.email" label="e-mail"/>
				</div>
				<div class="item">
					<bs-input ref="phoneNumber" :required="true" v-model="company.phoneNumber" label="Telefonní číslo"/>
				</div>
				<div class="item">
					<bs-input ref="bankAccountNumber" :required="true" v-model="company.bankAccountNumber" label="Číslo účtu"/>
				</div>
			</div>
			<div class="row">
				<div class="item">
					<bs-checkbox v-model="company.vatPayer" label="Plátce DPH"/>
				</div>
				<div class="item">
					<bs-checkbox v-model="company.primary" label="Primární účet"/>
				</div>
			</div>
		</div>
	</bs-form>
</template>

<script>
import BsInput from '@/components/BsInput'
import { basicValidateForm } from '@/mixins/Common'
import { TimesheetAPI } from '@/services/TimesheetAPI'
import BsCheckbox from '@/components/BsCheckbox'
import BsForm from '@/components/BsForm'

export default {
	mixins: [basicValidateForm],
	name: 'CreateCompanyForm',
	components: {
		BsForm,
		BsCheckbox,
		BsInput
	},
	emits: ['ItemCreated', 'ItemError'],
	data() {
		return {
			errors: [],
			searchAresIcon: 'search',
			company: {
				ic: '71857001',
				companyName: '',
				dic: '',
				nazevOkresu: '',
				nazevObce: '',
				nazevCastiObce: '',
				nazevUlice: '',
				cisloDomovni: '',
				psc: '',
				email: '',
				phoneNumber: '',
				bankAccountNumber: '',
				vatPayer: false,
				primary: false
			}
		}
	},
	methods: {
		validateForm() {
			return this.$refs.bsFormRef.validate()
		},
		resetFormStatus() {
			return this.$refs.bsFormRef.resetFormStatus()
		},
		loadDataFromAres(value) {
			this.searchAresIcon = 'spinner'
			TimesheetAPI.company.findInAres(value).then(company => {
				this.company.companyName = company.companyName
				this.company.nazevUlice = company.ulice
				this.company.nazevOkresu = company.okres
				this.company.nazevObce = company.obec
				this.company.nazevCastiObce = company.castObce
				this.company.nazevUlice = company.ulice
				this.company.cisloDomovni = company.cisloDomu
				this.company.psc = company.psc
				this.company.dic = company.dic
				this.company.vatPayer = company.dic !== null
				this.searchAresIcon = 'search'
			}).catch(e => {
				this.searchAresIcon = 'search'
				console.error(e)
			})
		},
		save() {
			const _data = {
				ic: this.company.ic,
				companyName: this.company.companyName,
				dic: this.company.dic,
				okres: this.company.nazevOkresu,
				obec: this.company.nazevObce,
				castObce: this.company.nazevCastiObce,
				ulice: this.company.nazevUlice,
				cisloDomu: this.company.cisloDomovni,
				ps: this.company.psc,
				email: this.company.email,
				phoneNumber: this.company.phoneNumber,
				bankAccountNumber: this.company.bankAccountNumber,
				platceDph: this.company.vatPayer,
				primaryAccount: this.company.primary
			}

			TimesheetAPI.company.save(_data)
			            .then(response => response.json()
			                                      .then(data => {
				                                      this.$emit('ItemCreated', data)
			                                      }))
			            .catch(exc => {
				            console.error(exc)
				            this.$refs.bsFormRef.errors.push('Save: Can not save data! ' + exc.message)
				            this.$emit('ItemError', exc)
			            })
		}
	}
}
</script>

<style scoped lang="scss">
.row {
	display: flex;
	flex-direction: row;

	.item {
		padding: 0.3rem;
	}
}

</style>
