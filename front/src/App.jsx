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

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/test" element={<Test />} />

        <Route path="/" element={<GoalList />} />
        <Route path="/goals/register" element={<GoalRegister />} />
        <Route path="/:goalid" element={<GoalDtl />} />
        <Route path="/:goalid/update" element={<GoalUpdate />} />

        <Route path="/chat" element={<ChatPage />}>
          <Route path=":chatId" element={<ChatRoom />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;