import React, { useState, useRef } from 'react';

const TextInput = () => {
    const [message, setMessage] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(event.target.value);
    };

    const handleFileUpload = () => {
        if (fileInputRef.current && fileInputRef.current.files && fileInputRef.current.files.length > 0) {
            setFile(fileInputRef.current.files[0]);
        }
    };

    const handleSendMessage = () => {
        const fileInfo = file ? `File: ${file.name}, Size: ${file.size} bytes. ` : '';
        // Combine file info with the message
        const fullMessage = `${fileInfo}Message: ${message}`;
        console.log(fullMessage);
        // Reset the input fields
        setMessage('');
        setFile(null);
    };

    return (
        <div className="input-group mb-3">
            <input type="file" className="form-control w-10 d-none" ref={fileInputRef} onChange={handleFileUpload}/>
            <button className="btn btn-outline-secondary w-10" onClick={() => fileInputRef.current?.click()}>Upload File</button>
            <input type="text" className="form-control w-50" value={message} onChange={handleInputChange} />
            <button className="btn btn-outline-secondary w-10" onClick={handleSendMessage}>Send Message</button>
        </div>
    );
};

export default TextInput;
