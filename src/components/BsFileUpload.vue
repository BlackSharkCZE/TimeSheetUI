<template>

	<div class="file-upload-container">

		<form enctype="multipart/form-data" novalidate>
			<input type="file"
			       :id="componentID"
			       :name="componentID"
			       :multiple="multiple"
			       :disabled="isSaving"
			       class="input-file"
			       @change="filesChange($event.target.name, $event.target.files); fileCount = $event.target.files.length"/>
			<div class="info" v-if="isInitial">
				<div>Drag your file(s) here to begin<br> or click to browse</div>
			</div>
			<div class="info" v-if="files.length>0">
				<div>
					To upload: <br/>
					<ul>
						<li v-for="(item, index) of files" v-bind:key="index">
							{{ item.name }}
						</li>
					</ul>
				</div>
			</div>
		</form>
	</div>

</template>

<script>

let GLOBAL_ID = 1

export default {
	name: 'BsFileUpload',
	props: {
		multiple: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			componentID: 'BS_FILE_UPLOAD' + (GLOBAL_ID++),
			isSaving: false,
			isInitial: true,
			files: []
		}
	},
	methods: {
		filesChange(name, files) {
			this.isInitial = files.length === 0
			this.files = files
			this.$emit('change', files)
		},
		deleteFile(index) {
			//  TODO does not work. click is not handeled by parent
			this.files.splice(index, 1)
		}
	}
}
</script>

<style scoped lang="scss">

.file-upload-container {
	outline: 1px solid $bs-table-border-color;
	outline-offset: -10px;
	background-color: $bs-table-background;
	padding: 10px 10px;
	min-height: 4rem;
	height: 4rem;
	cursor: pointer;

	.input-file {
		opacity: 0;
		width: 100%;
		min-height: 4rem;
		height: 4rem;
		//position: absolute;
		cursor: pointer;
	}

	.info {
		display: flex;
		min-height: 4rem;
		height: 4rem;
		width: 100%;
		margin-top: -4rem;
		justify-content: center;
		align-items: center;

		div {
			flex-direction: column;
			text-align: center;

			ul {
				color: #4c7197;
				margin: 0;
				padding: 0;
				list-style: none;
			}

		}
	}

}

</style>
