import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';
import '@styles/NotFound.scss';

const NotFound = () => {
    return (
        <div className="not-found">
            <div>
                <FaExclamationTriangle size={50} color="#f39c12" />
                <h1>페이지를 찾을 수 없습니다</h1>
                <p>죄송합니다. 요청하신 페이지는 존재하지 않습니다.</p>
            </div>
        </div>
    );
};

export default NotFound;
