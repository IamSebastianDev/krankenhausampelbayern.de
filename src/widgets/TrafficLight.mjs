/** @format */

import { WidgetCore } from './WidgetCore.mjs';

class TrafficLight extends WidgetCore {
	constructor(dataSet) {
		super();
		console.log(dataSet);
		this.dataSet = dataSet;
	}

	render() {
		const html = this.html;

		const [title, ...details] = `Krankenhaus-Ampel Bayern`.split(' ');
		const description = `Die Krankenhaus-Ampel gibt Auskunft über die momentane Auslastung des bayrischen Gesundheitssystem.`;

		const stage = this.getStage();

		return html`
			<div class="widget" size="small" widget-id="${this.id}">
				<div class="widget-top">
					<h3 class="widget-top__title">
						${title}
						<span class="widget-top__detail"
							>${details.join(' ')}</span
						>
					</h3>
					<hr />
					<p class="widget-top__description">${description}</p>
				</div>
				<div class="widget-content">
					<div class="widget-content__trend">
						<span
							class="widget-content__trafficlight"
							style="${this.getTrafficLightColor(stage)}"
						></span>
						<span class="widget-content__trafficlight-text">
							Die bayrische Krankenhaus-Ampel steht zur Zeit auf
							${stage == 2
								? `Rot`
								: stage == 1
								? 'Gelb'
								: 'Grün'}.
						</span>
					</div>
					<div class="widget-content__details">
						<a
							class="widget-link"
							style="width: 100%; text-align: center"
							href="https://www.stmgp.bayern.de/coronavirus/#kh-ampel"
							target="_blank"
							rel="norefferer noopener"
							>&rarr; Aktuell geltende Regelungen</a
						>
					</div>
				</div>
			</div>
		`;
	}

	// method to get the stage of the trafficlight

	getStage() {
		const { icuOccupation, hospitalized7Days } =
			this.dataSet[this.dataSet.length - 1];

		switch (true) {
			case icuOccupation.value > icuOccupation.threshold:
				return 2;
			case hospitalized7Days.value > hospitalized7Days.threshold ||
				icuOccupation.value > 450:
				return 1;
			default:
				return 0;
		}
	}

	getTrafficLightColor(stage) {
		switch (stage) {
			case 2:
				return '--color-tl: rgba(195, 66, 63, 1);';
			case 1:
				return '--color-tl: rgba(253, 231, 76, 1);';
			default:
				return '--color-tl: rgba(107, 154, 8, 1);';
		}
	}
}

export { TrafficLight };
