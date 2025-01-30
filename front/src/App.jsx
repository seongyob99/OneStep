import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, Routes } from 'react-router-dom';
import Test from './components/Test';
import Layout from './Layout';
import ChatRoom from './components/chat/ChatRoom';
import ChatPage from './components/chat/ChatPage';


function App() {

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/test" element={<Test />} />
        <Route path="/chat" element={<ChatPage />}>
          <Route path=":chatId" element={<ChatRoom />} />
        </Route>
      </Route>

    </Routes>
  )
}

export default App;
