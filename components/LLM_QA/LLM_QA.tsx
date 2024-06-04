"use client";

import React, { useState } from 'react';
import TextInput from './TextInput';

const LLM_QA = () => {
  const [messages, setMessages] = useState<{sender: string, content: string}[]>([]);
  const [input, setInput] = useState('');

  // 處理輸入變更
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  // 處理表單提交
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    // 更新消息
    const newMessage = { sender: 'User', content: input };
    setMessages([...messages, newMessage]);

    // 發送請求
    const response = await fetch('/localhost:5000', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: input })
    });
    const data = await response.json();
    
    if (data && data.reply) {
      setMessages(msgs => [...msgs, { sender: 'Bot', content: data.reply }]);
    }
    
    setInput('');
  };

  return (
    <div className="container">
      <div className="message-container">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender === 'User' ? 'user-message' : 'bot-message'}`}>
            <p>{msg.content}</p>
          </div>
        ))}
      </div>
      <TextInput onSendMessage={handleSubmit} />
    </div>
  );
};

export default LLM_QA;
