'use client';

import React, { useState, useEffect } from 'react';

export default function DocumentsManage() {
    const [text, setText] = useState('');
    const [submissions, setSubmissions] = useState([]);
    const [editIndex, setEditIndex] = useState(-1);
    const [editText, setEditText] = useState('');

    useEffect(() => {
        fetchDocuments();
    }, []);

    const handleTextChange = (event) => {
        setText(event.target.value);
    };

    const handleEditChange = (event) => {
        setEditText(event.target.value);
    };

    const handleSave = async () => {
        try {
            const response = await fetch('http://127.0.0.1:5000/add_document', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content: text })
            });
            if (response.ok) {
                setText('');
                fetchDocuments();
            } else {
                console.error('Failed to save document:', await response.json());
            }
        } catch (error) {
            console.error('Error saving document:', error);
        }
    };

    const handleUpdate = async (index) => {
        if (editIndex !== -1) {
            try {
                const old_content = submissions[editIndex];
                const response = await fetch('http://127.0.0.1:5000/update_document', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ old_content: old_content, new_content: editText })
                });
                if (response.ok) {
                    setEditIndex(-1);
                    fetchDocuments();
                } else {
                    console.error('Failed to update document:', await response.json());
                }
            } catch (error) {
                console.error('Error updating document:', error);
            }
        }
    };

    const handleEdit = (index) => {
        setEditIndex(index);
        setEditText(submissions[index]);
    };

    const handleDelete = async (content) => {
        try {
            const response = await fetch('http://127.0.0.1:5000/delete_document', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content: content })
            });
            if (response.ok) {
                fetchDocuments();
            } else {
                console.error('Failed to delete document:', await response.json());
            }
        } catch (error) {
            console.error('Error deleting document:', error);
        }
    };

    const fetchDocuments = async () => {
        try {
            const response = await fetch('http://127.0.0.1:5000/get_documents');
            if (response.ok) {
                const data = await response.json();
                setSubmissions(data.documents);
            } else {
                console.error('Failed to fetch documents');
            }
        } catch (error) {
            console.error('Error fetching documents:', error);
        }
    };

    return (
        <div className="container">
            <br />
            <div className="input-group">
                <span className="input-group-text">請輸入知識</span>
                <textarea className="form-control" aria-label="With textarea" value={text} onChange={handleTextChange}></textarea>
                <button className="btn btn-outline-secondary" onClick={handleSave}>儲存到後端資料庫</button>
            </div>
            <div>
                {submissions.map((submission, index) => (
                    <div className="card m-2" key={index}>
                        <div className="card-body">
                            {editIndex === index ? (
                                <textarea className="form-control" value={editText} onChange={handleEditChange}></textarea>
                            ) : (
                                <p>{submission}</p>
                            )}
                            {editIndex === index ? (
                                <button className="btn btn-success m-1" onClick={() => handleUpdate(index)}>更新</button>
                            ) : (
                                <button className="btn btn-primary m-1" onClick={() => handleEdit(index)}>編輯</button>
                            )}
                            <button className="btn btn-danger m-1" onClick={() => handleDelete(submission)}>刪除</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

