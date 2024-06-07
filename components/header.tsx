'use client';

import React, { useState } from 'react';

const Header = () => {
    const [isActive, setIsActive] = useState(true);

    const toggleClass = () => {
        setIsActive(!isActive);
    };

    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container">
                <a className="navbar-brand" href="/LLM_QA">LLM-TA</a>
                <button className="navbar-toggler" type="button" onClick={toggleClass} data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
                </button>
                <div className={isActive ? 'collapse navbar-collapse' : 'navbar-collapse'} id="navbarSupportedContent">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    <li className="nav-item">
                        <a className="nav-link" href="/LLM_QA">Home</a>
                    </li>
                    {/* <li className="nav-item">
                        <a className="nav-link" href="/Questions">Question</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="/Questions_list">Question List</a>
                    </li> */}
                    <li className="nav-item">
                        <a className="nav-link" href="/Documents_Manage">Document</a>
                    </li>
                </ul>
                <form className="d-flex" role="search">
                    <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" id="HeaderSearchBar"/>
                    <button className="btn btn-outline-success" type="submit">Search</button>
                </form>
                </div>
            </div>
        </nav>
    );
}

export default Header;