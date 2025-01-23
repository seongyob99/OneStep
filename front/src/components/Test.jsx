import React from 'react';
import '@styles/TestStyle.scss';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import usePromise from '../lib/usePromise';

const Test = () => {
    const SERVER_URL = import.meta.env.VITE_SERVER_URL;
    const navigate = useNavigate();

    // 목록 조회
    const getTest = () => {
        return axios.post(
            `${SERVER_URL}/test/getTestList`,
            { name: "" },
            { withCredentials: true }
        );
    }
    console.log(usePromise(getTest, []))
    const [loading, resolved, error] = usePromise(getTest, []);

    // 버튼 클릭
    const toMain = () => {
        navigate('/');
    }

    if (loading) {
        return <div>Loading...</div>
    }
    if (!resolved) {
        return null;
    }
    if (error) {
        return <div>Error</div>;
    }

    // 렌더링
    const { testList } = resolved.data;
    return (
        <>
            <button onClick={toMain}>메인으로</button>
            <ul className='test'>
                {testList.map(test => (
                    <li key={test.id}>
                        {test.name} {test.chkType} {test.birth} {test.address}
                    </li>
                ))}
            </ul>
        </>
    );
};

export default Test;