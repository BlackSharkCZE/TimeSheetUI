<template>

	<div class="data-table-container">
		<table tabindex="1" class="data-table"
		       ref="dataTable"
		       v-on:keypress.enter="handleSelectItem()"
		       v-on:keydown.down="moveNextItem()"
		       v-on:keydown.up="movePrevItem()"
		       v-on:blur="handleTableBlur()"
		       v-on:focus="handleTableFocus()">
			<thead class="table-head">
			<tr>
				<th :class="['label',field.thClass]" v-for="(field, index) in fields" v-bind:key="index">{{ field.label }}</th>
			</tr>
			<tr v-if="renderFilter">
				<th class="filter" v-for="(field, index) in fields" v-bind:key="index">
          <span v-if="field.filter && field.filter.display !== false">
            <input type="text" class="input text" v-model="currentQuery.filter[field.key]" @input="processFilterChange($event, field.key)"/>
          </span>
				</th>
			</tr>
			</thead>
			<tbody class="table-body">

			<tr
					v-bind:class="customClassGenerator(index, row)"
					v-for="(row, index) in rows" v-bind:key="index" @click="handleSelectionByMouse(index)">
				<td v-for="(field, index2) in fields" v-bind:key="index2" :class="[field.tdClass]">
					<slot v-if="row[field.key] === undefined" v-bind:name="colsDef[field.key]" v-bind="row"></slot>
					<slot v-if="row[field.key] !== undefined" v-bind:name="colsDef[field.key]" v-bind="row">{{ getColumnValue(field, row) }}</slot>
				</td>
			</tr>
			<tr v-if="loadingError">
				<td :colspan="fields.length" class="loading-error">Loading data from server failed!</td>
			</tr>
			</tbody>
			<tfoot class="table-footer">

			<tr v-if="currentQuery.paginator">
				<td v-bind:colspan="fields.length">
					<div class="paginator-container">
						<div class="item"></div>
						<div v-if="currentQuery.paginator!=null" class="item paginator">

							<div class="page-button" @click="changePage(0)">
								<font-awesome-icon icon="fast-backward"/>
							</div>
							<div class="page-button" @click="changePage(currentQuery.paginator.currentPage-1)">
								<font-awesome-icon icon="backward"/>
							</div>

							<div v-for="(n, index) in navigationIndex"
							     v-bind:key="index"
							     class="page-button"
							     @click="changePage(n)"
							     v-bind:class="{active: n===currentQuery.paginator.currentPage}">
								{{ n + 1 }}
							</div>

							<div class="page-button" @click="changePage(currentQuery.paginator.currentPage+1)">
								<font-awesome-icon icon="forward"/>
							</div>
							<div class="page-button" @click="changePage(currentQuery.paginator.pageCount-1)">
								<font-awesome-icon icon="fast-forward"/>

							</div>

						</div>
						<div class="item">
							<input type="text"
							       style="width: 80px; text-align: center;"
							       v-model="pageIndex"
							       class="input text"/> / {{ currentQuery.paginator.pageCount }}
							<button class="go-button" @click="changePage(pageIndex-1)">Go!</button>
						</div>
					</div>
				</td>
			</tr>

			</tfoot>
		</table>

	</div>

</template>

<script>
import moment from 'moment'
import { Toolbox } from '@/services/Toolbox'

