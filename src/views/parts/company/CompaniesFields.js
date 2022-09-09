const CompaniesTableFields = [
	{
		label: 'Primární',
		key: 'primary',
		thClass: 'w40',
		tdClass: 'text-align-center'
	},
	{
		label: 'Název',
		key: 'companyName',
		thClass: 'w120',
		filter: {
			comparator: 'like'
		}
	},
	{
		label: 'IČ',
		key: 'ic',
		thClass: 'w80',
		filter: {
			comparator: 'like'
		}
	},
	{
		label: 'DIČ',
		key: 'dic',
		thClass: 'w80',
		filter: {
			comparator: 'like'
		}
	},
	{
		label: 'email',
		key: 'email',
		thClass: 'w120',
		filter: {
			comparator: 'like'
		}
	},
	{
		label: 'Plátce DPH',
		key: 'platceDph',
		thClass: 'w40',
		tdClass: 'text-align-center'
	}
]

export default CompaniesTableFields
