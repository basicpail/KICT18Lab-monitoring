import React, { useState } from 'react';

const messagesList = [
  "신혜야",
  "내가",
  "많이",
  "사랑해!",
];

function SettingPage() {
  const [messages, setMessages] = useState([]);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  const handleClick = () => {
    const x = Math.floor(Math.random() * (window.innerWidth - 200)); // 200 to account for message width
    const y = Math.floor(Math.random() * (window.innerHeight - 50)); // 50 to account for message height
    const newMessage = { id: Date.now(), x, y, text: messagesList[currentMessageIndex] };
    setMessages([...messages, newMessage]);
    setCurrentMessageIndex((currentMessageIndex + 1) % messagesList.length);
  };
  
  return (
    <div className="relative h-screen w-screen overflow-hidden flex items-center justify-center">
      <button
        className="bg-red-500 text-white py-2 px-4 rounded-full hover:bg-red-600 transition duration-300"
        onClick={handleClick}
      >
        눌려봐 ♥
      </button>
      {messages.map((message) => (
        <div
          key={message.id}
          className="absolute text-2xl text-red-500 animate-fadeIn"
          style={{ top: `${message.y}px`, left: `${message.x}px` }}
        >
          {message.text}
        </div>
      ))}
    </div>
  );
}

export default SettingPage;
