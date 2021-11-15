const t=t=>{const e=document.querySelector("#data-backdrop"),i=e.getContext("2d"),s=window.innerWidth,n=window.innerHeight-62;e.width=2*s*window.devicePixelRatio,e.height=2*n*window.devicePixelRatio,e.style.width=s+"px",e.style.height=n+"px";const r=t.map((t=>t.icuOccupation.value)),a=t.map((t=>t.hospitalized7Days.value)),o=(t,s,n)=>{const r=t.length-1,a=e.width/r,o=e.height/n/2;i.beginPath(),i.strokeStyle=s,i.lineWidth=10,i.lineCap="round",i.lineJoin="round",i.moveTo(0,e.height-t[0]*o),t.forEach(((t,s)=>{i.lineTo(s*a,e.height-t*o)})),i.stroke(),i.strokeStyle="transparent",i.lineTo(e.width,e.height),i.lineTo(0,e.height),i.fillStyle=s,i.fill()};window.requestAnimationFrame((()=>{i.clearRect(0,0,e.width,e.height),o(r,"rgba(255, 90, 95, 0.05)",600),o(a,"rgba(57, 160, 237, 0.05)",1200)}))},e=({block:t=4,group:e=4}={})=>{const i="abcdefghijklmnopqrstuvxyz0123456789",s=i.length,n=[];for(let r=0;r<e;r++){let e=[];for(let n=0;n<t;n++)e.push(i[1*Math.floor(Math.random()*s)]);n.push(e.join(""))}return n.join("-")},i=new DOMParser;class s{constructor(){this.id=e(),this._selector=`.widget[widget-id='${this.id}']`}hasRendered(){}renderValue(t,e,i){const s=this.html,[n,r]=t.toString().split(".");let a="var(--widget-color-light)";e&&(a=t>e?"var(--widget-color-red)":"var(--widget-color-blue)"),600===e&&t>450&&t<600&&(a="var(--widget-color-yellow)");return s`<h3
			class="widget-content__trend-value"
			style="color: ${a};  margin-left: auto; font-size: ${Math.min(8-n.length,5)}em;"
		>
			${n}<span class="widget-content__trend-decimal"
				>${r?"."+r:""}${this.renderUnit(i)}</span
			>
		</h3>`}invertScheme(t){return t?["var(--widget-color-blue)","var(--widget-color-red)"]:["var(--widget-color-red)","var(--widget-color-blue)"]}renderTrend(t,e){const i=this.html,{arrowRight:s,arrowRightUp:n,arrowRightDown:r}=Pangolicons.icons,a={"stroke-width":2,width:"8em",height:"8em"},o="vaccination"===this.widgetName?this.invertScheme(!0):this.invertScheme(!1);return i`<span class="widget-content__trend-indicator">
			${t>e?n.toString({...a,stroke:o[0]}):t===e?s.toString({...a,stroke:"var(--widget-color-light)"}):r.toString({...a,stroke:o[1]})}
		</span>`}renderUnit(t){return null===t||"Fälle"===t||void 0===t?"":t}renderDetails({value:t,lastValue:e,threshold:i,unit:s}){return`${this.renderDifference(t,e,s)}\n\t\t\t${i?this.renderPecentage(t,i):""}\n\t\t\t${i?this.renderTreshold(t,i):""}\n\t\t\t`}renderTreshold(t,e){return`<span\n\t\t\tclass="widget-details__threshold"\n\t\t\tstyle="color: ${t>e?"var(--widget-color-red)":"var(--widget-color-light)"}"\n\t\t\t>${t} / ${e}</span\n\t\t>`}renderPecentage(t,e){return`<span class="widget-details__percentage">\n\t\t\t(${(100*t/e).toFixed(2)}%)\n\t\t</span>`}renderDifference(t,e,i){const s=t-e,n="vaccination"===this.widgetName?this.invertScheme(!0):this.invertScheme(!1);return`<span class="widget-details__difference" style="color: ${t>e?n[0]:t<e?n[1]:"var(--widget-color-light)"}">${s<0?"":"+"} ${Number.isInteger(s)?s:s.toFixed(2)} ${this.renderUnit(i)}</span>`}html(t,...s){const n={},r=t.map(((i,r)=>{if(r<t.length-1){if(s[r]instanceof DocumentFragment){const t=e();return n[t]={frag:s[r]},`${i}<placeholder index="${t}"></placeholder>`}return i+s[r]}return i})).join(""),a=i.parseFromString(r,"text/html").querySelector("body");[...a.querySelectorAll("placeholder")].forEach((t=>{t.replaceWith(n[t.getAttribute("index")].frag)}));const o=new DocumentFragment;return o.appendChild(...a.childNodes),o}}class n extends s{constructor(t,e){super(),this.dataSet=t,this.widgetName=e}renderRemoveButton(t){const{x:e}=Pangolicons.icons;return t?"":`<button class="widget-remove" widget-id="${this.id}">\n\t\t${e.toString({"stroke-width":2})}\n\t</button>`}render({preview:t=!1}={}){const e=this.html,[i,...s]=this.dataSet.title.split(" "),{description:n,value:r,lastValue:a,threshold:o,unit:d}=this.dataSet;return e`
			<div
				class="widget ${t?"widget-preview":""}"
				size="small"
				widget-id="${this.id}"
				widgetname="${this.widgetName}"
			>
				${this.renderRemoveButton(t)}
				<div class="widget-top">
					<h3 class="widget-top__title">
						${i}
						<span class="widget-top__detail"
							>${s.join(" ")}</span
						>
					</h3>
					<hr />
					<p class="widget-top__description">${n}</p>
				</div>
				<div class="widget-content">
					<div class="widget-content__trend">
						${this.renderTrend(r,a)}
						${this.renderValue(r,o,d)}
					</div>
					<div class="widget-content__details">
						${this.renderDetails({value:r,lastValue:a,threshold:o,unit:d})}
					</div>
				</div>
			</div>
		`}}class r extends s{constructor(t){super(),console.log(t),this.dataSet=t}render(){const t=this.html,[e,...i]="Krankenhaus-Ampel Bayern".split(" "),s=this.getStage();return t`
			<div class="widget" size="small" widget-id="${this.id}">
				<div class="widget-top">
					<h3 class="widget-top__title">
						${e}
						<span class="widget-top__detail"
							>${i.join(" ")}</span
						>
					</h3>
					<hr />
					<p class="widget-top__description">${"Die Krankenhaus-Ampel gibt Auskunft über die momentane Auslastung des bayrischen Gesundheitssystem."}</p>
				</div>
				<div class="widget-content">
					<div class="widget-content__trend">
						<span
							class="widget-content__trafficlight"
							style="${this.getTrafficLightColor(s)}"
						></span>
						<span class="widget-content__trafficlight-text">
							Die bayrische Krankenhaus-Ampel steht zur Zeit auf
							${2==s?"Rot":1==s?"Gelb":"Grün"}.
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
		`}getStage(){const{icuOccupation:t,hospitalized7Days:e}=this.dataSet[this.dataSet.length-1];switch(!0){case t.value>t.threshold:return 2;case e.value>e.threshold||t.value>450:return 1;default:return 0}}getTrafficLightColor(t){switch(t){case 2:return"--color-tl: rgba(195, 66, 63, 1);";case 1:return"--color-tl: rgba(253, 231, 76, 1);";default:return"--color-tl: rgba(107, 154, 8, 1);"}}}class a extends s{constructor({noWidgetsLeft:t}){super(),this.showButton=!t}render(){return this.html`
			<button
				class="widget-creator"
				widget-id="${this.id}"
				${this.showButton?"":'style="display: none"'}
			>
				${Pangolicons.icons.plus.toString({"stroke-width":"2"})}
			</button>
		`}}class o extends s{constructor(t,e){super(),this.dataSet=t,this.widgetName=e,window.addEventListener("resize",(t=>{this.renderLinegraph()}))}renderRemoveButton(t){const{x:e}=Pangolicons.icons;return t?"":`<button class="widget-remove" widget-id="${this.id}">\n\t\t${e.toString({"stroke-width":2})}\n\t</button>`}render({preview:t=!1}={}){const{html:e}=this,i=this.dataSet.length,[s,...n]=`Krankenhausauslastung der letzten ${i} Tage.`.split(" "),r=`Anzahl der Patienten die mit Covid-19 <span style="color: var(--widget-color-blue)">Hospitalisiert</span> & auf der <span style="color: var(--widget-color-red)">Intensivstation</span> liegen im ${i} Tages Verlauf.`;return e`
			<div
				class="widget ${t?"widget-preview":""}"
				size="medium"
				widget-id="${this.id}"
				widgetname="${this.widgetName}"
			>
				${this.renderRemoveButton(t)}
				<div class="widget-top">
					<h3 class="widget-top__title">
						${s}
						<span class="widget-top__detail"
							>${n.join(" ")}</span
						>
					</h3>
					<hr />
					<p class="widget-top__description">${r}</p>
				</div>
				<div class="widget-content">
					<canvas
						class="widget-canvas"
						id="linegraph-${this.id}"
					></canvas>
				</div>
			</div>
		`}hasRendered(){this.renderLinegraph()}resetCanvas(t){t.width=t.height=0,t.style=""}renderLinegraph(){const t=document.querySelector(`#linegraph-${this.id}`);this.resetCanvas(t);const{width:e,height:i}=t.getBoundingClientRect(),s=document.querySelector(`.widget[widget-id="${this.id}"] .widget-top`);t.width=e*window.devicePixelRatio,t.height=i*window.devicePixelRatio,t.style.width=e+"px",t.style.height=i+"px";const n=60,r=80+2*s.getBoundingClientRect().height,a=t.getContext("2d"),o=t.width-120,d=t.height-n-r,l=o/(this.dataSet.length-1),h=d/1200,c="rgba(255, 90, 95, 1)",g=this.dataSet.map((t=>new Date(t.meta.created))),w=this.dataSet.map((t=>t.icuOccupation.value)),u=this.dataSet.map((t=>t.hospitalized7Days.value)),p=(e,i)=>{a.beginPath(),a.strokeStyle=i,a.lineWidth=2,a.lineCap="round",a.lineJoin="round",a.moveTo(60,t.height-e[0]*h-n),e.forEach(((e,i)=>{a.lineTo(i*l+n,t.height-e*h-n)})),a.stroke()};p(w,c),p(u,"rgba(57, 160, 237, 1)"),(t=>{const e={x:60,y:d+r};a.strokeStyle="rgba(255,255,255,1)",a.lineWidth=1,a.beginPath(),a.moveTo(e.x,e.y),a.lineTo(o+n,e.y),a.stroke(),a.beginPath(),a.moveTo(e.x,e.y-10),a.lineTo(e.x,0+r),a.stroke(),a.font="22px monospace",a.fillStyle="rgba(255,255,255,0.6)",a.textAlign="left";for(let t=0;t<1200;t++)if(t%200==0){const i=t+200,s=e.x,n=e.y-i*h,{width:r}=a.measureText(3===i.toString().length?"0"+i:i);a.beginPath(),a.setLineDash([5,20]),a.strokeStyle=600===i?c:"rgba(255,255,255,0.4)",a.moveTo(s+r+30,n),a.lineTo(s+o,n),a.stroke(),a.textBaseline="middle",a.fillText(i,s+20,n)}a.setLineDash([]),t.forEach(((t,e)=>{const i=new Date(t).toLocaleDateString(),{width:s}=a.measureText(i),h=Math.floor((this.dataSet.length-1)/Math.round(o/(s+30))),c=n+e*l+15,g=r+d-20;if(e%h==0){if(a.beginPath(),a.strokeStyle="rgba(230,230,230,1)",a.moveTo(c-15,g+20-10),a.lineTo(c-15,g+20+10),a.stroke(),c-5+s>o+n)return;a.fillText(i,c-5,g)}}))})(g)}}const d=document.querySelector("#spinner");d.complete=()=>{d.style="transform: scale(1.2); opacity: 0",window.setTimeout((()=>{d.style.display="none"}),1e3)};const l=new class{constructor({targetElement:t}){this._targetElement=t,this._defaultLayout=["hospitalizedIncidence","hospitalized7Days","icuOccupation"],this._layout=[],this.widgetList=[],window.addEventListener("click",(t=>{if(t.target.closest(".widget-remove")){const e=t.target.closest(".widget-remove").getAttribute("widget-id");this._view=this._view.filter((t=>t.id!==e)),this.renderLayout()}})),window.addEventListener("DOMContentLoaded",(t=>{this.retrieveLayout()}))}injectData(t){this._dataSet=t,this._lastData=t[t.length-1],this.generateWidgetList(),this.renderLayout()}generateWidgetList(){for(const t in this._lastData)if(Object.hasOwnProperty.call(this._lastData,t)){const e=this._lastData[t];if("meta"!==t&&"_id"!==t){const{title:i,description:s}=e;this.widgetList.push({title:i,description:s,data:e,widgetName:t,widgetType:n})}}this.widgetList.push({title:"Krankenhauskapazitätsgraph",description:"Graphischer verlauf der Inzidenzzahlen",data:this._dataSet,widgetName:"linegraph",widgetType:o})}addWidgetToView(t){const e=this.widgetList.find((e=>e.widgetName===t));this._view=[...this._view,new e.widgetType(e.data,e.widgetName)],this.renderLayout()}createView(t){this._view=t.map((t=>{const e=this.widgetList.find((e=>e.widgetName==t));if(void 0!==e)return new e.widgetType(e.data,e.widgetName)})),this._view=this._view.filter((t=>null!=t))}getListOfWidget(){return this.widgetList}renderLayout(){void 0===this._view&&this.createView(this._layout),[...this._targetElement.childNodes].forEach((t=>t.remove()));const t=this._view.length===this.widgetList.length;[new r(this._dataSet),...this._view,new a({noWidgetsLeft:t})].forEach((t=>{null!==t&&this._targetElement.appendChild(t.render())&&t.hasRendered()})),this.saveLayout()}retrieveLayout(){const t=JSON.parse(localStorage.getItem("layout"));this.currentLayout=t||this._defaultLayout}saveLayout(){localStorage.setItem("layout",JSON.stringify(this.currentLayout))}get currentLayout(){return this._view.map((t=>t.widgetName))}set currentLayout(t){this._layout=t}}({targetElement:document.querySelector("#data-widgets")});new class{constructor({target:t,Controller:e}){this.target=t,this.controller=e,this.slider=t.querySelector(".widget-modal__slider"),window.addEventListener("click",(t=>{if(t.target.closest(".widget-creator")&&this.open(),t.target.closest(".widget-modal__close")&&this.close(),t.target.closest(".widget-modal__controls-button[increase]")&&this.moveRight(),t.target.closest(".widget-modal__controls-button[decrease]")&&this.moveLeft(),t.target.closest(".widget-preview__inFocus .widget-preview")){console.log("hit");const e=t.target.closest(".widget-preview").getAttribute("widgetname");null!==e&&(this.controller.addWidgetToView(e),this.close())}})),this.index=0,this.state=!1,window.addEventListener("touchstart",(t=>{this.state&&this.handleTouchEvent(t)})),window.addEventListener("touchend",(t=>{this.state&&this.handleTouchEvent(t)}))}handleTouchEvent(t){if("touchstart"==t.type&&(this.start=t.pageX),"touchend"==t.type&&(this.end=t.pageX),this.start&&this.end){if(this.start===this.end&&t.target.closest(".widget-preview__inFocus")){const e=t.target.closest(".widget-preview").getAttribute("widgetname");null!==e&&(this.controller.addWidgetToView(e),this.close())}this.start+.2*window.innerWidth>this.end&&this.moveRight(),this.start-.2*window.innerWidth<this.end&&this.moveLeft(),this.start=void 0,this.end=void 0}}renderModalList(){const t=this.controller.getListOfWidget();this.widgetList=t.filter((t=>![...document.querySelector("#data-widgets").childNodes].filter((t=>3!==t.nodeType)).map((t=>t.getAttribute("widgetname"))).includes(t.widgetName)));const{widgetList:e}=this;0!==e.length&&e.forEach((t=>{const e=document.createElement("div");e.className="widget-modal__slide-container";const i=new t.widgetType(t.data,t.widgetName);e.appendChild(i.render({preview:!0})),this.slider.appendChild(e),i.hasRendered()}))}open(){this.state=!0,this.target.setAttribute("visible",""),document.querySelector("body").style.overflow="hidden",this.renderModalList(),this.moveTo()}close(){this.state=!1,this.index=0,this.target.removeAttribute("visible"),document.querySelector("body").style="",[...this.slider.childNodes].forEach((t=>t.remove()))}moveRight(){const{length:t}=this.widgetList;this.index=this.index==t-1?0:this.index+1,this.moveTo()}moveLeft(){const{length:t}=this.widgetList;this.index=0==this.index?t-1:this.index-1,this.moveTo()}moveTo(){const t=[...this.slider.childNodes].map((t=>t.getBoundingClientRect().width)).reduce(((t,e,i,s)=>s.filter((e=>e===t)).length>=s.filter((t=>t===e)).length?t:e),null);const e=t===window.innerWidth?0:.5*t,[...i]=this.slider.childNodes;i.forEach(((t,e)=>{t.classList.remove("widget-preview__inFocus"),t.classList.add("widget-preview__outFocus"),e===this.index&&t.classList.replace("widget-preview__outFocus","widget-preview__inFocus")}));const s=this.widgetList[this.index]||{title:"Keine weiteren Widgets verfügbar"};document.querySelector(".widget-modal__controls-description").textContent=s.title;this.slider.style.transform=`translateX(${-1*(()=>t*this.index-e)()}px)`}}({target:document.querySelector(".widget-modal"),Controller:l}),(async()=>{let e,i;try{e=await fetch("./api/data"),i=await e.json()}catch(t){((t,e)=>{const i=document.createElement("span");i.className="message-error";const s=document.createElement("p");s.textContent=`Fehler: ${t}`;const n=document.createElement("button");n.className="message-close",n.innerHTML=Pangolicons.icons.x.toString({"stroke-width":"1.5"}),n.addEventListener("click",(t=>{i.remove()})),i.appendChild(s),i.appendChild(n),e.appendChild(i)})(t,document.querySelector("#data-display"))}const{history:s,timeStamp:n}=i;t(s),window.addEventListener("resize",(()=>{t(s)})),l.injectData(s);const{meta:r}=s[s.length-1];(({data:t,target:e}={})=>{const{currentAsOf:i}=t,s=document.createElement("div");s.id="data-sources",s.innerHTML=`\n\t\t<h3 class="source-heading">Daten zuletzt aktualisiert:</h3>\n\t\t<p>\n\t\t\tIntensivbelegung:\n\t\t\t<span class="source-date"\n\t\t\t\t>${new Date(i.icuOccupation).toLocaleString()}</span\n\t\t\t>\n\t\t</p>\n\t\t<p>\n\t\t\tHospitalisierung:\n\t\t\t<span class="source-date"\n\t\t\t\t>${new Date(i.hospitalized).toLocaleString()}</span\n\t\t\t>\n\t\t</p>\n\t`,e.appendChild(s)})({data:r,target:document.querySelector("#data-display")}),d.complete()})();
