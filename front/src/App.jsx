import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, Routes } from 'react-router-dom';
import Test from './components/Test';
import Layout from './Layout';
import GoalDtl from './components/goal/GoalDtl';

function App() {

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/:goalid" element={<GoalDtl />} />
        <Route path="/test" element={<Test />} />
      </Route>
    </Routes>
  )
}

export default App;