export default {
	name: 'bs-table',
	emits: ['itemSelected', 'displayDetail'],
	props: {
		initialFilter: {
			type: Object,
			required: false,
			default: () => {
			}
		},
		pageSize: {
			type: Number,
			default: 25
		},
		resourceUrl: String,
		fields: {
			type: Array,
			required: true
		},
		sort: String,
		autofocus: {
			type: Boolean,
			default: false
		}
	},
	watch: {
		initialFilter: function(value) {
			this.reload()
		}
	},
	data() {
		return {
			loadingError: false,
			pageIndex: 0,
			cursorSpeed: 50,
			keyTimeoutNext: null,
			keyTimeoutPrev: null,
			rows: [],
			pagesNavigation: [],
			selectedIndex: -1,
			currentQuery: {
				resourceUrl: '',
				paginator: {
					currentPage: 0
				},
				filter: {},
				activeFilter: {}
			},
			colsDef: {}
		}
	},

	mounted() {
		window.addEventListener('keyup', e => {
			if (e.key === 'F2' && this.selectedIndex >= 0) {
				this.$emit('displayDetail', this.rows[this.selectedIndex])
				e.preventDefault()
			}
		})
		this.currentQuery.resourceUrl = this.resourceUrl
		this.currentQuery.paginator = {
			currentPage: 0,
			pageCount: 1,
			itemsPerPage: this.$props.pageSize
		}
		this.pageIndex = 1
		this.currentQuery.filter = {}
		this.processSlot(this.$slots)
		this.processSlot(this.$scopedSlots)
		this.readData(this.currentQuery)
	},

	computed: {
		columnKeys() {
			if (this.rows && this.rows.length > 0) {
				return Object.keys(this.rows[0])
			} else {
				return []
			}
		},
		navigationIndex() {
			return this.buildNavigationIndex()
		},
		renderFilter() {
			if (this.fields) {
				for (const f of this.fields) {
					if (f.filter) {
						return true
					}
				}
			}
			return false
		}
	},
	methods: {

		customClassGenerator(index, row) {
			return {
				selected: index === this.selectedIndex,
				nojira: row.jiraWrite === null || row.jiraWrite === undefined
			}
		},
		updateFilter(field, value) {
			this.currentQuery.filter[field] = value
			this.processFilterChange(null, field)
		},
		reload() {
			this.readData(this.currentQuery)
		},
		handleKeyPress($event) {
		},
		processFilterChange(event, filterKey) {
			const field = this.fields.filter(it => it.key === filterKey)[0]
			if (field.filter !== undefined && field.filter !== null) {
				let key = filterKey
				if (field.filter.column !== undefined && field.filter.column !== null) {
					key = field.filter.column
				}
				const comparator = this.buildComparator(field.filter)
				this.currentQuery.activeFilter[key] = {
					type: comparator,
					value: this.buildValue(field.filter, this.currentQuery.filter[filterKey], comparator)
				}
				if (field.filter.childKey !== undefined) {
					this.currentQuery.activeFilter[key].childKey = field.filter.childKey
				}

				if (this.currentQuery.filter[filterKey].length === 0) {
					delete this.currentQuery.activeFilter[key]
					this.readData(this.currentQuery, true)
					return
				}

				if (this.currentQuery.filter[filterKey]) {
					if (field.filter.type === 'date') {
						if ((this.currentQuery.filter[filterKey].length >= 0 &&
								this.currentQuery.filter[filterKey].length < 10) || this.currentQuery.filter[filterKey].length > 10) {
							delete this.currentQuery.activeFilter[key]
							return
						}
						if (this.currentQuery.filter[filterKey].length === 10) {
							this.readData(this.currentQuery, true)
						}
					} else {
						this.readData(this.currentQuery, true)
					}
				}
			}
		},

		buildComparator(filterConfig) {
			if (filterConfig.comparator === undefined || filterConfig.comparator === null) {
				return '='
			} else {
				return filterConfig.comparator
			}
		},
		buildValue(filterConfig, value, comparator) {
			if (filterConfig.type === undefined || filterConfig.type === null) {
				switch (comparator) {
					case 'like':
						return '%' + value + '%'
					default:
						return value
				}
			} else {
				switch (filterConfig.type) {
					case 'date': {
						const curr = moment(value, 'DD.MM.YYYY')
						return curr.format('YYYY-MM-DD') + ';' + curr.add(1, 'day').format('YYYY-MM-DD')
					}
					case 'number': {
						return parseInt(value, 10)
					}
				}
			}
			return null
		},

		getColumnValue(field, row) {
			if (field.format) {
				return moment(row[field.key]).format(field.format)
			} else {
				return row[field.key]
			}
		},
		processSlot(slotList) {
			const regex = new RegExp('col\\((.*)\\)')
			const ts = Object.keys(slotList).filter(item => item.startsWith('col'))
			ts.forEach(item => {
				const match = regex.exec(item)
				if (match != null && match.length >= 2) {
					this.colsDef[match[1]] = item
				}
			})
		},

		invokeTableFocus() {
			if (this.autofocus) {
				setTimeout(() => {
					this.$refs.dataTable.focus()
				}, 200)
			}
		},

		handleTableFocus() {
			if (this.selectedIndex < 0 && this.rows && this.rows.length > 0) {
				this.selectedIndex = 0
			}
		},
		handleTableBlur() {
			// do nothing
		},
		handleSelectionByMouse(index) {
			this.selectedIndex = index
			this.handleSelectItem()
		},
		handleSelectItem() {
			if (this.selectedIndex >= 0) {
				this.$emit('itemSelected', this.rows[this.selectedIndex])
			}
		},

		moveNextItem() {
			if (this.keyTimeoutNext == null) {
				this.keyTimeoutNext = setTimeout(() => {
					clearTimeout(this.keyTimeoutNext)
					this.keyTimeoutNext = null
				}, this.cursorSpeed)
				if (this.selectedIndex >= 0) {
					this.selectedIndex++
				}
				if (this.selectedIndex >= this.rows.length) {
					this.selectedIndex = 0
				}
			}
		},
		movePrevItem() {
			if (this.keyTimeoutPrev == null) {
				this.keyTimeoutPrev = setTimeout(() => {
					clearTimeout(this.keyTimeoutPrev)
					this.keyTimeoutPrev = null
				}, this.cursorSpeed)
				switch (this.selectedIndex) {
					case -1:
						break
					case 0:
						this.selectedIndex = this.rows.length - 1
						break
					default:
						this.selectedIndex--
				}
			}
		},

		changePage(index) {
			if (index < 0) {
				index = 0
			}
			if (index >= this.currentQuery.paginator.pageCount) {
				index = this.currentQuery.paginator.pageCount - 1
			}
			this.pageIndex = index + 1
			this.currentQuery.paginator.currentPage = index
			this.readData(this.currentQuery)
		},

		buildNavigationIndex() {
			const res = []
			if (this.currentQuery.paginator.pageCount > 10) {
				this.pagesNavigation = []
				for (let i = 0; i < this.currentQuery.paginator.pageCount; i++) {
					if (i > this.currentQuery.paginator.currentPage - 5 && i < this.currentQuery.paginator.currentPage + 5) {
						res.push(i)
					}
				}
			} else {
				this.pagesNavigation = []
				for (let i = 0; i < this.currentQuery.paginator.pageCount; i++) {
					res.push(i)
				}
			}
			return res
		},

		workTimeToMinutes(workTime) {
			const parts = workTime.split(/:/)
			return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10)
		},
		readData(dataQuery, skipTableFocus) {
			this.loadingError = false
			const filter = {
				...this.currentQuery.activeFilter,
				...this.initialFilter
			}
			const request = new Request(dataQuery.resourceUrl +
					'?sort=' + this.sort +
					'&page=' + this.currentQuery.paginator.currentPage +
					'&pageSize=' + this.currentQuery.paginator.itemsPerPage, {
				type: 'cors',
				method: 'post',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json'
				},
				body: JSON.stringify(filter)
			})
			fetch(request).then(res => {
				if (res.status === 200) {
					res.json().then(data => {
						if (data.rows === undefined) {
							this.loadingError = true
						} else {
							// todo implemenet summary statistic for the filter in case of rows is in the normal range
							// store this data in the vuex
							if (data.rows.length > 0) {
								if (data.rows[0].workTime !== undefined) {
									const minutes = data.rows.reduce((a, b) => a + this.workTimeToMinutes(b.workTime), 0)
									const strMinutes = Toolbox.zeroPad(minutes / 60, 2) + ':' + Toolbox.zeroPad((minutes % 60), 2)
									this.$store.dispatch('setFilterSummary', {
										name: 'Hello',
										rows: data.rows.length,
										workTime: strMinutes
									})
								}
							}
							this.rows = data.rows
							this.currentQuery.paginator = data.paginator
							if (this.currentQuery.paginator) {
								this.pagesNavigation = this.buildNavigationIndex()
							}
							if (skipTableFocus !== true) {
								this.invokeTableFocus()
							}
						}
					})
				} else {
					console.error('Can not read data from ', dataQuery.resourceUrl)
				}
			}).catch(e => {
				console.error('Can not load data ', e)
				this.loadingError = true
			})
		}
	}

}
</script>

