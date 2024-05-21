import './App.css';
import { Route, Routes } from 'react-router-dom';
import HomePage from "./Pages/HomePage";
import MemberPage from "./Pages/MemberPage";
import VoterPage from "./Pages/VoterPage";

function App() {
  return (
    <div className="App">
    <Routes>
      <Route path="/" element={<HomePage/>} exact/>
      <Route path="/member" element={<MemberPage/>}/>
      <Route path="/voter" element={<VoterPage/>}/>
    </Routes>
    </div>
  );
}

export default App;
