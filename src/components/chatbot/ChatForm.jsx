import React, { useRef } from 'react'

const ChatForm = ({chatHistory, setChatHistory, generateChatResponse}) => {
	// console.log(chatHistory, setChatHistory);

  const inputRef = useRef();

  const handleFormSubmit = (e) => {
    e.preventDefault();

	// console.log(inputRef)

	const userMessage = inputRef.current.value.trim();

	if(!userMessage) return;
	inputRef.current.value = "";    

	setChatHistory((history) => [...history, {role: "user", text: userMessage}]);

	setTimeout(() => {
		setChatHistory((history) => [...history, {role: "model", text: "생각중..."}]);
		generateChatResponse([...chatHistory, {role: "user", text: userMessage}]);
	}, 600)
  };

  return (
	<form className='chat-form' onSubmit={handleFormSubmit}>
		<input type="text" placeholder='메시지를 입력하세요...' className='message-input' ref={inputRef} required/>
		<button className='material-symbols-outlined'>arrow_upward</button>
	</form>
  )
}

export default ChatForm;