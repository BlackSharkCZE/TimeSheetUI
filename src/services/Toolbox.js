
import moment from 'moment'

const Toolbox = {

	months() {
		return moment.months()
	},

	isValue(data) {
		if (data === undefined) return false
		if (data === null) return false
		if (typeof data === 'string') {
			if (data.length === 0) return false
		}
		return true
	},

	zeroPad(num, places) {
		return String(num).padStart(places, '0')
	},

	formatTime(hours) {
		if (hours !== undefined) {
			const hour = (hours) >> 0
			const min = (hours - hour) * 60
			return this.zeroPad(hour, 2) + ':' + this.zeroPad(min, 2)
		} else {
			return 'Input undefined!'
		}
	},

	formatPrice(price) {
		return price
	}

}
export { Toolbox }
