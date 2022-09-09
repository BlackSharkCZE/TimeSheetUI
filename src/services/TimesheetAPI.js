// eslint-disable-next-line no-unused-vars

const getInit = () => {
	return {
		type: 'cors',
		method: 'GET'
	}
}

// eslint-disable-next-line no-unused-vars
const getDelete = () => {
	return {
		type: 'cors',
		method: 'DELETE'
	}
}

// eslint-disable-next-line no-unused-vars
const deleteInit = () => {
	return {
		type: 'cors',
		method: 'DELETE'
	}
}

// eslint-disable-next-line no-unused-vars
const patchInit = () => {
	return {
		type: 'cors',
		method: 'PATCH'
	}
}

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

// eslint-disable-next-line no-unused-vars
const postForm = (formData) => {
	return {
		type: 'cors',
		method: 'post',
		body: formData
	}
}

// eslint-disable-next-line no-unused-vars
const putInit = (body) => {
	return {
		type: 'cors',
		method: 'put',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json'
		},
		body: JSON.stringify(body)
	}
}

const TimesheetAPI = {
	company: {
		findInAres(ico) {
			return fetch(process.env.VUE_APP_SERVER_URL + '/ares/' + ico,
				getInit()).then(res => res.json())
		},
		list() {
			return fetch(process.env.VUE_APP_SERVER_URL + '/company/all',
				getInit()).then(res => res.json())
		},
		save(_data) {
			return fetch(process.env.VUE_APP_SERVER_URL + '/company',
				postInit(_data))
		}
	},
	requisition: {
		save(formData) {
			return fetch(process.env.VUE_APP_SERVER_URL + '/requisition',
				postForm(formData))
		}
	},
	todo: {
		delete(itemID) {
			return fetch(
				process.env.VUE_APP_SERVER_URL + '/todo/' + itemID,
				getDelete()).then(res => res.json())
		},
		all() {
			return fetch(
				process.env.VUE_APP_SERVER_URL + '/todo/',
				getInit()).then(res => res.json())
		},
		save(_data) {
			return fetch(process.env.VUE_APP_SERVER_URL + '/todo',
				postInit(_data)).then(res => res.json())
		},
		done(itemID) {
			return fetch(
				process.env.VUE_APP_SERVER_URL + '/todo/' + itemID + '/done',
				patchInit()).then(res => res.json())
		},
		undone(itemID) {
			return fetch(
				process.env.VUE_APP_SERVER_URL + '/todo/' + itemID + '/undone',
				patchInit()).then(res => res.json())
		}
	},
	timeline: {
		delete(itemID) {
			return fetch(
				process.env.VUE_APP_SERVER_URL + '/timeline/' + itemID,
				getDelete()).then(res => res.json())
		},
		isOverlap(fromTime, toTime) {
			return fetch(
				process.env.VUE_APP_SERVER_URL + '/timeline/time-overlap/' + fromTime +
				'/' + toTime,
				getInit()).then(res => res.json())
		},
		get(timelineID) {
			return fetch(process.env.VUE_APP_SERVER_URL + '/timeline/' + timelineID,
				getInit()).then(res => res.json())
		},
		all() {
			return fetch(
				process.env.VUE_APP_SERVER_URL + '/timeline/all?from=2019-01-01',
				getInit()).then(res => res.json())
		},
		byInterval(fromDate, toDate, pageSize, currentPage) {
			return fetch(
				process.env.VUE_APP_SERVER_URL + '/timeline/all?from=' + fromDate +
				'&to=' + toDate + '&pageSize=' + pageSize + '&page=' + currentPage,
				getInit()).then(res => res.json())
		},
		workTime(fromDate, toDate, company) {
			let _c = ''
			if (company !== undefined && company !== null) {
				_c = '&company=' + company
			}

			return fetch(
				process.env.VUE_APP_SERVER_URL + '/timeline/work-time?from=' +
				fromDate + '&to=' + toDate + _c, getInit()).then(
				res => res.json())
		},
		earning(fromDate, toDate) {
			return fetch(
				process.env.VUE_APP_SERVER_URL + '/timeline/earning?from=' + fromDate +
				'&to=' + toDate, getInit()).then(res => res.json())
		},
		save(_data) {
			return fetch(process.env.VUE_APP_SERVER_URL + '/timeline',
				postInit(_data)).then(res => res.json())
		},
		update(_data) {
			return fetch(process.env.VUE_APP_SERVER_URL + '/timeline',
				putInit(_data)).then(res => res.json())
		},
		dailyEarning(day) {
			return fetch(
				process.env.VUE_APP_SERVER_URL + '/timeline/daily-earning?day=' + day,
				getInit()).then(res => res.json())
		},
		remoteWrite(timelineId) {
			/*
			return Promise.resolve({
				success: true,
				message: null,
				data: {
					GEM_TIMESHEET: {
						success: false,
						message: 'This is error messge for GEM_TIMESHEET'
					},
					DRMAX_JIRA: {
						success: true
					}
				}
			})
			*/
			return fetch(process.env.VUE_APP_SERVER_URL + '/timeline/remote-write/' + timelineId,
				postInit({})).then(res => res.json())
		}
	},
	report: {
		minYear() {
			return fetch(
				process.env.VUE_APP_SERVER_URL + '/report/min-year-in-timeline',
				getInit())
		},
		maxTimeOnDay(day) {
			return fetch(
				process.env.VUE_APP_SERVER_URL + '/report/day-max-time?date=' + day,
				getInit())
		}
	},
	project: {
		list() {
			return fetch(process.env.VUE_APP_SERVER_URL + '/project/all',
				getInit()).then(res => res.json())
		},
		save(_data) {
			return fetch(process.env.VUE_APP_SERVER_URL + '/project',
				postInit(_data))
		},
		remoteWriterList() {
			return fetch(process.env.VUE_APP_SERVER_URL + '/project/remote-writer-list',
				getInit()).then(res => res.json())
		}
	},
	dph: {
		downloadDphBulk(month, companyID) {
			return fetch(
				process.env.VUE_APP_SERVER_URL + '/dph/download/' + month + '/' +
				companyID).then(
				res => res.blob()).then(blob => {
				const objectURL = URL.createObjectURL(blob)
				const link = document.createElement('a')
				link.href = objectURL
				link.download = month + '-' + companyID + '.zip'
				document.body.appendChild(link)
				link.dispatchEvent(new MouseEvent('click', {
					bubbles: true,
					cancelable: true,
					view: window
				}))
				link.remove()
				window.URL.revokeObjectURL(link.href)
			})
		}
	},
	invoice: {
		upload(formData) {
			return fetch(process.env.VUE_APP_SERVER_URL + '/invoice/upload',
				postForm(formData))
		},
		downloadPDF(id, number) {
			return fetch(
				process.env.VUE_APP_SERVER_URL + '/invoice/' + id + '/pdf').then(
				res => res.blob()).then(blob => {
				const objectURL = URL.createObjectURL(blob)
				const link = document.createElement('a')
				link.href = objectURL
				link.download = number + '.pdf'
				document.body.appendChild(link)
				link.dispatchEvent(new MouseEvent('click', {
					bubbles: true,
					cancelable: true,
					view: window
				}))
				link.remove()
				window.URL.revokeObjectURL(link.href)
			})
		},
		detail(invoiceID) {
			return fetch(
				process.env.VUE_APP_SERVER_URL + '/invoice/' + invoiceID).then(
				res => res.json())
		},
		addInvoiceItem(invoiceID, data) {
			return fetch(
				process.env.VUE_APP_SERVER_URL + '/invoice/detail/' + invoiceID +
				'/add-item', postInit(data))
		},
		deleteInvoiceItem(invoiceID, itemID) {
			return fetch(
				process.env.VUE_APP_SERVER_URL + '/invoice/detail/' + invoiceID +
				'/delete-item/' + itemID, deleteInit())
		},
		getAll() {
			return fetch(process.env.VUE_APP_SERVER_URL + '/invoice').then(
				res => res.json())
		},
		summaryPreview(from, to, companyID) {
			return fetch(
				process.env.VUE_APP_SERVER_URL + '/invoice/summary-preview?from=' +
				from + '&to=' + to + '&companyID=' + companyID, getInit()).then(
				res => res.json())
		},
		generateInvoice(from, to, companyID) {
			return fetch(
				process.env.VUE_APP_SERVER_URL + '/invoice/generate?from=' + from +
				'&to=' + to + '&companyID=' + companyID, getInit()).then(
				res => res.json())
		}
	},
	jira: {
		witeDrMaxJIRA(timeline) {
			return fetch(
				process.env.VUE_APP_SERVER_URL + '/jira/write?timelineID=' + timeline,
				putInit()).then(res => res.json())
		}
	}
}
export { TimesheetAPI }
