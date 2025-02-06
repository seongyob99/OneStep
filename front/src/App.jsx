import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, Routes } from 'react-router-dom';
import Test from './components/Test';
import Layout from './Layout';
import GoalList from './components/goal/GoalList';
import GoalRegister from './components/goal/GoalRegister';
import GoalDtl from './components/goal/GoalDtl';
import GoalUpdate from './components/goal/GoalUpdate';
import ChatPage from './components/chat/ChatPage';
import ChatRoom from './components/chat/ChatRoom';
import JoinForm from './components/member/JoinForm';
import MyPage from './components/member/MyPage';
import MemberDetail from './components/member/MemberDetail';
import MyPage from './components/member/MyPage';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/test" element={<Test />} />

        <Route path="/" element={<GoalList />} />
        <Route path="/goals/register" element={<GoalRegister />} />
        <Route path="/:goalid" element={<GoalDtl />} />
        <Route path="/:goalid/update" element={<GoalUpdate />} />

        <Route path="/member/join" element={<JoinForm />} />
        <Route path="/member/info" element={<MyPage />} />
        <Route path="/member/edit" element={<MemberDetail />} />

        <Route path="/chat" element={<ChatPage />}>
          <Route path=":chatId" element={<ChatRoom />} />
        </Route>
        <Route path="/mypage" element={< MyPage />} />
      </Route>
    </Routes>

  );
}

export default App;