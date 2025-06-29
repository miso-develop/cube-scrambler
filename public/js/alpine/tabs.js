/* eslint no-undef: 0 */
export const tabs = () => {
	Alpine.directive("tabs", (el, { modifiers, expression }, { evaluate, cleanup }) => {
		const id = "tabs-" + Date.now().toString(36) + Math.random().toString(36).substr(2, 5)
		el.dataset.tabs = id
		
		// MEMO: この順番で表示
		const tabList = [
			"solve",
			"sequence",
			"step",
			"scramble",
		]
		
		
		
		Alpine.data("tabData", () => ({
			tabList,
			
			tabSelected: 1,
			tabId: id,
			
			tabButtonClicked(tabButton) {
				this.tabSelected = tabButton.id.replace(this.tabId + "-", "");
				this.tabRepositionMarker(tabButton);
			},
			
			tabRepositionMarker(tabButton) {
				this.$refs.tabMarker.style.width=tabButton.offsetWidth + "px";
				this.$refs.tabMarker.style.height=tabButton.offsetHeight + "px";
				this.$refs.tabMarker.style.left=tabButton.offsetLeft + "px";
			},
			
			tabContentActive(tabContent) {
				return this.tabSelected == tabContent.id.replace(this.tabId + "-content-", "");
			},
			
			tabButtonActive(tabContent) {
				const tabId = tabContent.id.split("-").slice(-1);
				return this.tabSelected == tabId;
			},
		}))
		
		
		
		const tabButtons = /* html */ `
			<div x-ref="tabButtons"
				class="relative inline-grid items-center justify-center grid-cols-4 text-gray-500 bg-white border-b md:border border-gray-500 md:border-gray-200 md:rounded-lg select-none   w-full h-14 p-1 px-2">
				
				<template x-for="tab in tabList">
					<button x-text="tab.toUpperCase()"
						:id="$id(tabId)"
						type="button"
						@click="tabButtonClicked($el)"
						:class="{ 'bg-gray-200 text-gray-700' : tabButtonActive($el) }"
						class="relative z-20 inline-flex items-center justify-center font-medium transition-all rounded-md cursor-pointer whitespace-nowrap   w-full   h-10 px-3 text-base md:text-2xl"></button>
				</template>
				
				<div x-ref="tabMarker" class="absolute left-0 z-10 w-1/4 h-full duration-300 ease-out" x-cloak>
					<div class="w-full h-full bg-gray-100 rounded-md shadow-sm"></div>
				</div>
				
			</div>
		`
		
		
		
		const scrambleTab = /* html */ `
			<div :id="$id(tabId + '-content')" x-show="tabContentActive($el)" x-transition:enter class="relative">
				<div class="grid grid-cols-2 gap-8 md:gap-10">
					<span x-data x-button='{ "text": "Random" }' @click="$store.api.scramble(0)" class="[&>*]:px-4 col-span-2"></span>
					<span x-data x-button='{ "text": "Corner only", "color": "red" }' @click="$store.api.scramble(1)" class="[&>*]:px-4 "></span>
					<span x-data x-button='{ "text": "Edge only", "color": "blue" }' @click="$store.api.scramble(2)" class="[&>*]:px-4 "></span>
					<span x-data x-button='{ "text": "Parity", "color": "yellow" }' @click="$store.api.scramble(3)" class="[&>*]:px-4 "></span>
					<span x-data x-button='{ "text": "Non Parity", "color": "green" }' @click="$store.api.scramble(4)" class="[&>*]:px-4 "></span>
				</div>
				<!-- <div class="grid gap-6 md:gap-10">
					<span x-data x-button='{ "text": "Random" }' @click="$store.api.scramble(0)" class="[&>*]:px-20"></span>
					<span x-data x-button='{ "text": "Corner only", "color": "red" }' @click="$store.api.scramble(1)" class="[&>*]:px-20"></span>
					<span x-data x-button='{ "text": "Edge only", "color": "blue" }' @click="$store.api.scramble(2)" class="[&>*]:px-20"></span>
				</div> -->
			</div>
		`
		
		const solveTab = /* html */ `
			<div :id="$id(tabId + '-content')" x-show="tabContentActive($el)" x-transition:enter class="relative" x-cloak>
				<div x-data x-cube-ui x-show="!$store.view.isSp()" class="mb-10"></div>
				<div x-data x-cube-ui-sp x-show="$store.view.isSp()" class="mb-10"></div>
				
				<div class="flex justify-center mb-6 md:mb-0">
					<div x-data x-button='{ "text": "Solve" }' class="w-9/12" @click="$store.api.solve($store.cube.facelets())"></div>
				</div>
			</div>
		`
		
		const sequenceTab = /* html */ `
			<div :id="$id(tabId + '-content')" x-show="tabContentActive($el)" x-transition:enter class="relative w-full" x-cloak>
				<div x-data="{ sequence: '', api: (sequence) => $store.api.sequence(sequence) }" class="flex flex-col md:flex-row justify-between items-center">
					<div x-data x-text-input="Please enter a sequence (ex. R U' R')" class="w-full md:w-10/12 mb-8 md:mb-0 md:mr-5" x-model="sequence" @keydown.enter='api(sequence)'></div>
					<div x-data x-button='{ "text": "Run" }' @click="api(sequence)" class="w-1/2 md:w-24"></div>
				</div>
			</div>
		`
		
		const stepTab = /* html */ `
			<div :id="$id(tabId + '-content')" x-show="tabContentActive($el)" x-transition:enter class="relative" x-cloak>
				<div class="grid gap-6 md:gap-10">
					<div x-data x-button='{ "text": "Step2: Bottom cross", "color": "black" }' @click="$store.api.step(2)"></div>
					<div x-data x-button='{ "text": "Step3: Middle line", "color": "red" }' @click="$store.api.step(3)"></div>
					<div x-data x-button='{ "text": "Step4: Bottom two layers", "color": "blue" }' @click="$store.api.step(4)"></div>
					<div x-data x-button='{ "text": "Step5: Top cross", "color": "yellow" }' @click="$store.api.step(5)"></div>
					<div x-data x-button='{ "text": "Step6: Top face", "color": "green" }' @click="$store.api.step(6)"></div>
					<div x-data x-button='{ "text": "Step7: Top layer corner", "color": "orange" }' @click="$store.api.step(7)"></div>
				</div>
			</div>
		`
		
		const tabHtmlList = tabList.map(tabName => ({
			scramble: scrambleTab,
			solve: solveTab,
			sequence: sequenceTab,
			step: stepTab,
		})[tabName]).join("\n")
		
		const tabContents = /* html */ `
			<div class="relative flex items-center justify-center w-full text-base text-gray-400 md:border md:rounded-md border-gray-200 content   md:mt-2 py-8 md:py-12 px-4 md:px-8">
				${tabHtmlList}
			</div>
		`
		
		
		
		const html = /* html */ `
			<div x-data="tabData"
				x-init="tabRepositionMarker($refs.tabButtons.firstElementChild)"
				class="relative w-full md:w-[768px]">
				
				${tabButtons}
				${tabContents}
				
			</div>
		`
		el.innerHTML += html
		
	})
}
