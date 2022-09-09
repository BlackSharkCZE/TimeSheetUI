import Vue from 'vue'
import VueRouter from 'vue-router'

import Timesheet from '@/views/Timesheet'
import Invoices from '@/views/Invoices'
import Invoice from '@/views/Invoice'
import Config from '@/views/Config'
import Companies from '@/views/config/Companies'
import Orders from '@/views/config/Orders'
import Projects from '@/views/config/Projects'
import InvoicesOverview from '@/views/parts/invoice/InvoicesOverview'
import UploadInvoice from '@/views/UploadInvoice'

import moment from 'moment'
import DphLayout from '@/views/parts/dph/DphLayout'
import DphOverview from '@/views/parts/dph/DphOverview'
import Dashboard from '@/views/Dashboard'
import Lab from '@/views/labs/Lab'
import Todo from '@/views/Todo'
import RemoteWriters from '@/views/config/RemoteWriters'

Vue.use(VueRouter)

const routes = [
	{
		path: '/',
		name: 'Root',
		redirect: '/timesheet'
	},
	{
		path: '/lab',
		name: 'lab',
		component: Lab
	},
	{
		path: '/todo',
		name: 'todo',
		component: Todo
	},
	{
		path: '/timesheet',
		name: 'Timesheet',
		component: Timesheet
	},
	{
		path: '/invoices',
		component: Invoices,
		children: [
			{
				path: '',
				redirect: 'overivew'
			},
			{
				path: 'overivew',
				component: InvoicesOverview
			},
			{
				name: 'uploadInvoice',
				path: 'upload',
				component: UploadInvoice
			}
		]
	},
	{
		path: '/invoice/:id?',
		name: 'Invoice',
		component: Invoice
	},
	{
		path: '/dph',
		component: DphLayout,
		children: [
			{
				path: '',
				redirect: to => {
					return moment().format('YYYY')
				}
			},
			{
				path: ':year',
				component: DphOverview
			}
		]
	},
	{
		path: '/config',
		component: Config,
		children: [
			{
				path: 'remote-writer',
				component: RemoteWriters
			},
			{
				path: '',
				redirect: 'companies'
			},
			{
				path: 'companies',
				component: Companies
			},
			{
				path: 'orders',
				component: Orders
			},
			{
				path: 'projects',
				component: Projects
			}
		]
	},
	{
		path: '/dashboard',
		component: Dashboard
	}
]

const router = new VueRouter({
	routes
})

export default router
