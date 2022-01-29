/** @format */

import { Message } from '../UI/Message';

export const Messages = ({ messages }) => (
	<div
		id="messages"
		className="mx-4 my-4 lg:mx-auto max-w-screen-lg flex flex-col">
		{messages.map(
			(content, index) =>
				content && <Message key={index}>{content}</Message>
		)}
	</div>
);
