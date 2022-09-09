<template>
	<div v-if="timeline" class="timeline-detail">
		<bs-display-item label="Název projektu">{{ timeline.projectName }}</bs-display-item>
		<bs-display-item label="Datum">{{ timeline.fromTime | asDay }}, {{ timeline.fromTime | asDate }}</bs-display-item>
		<bs-display-item label="Od - Do">{{ timeline.fromTime | asTime }} - {{ timeline.toTime | asTime }}</bs-display-item>
		<bs-display-item label="Pauza">{{ timeline.pause }}</bs-display-item>
		<bs-display-item label="Odpracováno">{{ timeline.workTime }}</bs-display-item>
		<bs-display-item label="Poznámka">{{ timeline.note }}</bs-display-item>

		<div class="writers" v-if="timeline.writers.length>0">
			<div class="label">Zápis do vzdáleného systému</div>
			<div class="report">
				<writer-status
						v-for="(writer, $index) in timeline.writers" v-bind:key="$index"
						:writer-status="timeline.remoteWriteTimestamp"
						:writer-name="writer">
				</writer-status>
			</div>
			<div class="buttons">
				<button class="bs-button success" @click="remoteWrite">
					Zapsat do systémů
					<font-awesome-icon v-if="!timeline.jiraWrite" style="padding-left: 8px;" icon="upload"></font-awesome-icon>
				</button>
			</div>
		</div>
		<bs-display-item label="Kopírovat poznámku">
			<font-awesome-icon class='fa-click fa-2x' style="padding-left: 8px;" icon="clipboard" @click="copyCommand"></font-awesome-icon>
		</bs-display-item>
		<bs-message ref="message"></bs-message>
	</div>
</template>

<script>
import BsDisplayItem from '@/components/BsDisplayItem'
import { TimesheetAPI } from '@/services/TimesheetAPI'
import BsMessage from '@/components/BsMessage'
import WriterStatus from '@/views/parts/timeline/WriterStatus'
import moment from 'moment/moment'

export default {
	name: 'TimelineDetail',
	components: {
		BsDisplayItem,
		BsMessage,
		WriterStatus
	},
	props: {
		timeline: {
			type: Object
		}
	},
	data() {
		return {
			remoteWriting: false,
			message: {
				show: false,
				note: null,
				style: 'info'
			}
		}
	},
	methods: {

		displayMessage(msg, style) {
			this.message.show = true
			this.message.note = msg
			this.message.style = style
		},
		processRemoteWriteErrorResponse(writerName, data) {
			console.log('Error on processing ', writerName, data)
		},
		remoteWrite() {
			this.$refs.message.showMessage('Probíhá zápis do systémů ...', false)
			this.remoteWriting = true
			TimesheetAPI.timeline.remoteWrite(this.timeline.id).then(data => {
				this.remoteWriting = false
				if (data.success === true) {
					const keyes = Object.keys(data.data)
					for (let i = 0; i < keyes.length; i++) {
						let existingIndex = -1
						for (let x = 0; x < this.timeline.remoteWriteTimestamp.length; x++) {
							if (this.timeline.remoteWriteTimestamp[x].name === keyes[i]) {
								existingIndex = x
								break
							}
						}
						if (existingIndex >= 0) {
							if (this.timeline.remoteWriteTimestamp[existingIndex].success === false) {
								this.timeline.remoteWriteTimestamp[existingIndex].success = data.data[keyes[i]].success
								this.timeline.remoteWriteTimestamp[existingIndex].timestamp = moment().format('YYYY-MM-DDTHH:mm:ssz')
								if (data.data[keyes[i]].success === false) {
									this.processRemoteWriteErrorResponse(keyes[i], data.data[keyes[i]])
								}
							}
						} else {
							if (data.data[keyes[i]].success === false) {
								this.processRemoteWriteErrorResponse(keyes[i], data.data[keyes[i]])
							}
							this.timeline.remoteWriteTimestamp.push({
								success: data.data[keyes[i]].success,
								name: keyes[i],
								timestamp: moment().format('YYYY-MM-DDTHH:mm:ss')
							})
						}
					}
					this.$emit('remoteWrote', this.timeline, data)
					this.$refs.message.showMessage('Vzdálený zápis dokončen.')
				}
			}).catch(exc => {
				this.remoteWriting = false
				this.$refs.message.showError('Zápis do JIRA selhal.')
			})
		},
		copyCommand() {
			const el = document.createElement('input')
			el.value = this.timeline.note
			el.setAttribute('readonly', '')
			el.style.position = 'absolute'
			el.style.left = '-9999px'
			document.body.appendChild(el)
			const selected = document.getSelection().rangeCount > 0 ? document.getSelection().getRangeAt(0) : false
			el.select()
			document.execCommand('copy')
			document.body.removeChild(el)
			if (selected) {
				document.getSelection().removeAllRanges()
				document.getSelection().addRange(selected)
			}
		}
	},
	computed: {
		ticket() {
			if (this.timeline.note) {
				const ticket = this.timeline.note.match(/\w+-\d+/)
				if (ticket !== null) {
					return ticket[0]
				}
			}
			return null
		}
	}
}
</script>

<style scoped lang="scss">

.writers {
	padding-top: 0.2rem;
	padding-bottom: 0.4rem;

	.label {
		font-weight: bold;
	}

	.report {
		padding-left: 0.4rem;
	}

	.buttons {
		padding-top: 0.4rem;
	}

}

.timeline-detail {
	max-width: 600px;
	padding: 0.5rem 0.4rem;
}
</style>
