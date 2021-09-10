/** @format */

/*

    This file provides a simple utiltiy to parse a provided text into a basic DOM Object and extract one or multiple specified DOM Node from it

*/

/*

    Import the package and destructure the parser

*/

import pkg from 'node-html-parser';
const { parse } = pkg;

/**

    @description method to parse a provided HTML string into a DOM Object and extract one or multiple nodes from it

    @param { String } htmlstring - the provided String that should be parsed
    @param { String[] } nodes - Beginning from the second argument of the method, strings can be provided, that will be used to extract the DOMNodes.

    @returns { HTMLElement[] } an array of Nodes that were extracted

*/

const ParseHTMLForNode = (htmlString, ...nodes) => {
	/*

        Parse the provided HTML String

    */

	const DOMObject = parse(htmlString);

	/*

        Map the provided nodes Array to a new Array containing the nodes

    */

	return nodes.map((entry) => DOMObject.querySelectorAll(entry));
};

/*

    Export the method

*/

export { ParseHTMLForNode };
