import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, Routes } from 'react-router-dom';
import Test from './components/Test';
import Layout from './Layout';
import ChatPage from './components/chat/ChatPage';


function App() {

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/test" element={<Test />} />
        <Route path="/chat" element={<ChatPage />} />
      </Route>

    </Routes>
  )
}

export default App;
