const InvoiceTableFields = [
	{
		label: 'Číslo',
		key: 'number',
		thClass: 'w40',
		tdClass: 'w40',
		filter: {
			comparator: 'like'
		}
	},
	{
		label: 'Vydáno',
		key: 'issueDate',
		thClass: 'w40',
		format: 'DD.MM.YYYY'
	},
	{
		label: 'Dat. usk. daň.',
		key: 'vatPaymentDate',
		thClass: 'w40',
		format: 'DD.MM.YYYY',
		filter: {
			type: 'date',
			comparator: 'between',
			column: 'vatPaymentDate'
		}
	},
	{
		label: 'Vydal',
		key: 'issuerCompany',
		thClass: 'w120',
		filter: {
			comparator: 'like',
			childKey: 'id'
		}
	},
	{
		label: 'Plátce',
		key: 'recipientCompany',
		thClass: 'w80'
	},
	{
		label: 'Splatnost',
		key: 'paymentDate',
		format: 'DD.MM.YYYY',
		thClass: 'w40'
	},
	{
		label: 'Částka',
		key: 'price',
		thClass: 'w40',
		tdClass: 'text-align-right'
	},
	{
		label: 'Částka s DPH',
		key: 'priceWithVat',
		thClass: 'w40',
		tdClass: 'text-align-right'
	},
	{
		label: '#',
		key: 'buttons',
		thClass: 'w40',
		tdClass: 'text-align-right'
	}
]

export default InvoiceTableFields