<style scoped lang="scss">

@import "components.scss";

@mixin input-class {
	border: 1px solid $bs-table-border-color;
	background-color: $bs-table-filter-input-background;
	color: $bs-table-filter-input-color;
	box-sizing: border-box;
	padding: 1px 4px 1px 4px;
	border-radius: 0;
	outline: none;
	width: 100%;

	&:focus {
		border-color: $bs-table-filter-input-hover-border-color;
	}
}

.data-table-container {
	font-size: 0.8rem;
	font-family: sans-serif;
	width: 100%;

	table {
		border: 1px solid #2d2f31;
		outline: none !important;
		border-spacing: 0;
		table-layout: fixed;
		width: 100%;
		@include container-shadow;

		input {
			@include input-class()
		}

		button {
			&.go-button {
				border: 1px solid $bs-table-filter-input-background;
				background-color: $bs-table-filter-input-hover-border-color;
				color: $bs-table-filter-input-color;
				padding: 0 0.5em;

				&:HOVER {
					background-color: $bs-table-color-selected-hover;
				}
			}
		}
	}

	.data-table {
		thead {
			tr {
				th {
					&.label {
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
						color: $bs-table-label-color;
						background-color: $bs-table-label-background;
						padding: 12px 0 2px 0;
					}

					&.filter {
						background-color: $bs-table-label-background;

						input {
							@include input-class();
						}
					}
				}
			}
		}

		tbody {
			tr {
				&.selected {
					background-color: $bs-table-color-selected;

					&:HOVER {
						background-color: $bs-table-color-selected-hover;
					}
				}

				&:HOVER {
					background-color: $bs-table-color-hover;
				}
			}

			td {
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				padding: 1px 4px 1px 8px;
				border: 1px solid $bs-table-border-color;

				&.loading-error {
					font-size: $font-size*1.3;
					font-weight: bold;
					text-align: center;
					color: #AD2831;
				}
			}
		}

		tfoot {
			tr {
				background-color: $bs-table-label-background;
			}
		}
	}

	.paginator-container {
		display: flex;
		flex-direction: row;

		.item {
			flex-grow: 1;
			justify-content: center;
			padding: 0.3em 1em;
			text-align: right;
		}

		.paginator {
			&.item {
				flex-grow: 3;
			}

			//background-color: $breeze-gray;
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			justify-content: center;
			align-content: flex-start;
			padding: 0.2em;

			> div {
				cursor: pointer;
				//border: 1px solid $gray5;
				margin-right: 0.6em;
				padding: 0.1em 0.3em;
				//color: $gray5;
				font-weight: bold;

				&:HOVER {
					text-decoration: underline;
				}

				&.active {
					&:HOVER {
						text-decoration: none;
					}

					font-weight: bold;
					cursor: default;
					color: #42b983;
					//border: 1px solid $eton-blue-2;
					//color: $gray1;
				}
			}
		}
	}

	.data-table {
		background-color: $bs-table-background;
		color: $bs-table-color;
	}
}
</style>
