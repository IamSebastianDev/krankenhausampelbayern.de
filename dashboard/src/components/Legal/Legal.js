/** @format */

import { Section } from '../UI/Section';

export const Legal = () => {
	return (
		<Section id="impressum">
			<div className="mx-auto max-w-screen-sm px-6 text-zinc-800 dark:text-zinc-100">
				<div className="my-12">
					<h1 className="py-2 text-2xl">Impressum</h1>
					<h3 className="py-2 text-xl">Angaben gemäß § 5 TMG:</h3>
					<p>Sebastian Heinz</p>
					<h3 className="py-2 text-xl">Postanschrift:</h3>
					<p>
						Nestroystraße 15
						<br />
						81373 München
					</p>
					<h3 className="py-2 text-xl">Kontakt:</h3>
					<p>E-Mail: sebastian@iamsebastian.dev</p>
				</div>
				<div className="my-12">
					<h3 className="py-2 text-xl">Google Fonts:</h3>
					<p>
						Auf diesem Webauftritt werden externe Schriften von
						Google Fonts verwendet. Google Fonts ist ein Dienst der
						Google Inc. ("Google"). Die Einbindung dieser Web Fonts
						erfolgt durch einen Serveraufruf, in der Regel ein
						Server von Google in den USA. Hierdurch wird an den
						Server übermittelt, welche unserer Internetseiten Sie
						besucht haben. Auch wird die IP-Adresse des Browsers des
						Endgerätes des Besuchers dieser Internetseiten von
						Google gespeichert. Nähere Informationen finden Sie in
						den Datenschutzhinweisen von Google, die Sie hier
						abrufen können: www.google.com/policies/privacy/ und
						https://fonts.google.com/about#
					</p>
				</div>
			</div>
		</Section>
	);
};
