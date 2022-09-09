<template>
	<div class="writer">
		<div class="name" :class="{'wrote': isWrote(), 'error': isError(), 'nowrote': noWrote()}">{{ writerName }}</div>
		<div class="timestamp" v-if="status">&nbsp;- {{ status.timestamp | asTimestamp }}</div>
		<div class="result" v-if="status">&nbsp;
			<font-awesome-icon :icon="getStatusIcon()"/>
		</div>
		<div class="result" v-if="status === null">&nbsp;- Zápis neproběhl</div>

	</div>
</template>

<script>
export default {
	name: 'WriterStatus',
	props: {
		writerName: {
			type: String,
			required: true
		},
		writerStatus: {
			type: Array,
			required: true,
			default: () => []
		}
	},
	computed: {
		status() {
			for (let i = 0; i < this.writerStatus.length; i++) {
				if (this.writerName === this.writerStatus[i].name) {
					return this.writerStatus[i]
				}
			}
			return null
		}
	},
	methods: {
		getStatusIcon() {
			if (this.status !== null && this.status.success) {
				return 'check'
			} else {
				return 'exclamation-triangle'
			}
		},
		isWrote() {
			const status = this.status
			return status !== null && status.success === true
		},
		isError() {
			const status = this.status
			return status !== null && status.success === false
		},
		noWrote() {
			return this.status === null
		}
	}
}
</script>

<style scoped lang="scss">

.writer {
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	justify-content: left;

	.name {
		font-weight: bold;

		&.wrote {
			color: $bs-primary;
		}

		&.error {
			color: $bs-error-dark;
		}

		&.nowrote {
			color: $bs-error-dark;
		}
	}
}

</style>
