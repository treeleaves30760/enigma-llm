"use client";

import React, { useState, useRef } from 'react';
import TextInput from './TextInput';

const LLM_QA = () => {
    const [messages, setMessages] = useState<{sender: string, content: string}[]>([]);
    const [input, setInput] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };

    const handleFileUpload = () => {
        if (fileInputRef.current && fileInputRef.current.files && fileInputRef.current.files.length > 0) {
            setFile(fileInputRef.current.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!input.trim()) return;

        const newMessage = { sender: 'User', content: input };
        setMessages([...messages, newMessage]);

        console.log(input);
        const response = await fetch('http://127.0.0.1:5000/process', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({content: input })
        });
        const data = await response.json();
        
        if (data && data.reply) {
            setMessages(msgs => [...msgs, { sender: 'Bot', content: data.reply }]);
        }
        
        setInput('');
        setFile(null);
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
            <div className="input-group mb-3">
                <button className="btn btn-outline-secondary w-10" disable="true" onClick={() => fileInputRef.current?.click()}>Upload File</button>
                <input type="text" className="form-control w-50" value={input} onChange={handleInputChange} />
                <button className="btn btn-outline-secondary w-10" onClick={handleSubmit}>Send Message</button>
            </div>
        </div>
    );
};

export default LLM_QA;
