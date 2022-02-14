/** @format */

import { Message } from '../UI/Message';

export const Messages = ({ messages }) => (
	<div
		id="messages"
		className="mx-4 my-4 flex max-w-screen-lg flex-col lg:mx-auto">
		{messages.map(
			(content, index) =>
				content && <Message key={index}>{content}</Message>
		)}
	</div>
);
