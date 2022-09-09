// eslint-disable-next-line no-unused-vars
const postInit = (body) => {
	return {
		type: 'cors',
		method: 'post',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json'
		},
		body: JSON.stringify(body)
	}
}

const graphAddr = process.env.VUE_APP_SERVER_URL + '/graphql'
const graphQuery = (query, params) => {
	return fetch(graphAddr, {
		method: 'POST',
		headers: {
			'Content-Type': 'applicaton/json',
			Accept: 'application/json'
		},
		body: JSON.stringify(
			{
				query,
				variables: params
			}
		)
	}).then(r => r.json())
}

const TimesheetGraph = {
	remoteWriters: {
		getAll() {
			const query = 'query { allConfigs { id,projectRootId,projectId,keyPattern } }'
			return graphQuery(query, {})
		}
	},
	projects: {
		allGemTsProjects() {
			const query = 'query { allProjects { key,parentId,text,projects { parentId, text, key}}}'
			return graphQuery(query, {})
		}
	},
	dashboard: {
		dashboardData(date) {
			const query = 'query dashboard($date: Date) {dashboard(date: $date) {workTimeDashboard {date, hoursDone, hoursInMonth}, projectReportList{projectName, workTimeOnProject}}}'
			return fetch(graphAddr, {
				method: 'POST',
				headers: {
					'Content-Type': 'applicaton/json',
					Accept: 'application/json'
				},
				body: JSON.stringify(
					{
						query,
						variables: { date }
					}
				)
			}).then(r => r.json())
		}
	},
	todo: {
		allTodos() {
			const query = 'query { allTodo{id, done, todo, created} }'
			return graphQuery(query, {})
		},
		markDone(itemId) {
			const query = 'mutation markDonw($id: BigInteger!) { markDone(id: $id) {id, todo, created, done }}'
			return graphQuery(query, { id: itemId })
		},
		save(item) {
			const query = 'mutation createTodo($todo: TodoEntityInput) { createTodo(todo: $todo) { id, todo, created, done }}'
			return graphQuery(query, { todo: item })
		},
		delete(itemId) {
			const query = 'mutation delete($id: BigInteger!) { delete(id: $id) }'
			return graphQuery(query, { id: itemId })
		}
	}
}
export { TimesheetGraph }
