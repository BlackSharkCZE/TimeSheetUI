<template>
	<div class="form-container">
		<div class="timesheet_form">
			<div class="flex-item w120">
				<bs-date-picker ref="datePicker" :id="id+':datePicker1'" :required="true" v-on:value-changed="updateFromTimeByAPI" v-model="form.date" label="Datum"/>
			</div>
			<div class="flex-item w40">
				<bs-input ref="fromTime" :required="true" v-model="form.fromTime" type="time" label="Od"/>
			</div>
			<div class="flex-item w40">
				<bs-input ref="toTime" :required="true" v-model="form.toTime" type="time" label="Do"/>
			</div>
			<div class="flex-item w40">
				<bs-input ref="pause" :required="true" v-model="form.pause" type="number" label="Pauza"/>
			</div>
			<div class="flex-item">
				<bs-auto-complete v-model="form.project" :items="projectList" label="Projekt" :id="id+':projectAutocomplete'" :formatter="(x)=>x.name"/>
			</div>
			<div class="flex-item gr-12 note">
				<bs-input ref="note" :required="true" v-model="form.note" label="Poznámka"/>
			</div>
			<div class="flex-item">
				<div style="padding-top: 4px; text-align: right;">
					<button class="bs-button lg" @click="basicValidate">
						<font-awesome-icon icon="save"/>
						{{ buttonLabel }}
					</button>
				</div>
			</div>
		</div>
		<transition name="fade">
			<div class="error-container" v-if="errors.length>0">
				<div class="error-item">
					<font-awesome-icon icon="exclamation-triangle"/>
				</div>
				<div class="error-item" v-for="(error, index) in errors" v-bind:key="index">{{ error }}</div>
			</div>
		</transition>
	</div>
</template>

<script>
import moment from 'moment/moment'
import BsInput from '@/components/BsInput'
import BsDatePicker from '@/components/BsDatePicker'
import { TimesheetAPI } from '@/services/TimesheetAPI'
import BsAutoComplete from '@/components/BsAutoComplete'
import { Toolbox } from '@/services/Toolbox'
import { basicValidateForm } from '@/mixins/Common'

