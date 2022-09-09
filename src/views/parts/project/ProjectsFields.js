const ProjectTableFields = [
	{
		label: 'Název',
		key: 'name',
		thClass: 'w120',
		filter: {
			comparator: 'like'
		}
	},
	{
		label: 'Společnost',
		key: 'companyName',
		thClass: 'w120',
		filter: {
			comparator: 'like'
		}
	},
	{
		label: 'Root Project ID',
		key: 'rootProjectId',
		thClass: 'w80',
		filter: {
			comparator: 'like'
		}
	},
	{
		label: 'Project ID',
		key: 'projectId',
		thClass: 'w80',
		filter: {
			comparator: 'like'
		}
	},
	{
		label: 'Ticket Key',
		key: 'key',
		thClass: 'w80',
		filter: {
			comparator: 'like'
		}
	},
	{
		label: 'Remote Writers',
		key: 'remoteWriterList',
		thClass: 'w120',
		filter: {
			comparator: 'like'
		}
	}

]

export default ProjectTableFields
