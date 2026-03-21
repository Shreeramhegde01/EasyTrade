import { useState, useCallback, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PostItem from './pages/PostItem';
import EditListing from './pages/EditListing';
import ListingDetails from './pages/ListingDetails';
import SearchResults from './pages/SearchResults';
import ChatPage from './pages/ChatPage';
import Profile from './pages/Profile';
import MyListings from './pages/MyListings';

function App() {
  const [authKey, setAuthKey] = useState(0);
  const onAuthChange = useCallback(() => setAuthKey((k) => k + 1), []);

  // Listen for auth-change events dispatched from Navbar logout
  useEffect(() => {
    const handler = () => onAuthChange();
    window.addEventListener('auth-change', handler);
    return () => window.removeEventListener('auth-change', handler);
  }, [onAuthChange]);

  return (
    <BrowserRouter>
      <Navbar key={authKey} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login onAuthChange={onAuthChange} />} />
        <Route path="/signup" element={<Signup onAuthChange={onAuthChange} />} />
        <Route path="/post" element={<PostItem />} />
        <Route path="/edit/:id" element={<EditListing />} />
        <Route path="/listing/:id" element={<ListingDetails />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/my-listings" element={<MyListings />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
