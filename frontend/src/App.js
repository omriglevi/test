import './App.css';
import LoginPage from './LoginPage';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/use-auth'
import { ProtectedRoute } from './ProtectedRoute';
import AuctionsPage from './AuctionsPage';
import Navbar from './Navbar';

function App() {
      return (
        <>
        <AuthProvider>
        <Navbar/>
        <Routes>
          <Route path="/" element={
            <ProtectedRoute>
                <AuctionsPage />
            </ProtectedRoute>
          } />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
        </AuthProvider>
        </>
      );
}

export default App;
