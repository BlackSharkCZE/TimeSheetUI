const basicValidateForm = {
	methods: {
		basicValidate() {
			this.errors = []
			for (const key in this.$refs) {
				if (typeof this.$refs[key].isValid === 'function') {
					const valid = this.$refs[key].isValid()
					if (!valid) {
						this.errors.push(key + ': ' + this.$refs[key].getErrors() + '. ')
					}
				}
			}
			if (this.errors.length === 0 && this.processBusinessErrors) {
				this.processBusinessErrors()
			}
		}
	}
}

export { basicValidateForm }
