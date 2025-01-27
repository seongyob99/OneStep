import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, Routes } from 'react-router-dom';
import Test from './components/Test';
import Layout from './Layout';
import GoalList from './components/goal/GoalList';
import GoalRegister from './components/goal/GoalRegister';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* 기존 Test 라우트 */}
        <Route path="/test" element={<Test />} />

        {/* 목표 관련 라우트 추가 */}
        <Route path="/" element={<GoalList />} />
        <Route path="/goals/register" element={<GoalRegister />} />
      </Route>
    </Routes>
  );
}

export default App;