export default {
	mixins: [basicValidateForm],
	name: 'TimelineForm',
	emit: ['timelineCreated', 'timelineEdit'],
	components: {
		BsAutoComplete,
		BsInput,
		BsDatePicker
	},
	props: {
		id: {
			type: String,
			required: true
		},
		edit: {
			type: Object,
			default: null
		}
	},
	data() {
		return {
			form: {
				id: null,
				date: moment(),
				fromTime: null,
				toTime: null,
				pause: 0,
				project: null,
				note: null
			},
			errors: [],
			debounc: false

		}
	},
	created() {
		this.$store.dispatch('fetchProjects').then(() => {
			this.form.project = this.$store.getters.getMostInterestedProject
		})
		this.updateFromTimeByAPI(this.form.date)
		this.form.project = this.$store.getters.getMostInterestedProject
	},
	mounted() {
		/*
		const comInst = this
		this._keylistener = function(e) {
			if (!comInst.debounc) {
				console.log('KeyListener on TimelineForm: ', comInst.debounc)
				setTimeout(function() {
					comInst.debounc = false
				}, 200)
				comInst.debounc = true
			}
		}
		document.addEventListener('keydown', this._keylistener.bind(this))
		 */
	},
	beforeDestroy() {
		// document.removeEventListener('keydown', this._keylistener)
	},
	computed: {
		buttonLabel() {
			return this.edit ? 'Update' : 'Save'
		},
		projectList() {
			return this.$store.getters.getAllProjects
		}
	},
	methods: {
		initializeFromStore() {
			if (this.edit) {
				this.form.id = this.edit.id
				this.form.date = moment(this.edit.fromTime)
				this.form.fromTime = moment(this.edit.fromTime).format('HH:mm')
				this.form.toTime = moment(this.edit.toTime).format('HH:mm')
				this.form.pause = this.edit.pause
				this.form.project = this.$store.getters.getProjectById(this.edit.projectId)
				this.form.note = this.edit.note
			}
		},
		/*
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
			if (this.errors.length === 0) {
				this.processBusinessErrors()
			}
		},
		*/
		async processBusinessErrors() {
			// zadany cas se nesmi prekryvat s jiz zadanym udajem
			const fromTime = moment(this.form.date.format('YYYY-MM-DD') + ' ' + this.form.fromTime, 'YYYY-MM-DD HH:mm')
			const toTime = moment(this.form.date.format('YYYY-MM-DD') + ' ' + this.form.toTime, 'YYYY-MM-DD HH:mm')
			if (fromTime.isAfter(toTime)) {
				this.errors.push('FromTime is after ToTime. ')
			}

			if (this.form.pause < 0) {
				this.errors.push('Pause is less then 0 minutes')
			}

			const duration = toTime.diff(fromTime) / 60000 - this.form.pause
			if (duration <= 0) {
				this.errors.push('Work time is less or equals zero.')
			}
			const response = await TimesheetAPI.timeline.isOverlap(fromTime.format('YYYY-MM-DDTHH:mm:ss'), toTime.format('YYYY-MM-DDTHH:mm:ss'))
			if (response.overlap) {
				if (response.overlapIds.length === 1 && response.overlapIds[0] === this.form.id) {
					this.processSaveOrUpdate(fromTime, toTime, duration)
				} else {
					this.errors.push('Time range overlap another record!')
				}
			} else {
				this.processSaveOrUpdate(fromTime, toTime, duration)
			}
		},
		processSaveOrUpdate(fromTime, toTime, duration) {
			const timelineVo = {
				projectId: this.form.project.id,
				fromTime: fromTime.format(),
				toTime: toTime.format(),
				pause: this.form.pause,
				workTime: Toolbox.formatTime(duration / 60.0),
				note: this.form.note
			}
			if (this.edit) {
				timelineVo.id = this.form.id
				TimesheetAPI.timeline.update(timelineVo)
				            .then(json => {
					            this.$emit('timelineEdit', timelineVo)
				            })
			} else {
				TimesheetAPI.timeline.save(timelineVo)
				            .then(json => {
					            timelineVo.id = json.itemID
					            this.$emit('timelineCreated', timelineVo)
					            this.form.note = ''
					            this.form.fromTime = this.form.toTime
					            this.form.toTime = null
					            this.form.pause = 0
				            })
				            .catch(ex => {
					            console.error('Can not create Timeline due to:', ex)
					            this.errors.push('Can not create Timeline! ' + ex)
				            })
			}
		},
		updateFromTimeByAPI(date) {
			if (!this.edit) {
				TimesheetAPI.report.maxTimeOnDay(date.format('YYYY-MM-DD')).then(res => res.json()).then(value => {
					if (value.success) {
						if (value.data.value == null) {
							this.form.fromTime = '06:30'
						} else {
							this.form.fromTime = value.data.value
						}
					} else {
						this.form.fromTime = '06:30'
					}
				})
			}
		}
	}
}
</script>

<style scoped lang="scss">
@import "../../../styles/custom-colors";
@import "../../../components/components";

@mixin flexStep($value) {
	flex-grow: $value;
	//min-width: 5px * $value;
}

@mixin forceWidth($value) {
	min-width: $value;
	width: $value;
}

.form-container {

	.fade-enter-active, .fade-leave-active {
		transition: opacity .5s;
	}

	.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
	{
		opacity: 0;
	}

	@include container-shadow;
	border: 1px solid $container-border-color;
	padding: 0.5em;
	margin-bottom: 1em;

	.timesheet_form {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;

		.flex-item {
			&.note {
				min-width: 40rem;
			}

			padding: 0 0.5em;
			@include flexStep(1);

			&.w40 {
				@include forceWidth(40px)
			}

			&.w80 {
				@include forceWidth(80px)
			}

			&.w120 {
				@include forceWidth(120px)
			}

			&.gr-2 {
				@include flexStep(2);
			}

			&.gr-4 {
				@include flexStep(4);
			}

			&.gr-8 {
				@include flexStep(8);
			}

			&.gr-12 {
				@include flexStep(12);
			}
		}
	}
}
</style>
