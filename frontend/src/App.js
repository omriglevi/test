import './App.css';
import LoginPage from './LoginPage';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/use-auth'
import { ProtectedRoute } from './ProtectedRoute';
import AuctionsPage from './AuctionsPage';
import Navbar from './Navbar';
import Layout from './Layout';


function App() {
      return (
        <AuthProvider>
        <Navbar/>
        <Layout>
        <Routes>
          <Route path="/" element={
            <ProtectedRoute>
                <AuctionsPage />
            </ProtectedRoute>
          } />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
        </Layout>
        </AuthProvider>
      );
}

export default App;
