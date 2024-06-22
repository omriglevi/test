import './App.css';
import LoginPage from './Login';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/use-auth'
import { ProtectedRoute } from './ProtectedRoute';
import Navbar from './Navbar';

function App() {
      return (
        <>
        <AuthProvider>
        <Navbar/>
        <Routes>
          <Route path="/" element={
            <ProtectedRoute>
            <div>
              <h1>Home</h1>
            </div>
            </ProtectedRoute>
          } />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
        </AuthProvider>
        </>
      );
}

export default App;
