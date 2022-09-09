const TimelineTableFields = [

	{
		label: 'Den',
		key: 'day',
		thClass: 'w80'
	},
	{
		label: 'Datum',
		key: 'date',
		filter: {
			type: 'date',
			comparator: 'between',
			column: 'fromTime'
		},
		thClass: 'w120'
	},
	{
		label: 'Od',
		key: 'fromTime',
		format: 'HH:mm',
		thClass: 'w80'
	},
	{
		label: 'Do',
		key: 'toTime',
		format: 'HH:mm  ',
		thClass: 'w80'
	},
	{
		label: 'Pauza',
		key: 'pause',
		thClass: 'w80',
		tdClass: 'text-align-right'
	},
	{
		label: 'Odpracováno',
		key: 'workTime',
		thClass: 'w80'
	},
	{
		label: 'Projekt',
		key: 'projectEntity',
		thClass: 'w80',
		filter: {
			comparator: 'like',
			childKey: 'name'
		}
	},
	{
		label: 'Poznámka',
		key: 'note',
		filter: {
			comparator: 'like'
		}
	},
	{
		label: 'Vzdálený zápis',
		key: 'remoteWriters',
		thClass: 'w260'
	},
	{
		label: '#',
		key: 'NotExistingKey',
		thClass: 'w120',
		tdClass: 'text-align-center'
	}
]

export default TimelineTableFields
