// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Dashboard from "./pages/Dashboard";
import PostLostItem from "./pages/PostLostItem";
import PostFoundItem from "./pages/PostFoundItem";
import ReportedItems from "./pages/ReportedItems";
import LostItemDetail from "./pages/LostItemDetail";
import FoundItemsList  from "./pages/FoundItemsList";
import Chatbox from './pages/Chatbox';
import HeroSection from './pages/HeroSection';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HeroSection />} />
        <Route path="/register" element={<Register />} /> 
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/post-lost" element={<PostLostItem />} />
        <Route path="/post-found" element={<PostFoundItem />} />
        <Route path="/reported-items" element={<ReportedItems />} />
        <Route path="/lost-item/:id" element={<LostItemDetail />} />
        <Route path="/found-items" element={<FoundItemsList />} />
        <Route path="/chat/:recipientId" element={<Chatbox />} />

      </Routes>
    </Router>
  );
}

export default App;
