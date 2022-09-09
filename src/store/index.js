import Vue from 'vue'
import Vuex from 'vuex'

import { TimesheetAPI } from '@/services/TimesheetAPI'
import { Toolbox } from '@/services/Toolbox'
import moment from 'moment/moment'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		allProjects: [],
		mostInterestProject: null,
		loadingProjectStatus: 'loading',
		earning: 0,
		workTime: '00:00',
		dailyWorkTime: '00:00',
		month: null,
		currentTimeLine: null,
		currentInvoice: null,
		companies: null,
		filterSummary: null
	},
	mutations: {
		SET_FILTER_SUMMARY(state, summary) {
			state.filterSummary = summary
		},
		SET_ALL_COMPANIES(state, companies) {
			state.companies = companies
		},
		SET_INVOICE(state, invoice) {
			state.currentInvoice = invoice
		},
		SET_ALL_PROJECT(state, projectList) {
			state.allProjects = projectList
		},
		SET_LOADING_PROJECT_STATUS(state, status) {
			state.loadingProjectStatus = status
		},
		SET_MOST_INTEREST_PROJRCT(state, project) {
			state.mostInterestProject = project
		},
		SET_EARNING(state, earning) {
			state.earning = earning
		},
		SET_WORKTIME(state, workTime) {
			state.workTime = workTime
		},
		SET_MONTH(state, month) {
			state.month = month
		},
		SET_DAILY_WORKTIME(state, workTime) {
			state.dailyWorkTime = workTime
		},
		SET_CURRENT_TIMELINE(state, timeline) {
			state.currentTimeLine = timeline
		}
	},
	actions: {
		setFilterSummary(context, summary) {
			context.commit('SET_FILTER_SUMMARY', summary)
		},
		setCurrentTimeline(context, timeline) {
			context.commit('SET_CURRENT_TIMELINE', timeline)
		},
		fetchProjects(context) {
			context.commit('SET_LOADING_PROJECT_STATUS', 'loading')
			TimesheetAPI.project.list().then(json => {
				context.commit('SET_ALL_PROJECT', json)
				context.commit('SET_MOST_INTEREST_PROJRCT', json[0])
				context.commit('SET_LOADING_PROJECT_STATUS', 'notLoading')
			}).catch(ex => {
				context.commit('SET_LOADING_PROJECT_STATUS', 'loadingError')
			})
		},
		async fetchCompanies(context) {
			await TimesheetAPI.company.list().then(
				data => context.commit('SET_ALL_COMPANIES', data))
		},
		loadEarning(context, data) {
			TimesheetAPI.timeline.earning(data.fromDate, data.toDate).then(json => {
				const earningSum = json.reduce((curr, acc) => {
					if (data.company === undefined || data.company === null ||
						data.company === acc.companyID) {
						return acc.earning + curr
					} else {
						return curr
					}
				}, 0)
				context.commit('SET_EARNING', earningSum)
			})
		},
		loadWorkTime(context, data) {
			TimesheetAPI.timeline.workTime(data.fromDate, data.toDate, data.company).then(json => {
				context.commit('SET_WORKTIME', Toolbox.formatTime(json.value))
			})
		},
		loadMonth(context, data) {
			context.commit('SET_MONTH',
				moment(data.fromDate, 'YYYY-MM-DD').format('YYYY-MM'))
		},
		loadReport(context, data) {
			context.dispatch('loadMonth', data)
			context.dispatch('loadWorkTime', data)
			context.dispatch('loadEarning', data)
		},
		loadCurrentReport(context) {
			const momentDate = moment()
			const _fromDate = momentDate.startOf('month').format('YYYY-MM-DD')
			const _toDate = momentDate.endOf('month').format('YYYY-MM-DD')
			context.dispatch('loadReport', {
				fromDate: _fromDate,
				toDate: _toDate
			})
			context.dispatch('loadDailyWorkTime')
		},
		loadDailyWorkTime(context, data) {
			let companyID = null
			if (data !== undefined && data !== null && data.companyID !== null) {
				companyID = data.companyID
			}
			const now = moment()
			TimesheetAPI.timeline.workTime(now.format('YYYY-MM-DD'),
				now.add(1, 'days').format('YYYY-MM-DD'), companyID).then(json => {
				context.commit('SET_DAILY_WORKTIME', Toolbox.formatTime(json.value))
			})
		},
		setCurrentInvoice(context, invoice) {
			context.commit('SET_INVOICE', invoice)
		}
	},
	getters: {
		getFilterSummary(state) {
			return state.filterSummary
		},
		getAllProjects(state) {
			return state.allProjects
		},
		getProjectById: (state) => (id) => {
			return state.allProjects.filter(item => item.id === id)[0]
		},
		getMostInterestedProject(state) {
			return state.mostInterestProject
		},
		getAllCompanies(state) {
			return state.companies
		},
		getPrefferedCompany(state) {
			if (state.companies !== null && state.companies.length > 0) {
				return state.companies.filter(item => item.ic === '27189929')[0]
			} else {
				return null
			}
		}
	},
	modules: {}
})
