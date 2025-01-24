import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { produce } from 'immer';
import '@styles/TestStyle.scss';

const Test = () => {
    const SERVER_URL = import.meta.env.VITE_SERVER_URL;
    const navigate = useNavigate();

    const [list, setList] = useState([]);
    const [form, setForm] = useState({
        name: '',
        chkType: false,
        birth: '',
        address: '',
        files: [],
        regDate: ''
    });

    // 목록 조회
    const getTest = useCallback(async () => {
        try {
            const response = await axios.post(
                `${SERVER_URL}/test/getTestList`,
                { srhName: "" },
                { headers: { 'Content-Type': 'application/json' } }
            );
            setList(response.data);
        } catch (err) {
            alert("목록을 가져오지 못했습니다.");
        }
    }, []);

    // 초기 조회
    useEffect(() => {
        getTest();
    }, []);

    // Change Value
    const onChange = useCallback((e) => {
        const { name, value, type, checked } = e.target;

        setForm(
            produce((draft) => {
                if (type === 'checkbox') {
                    draft[name] = checked;
                } else {
                    draft[name] = value;
                }
            })
        );
    }, []);

    // 파일 선택 처리 (파일 없는 경우 제외)
    const onFileChange = useCallback((e) => {
        setForm(
            produce((draft) => {
                draft.files = Array.from(e.target.files);  // 여러 파일을 배열로 저장
            })
        );
    }, []);

    // 등록
    const insertTest = useCallback(async () => {
        if (!form.name.trim()) {
            alert("이름을 입력해주세요.");
            return;
        }
        if (!form.birth) {
            alert("생일을 입력해주세요.");
            return;
        }

        // formData (파일 없는 경우 제외)
        const formData = new FormData();
        formData.append('name', form.name);
        formData.append('chkType', form.chkType);
        formData.append('birth', form.birth);
        formData.append('address', form.address);

        form.files.forEach(file => {
            formData.append('files', file);
        });

        try {
            await axios.post(
                `${SERVER_URL}/test/registTest`,
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );

            await getTest();
            setForm({
                name: '',
                chkType: false,
                birth: '',
                address: '',
                files: []
            });

        } catch (error) {
            alert("등록 중 에러가 발생했습니다.");
        }
    }, [form]);

    // 메인으로
    const toMain = () => {
        navigate('/');
    }

    // 렌더링
    return (
        <>
            <button onClick={toMain}>메인으로</button>
            <ul className='test'>
                {list.map(test => (
                    <li key={test.id}>
                        {test.name} {test.chkType} {test.birth} {test.address} {test.filePath} {test.regDate.split('T')[0]}
                    </li>
                ))}
            </ul>

            <br />

            이름 : <input type='text'
                name='name'
                value={form.name}
                onChange={onChange}
            /><br />
            체크 : <input type='checkbox'
                name='chkType'
                checked={form.chkType}
                onChange={onChange}
            /><br />
            생일 : <input type='date'
                name='birth'
                value={form.birth}
                onChange={onChange}
            /><br />
            주소 : <input type='text'
                name='address'
                value={form.address}
                onChange={onChange}
            /><br />
            파일 : <input type='file' multiple
                name='files'
                onChange={onFileChange}
            /><br />
            <button onClick={insertTest}>등록</button>
        </>
    );
};

export default Test;