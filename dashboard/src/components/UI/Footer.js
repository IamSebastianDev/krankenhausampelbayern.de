/** @format */

import { InternalLink } from '../Navigation/InternalLink';
import { ExternalLink } from '../Navigation/ExternalLink';

export const Footer = () => {
	return (
		<footer className="mt-6 border-t border-t-zinc-500 p-6 text-zinc-500">
			<div className="mx-auto max-w-screen-lg px-4 text-center text-sm">
				<p className="py-2">
					Die Daten dieser Webseite wurden automatisch erstellt. Die
					Quelle der Daten ist das{' '}
					<ExternalLink
						className="text-zinc-800 underline dark:text-zinc-200"
						href="https://www.lgl.bayern.de/gesundheit/infektionsschutz/infektionskrankheiten_a_z/coronavirus/karte_coronavirus/index.htm">
						Bayrisches Landesamt für Gesundheit und
						Lebensmittelsicherheit
					</ExternalLink>
					. Es wird keine Garantie für die Korrektheit der Daten
					übernommen.
				</p>
				<p className="py-2">
					Dieses Projekt ist Open Source mit einer{' '}
					<ExternalLink
						className="text-zinc-800 underline dark:text-zinc-200"
						href="https://opensource.org/licenses/MIT">
						MIT Lizenz
					</ExternalLink>
					. Du kannst den kompletten Quellcode{' '}
					<ExternalLink
						className="text-zinc-800 underline dark:text-zinc-200"
						href="https://github.com/IamSebastianDev/krankenhausampelbayern.de">
						hier
					</ExternalLink>{' '}
					finden.
				</p>
				<p className="py-2">
					© {new Date().getFullYear()}{' '}
					<ExternalLink
						className="text-zinc-800 underline dark:text-zinc-200"
						href="https://iamsebastian.dev">
						Sebastian Heinz
					</ExternalLink>{' '}
					//{' '}
					<InternalLink
						className="text-zinc-800 underline dark:text-zinc-200"
						to="/legal">
						Impressum
					</InternalLink>{' '}
					//{' '}
					<InternalLink
						className="text-zinc-800 underline dark:text-zinc-200"
						to="/legal">
						Privacy Policy
					</InternalLink>
				</p>
			</div>
		</footer>
	);
};
