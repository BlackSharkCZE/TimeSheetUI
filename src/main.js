import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import moment from 'moment'
import 'moment/min/locales'
import VCalendar from 'v-calendar'

import { library } from '@fortawesome/fontawesome-svg-core'
import {
	faBackward,
	faBan,
	faBars,
	faCalendar,
	faCheck,
	faCheckCircle,
	faClipboard,
	faCopy,
	faDownload,
	faEdit,
	faExclamationTriangle,
	faEye,
	faFastBackward,
	faFastForward,
	faFileDownload,
	faFilter,
	faForward,
	faHandPointer,
	faPlus,
	faSave,
	faSearch,
	faSpinner,
	faTrash,
	faUserSecret,
	faUpload,
	faInfoCircle
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faUserSecret, faSave, faCalendar,
	faForward, faBackward,
	faFastForward, faFastBackward,
	faCopy, faClipboard, faBars,
	faExclamationTriangle, faTrash, faFilter,
	faEdit, faDownload, faEye, faBan, faCheckCircle,
	faPlus, faHandPointer,
	faSearch, faSpinner, faCheck, faFileDownload, faUpload, faInfoCircle
)

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false

moment.locale('cs')
Vue.use(VCalendar, {
	componentPrefix: 'vc'
})

Vue.filter('asTime', function(value) {
	if (value) {
		return moment(value).format('HH:mm')
	} else {
		return null
	}
})
Vue.filter('asDuration', function(value) {
	return moment.duration(value).asHours()
})

Vue.filter('asDay', function(value) {
	if (value) {
		return moment(value).format('dddd')
	} else {
		return null
	}
})
Vue.filter('asDate', function(value) {
	if (value) {
		return moment(value).format('DD.MM.YYYY')
	} else {
		return null
	}
})

Vue.filter('asMonth', function(value) {
	if (value) {
		return moment(value).format('MMMM YYYY')
	} else {
		return null
	}
})

Vue.filter('asTimestamp', function(value) {
	if (value) {
		return moment(value).format('DD.MM.YYYY HH:mm')
	} else {
		return null
	}
})

Vue.filter('asIsoDate', function(value) {
	if (value) {
		return moment(value).format('YYYY-MM-DD')
	} else {
		return null
	}
})

new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app')
