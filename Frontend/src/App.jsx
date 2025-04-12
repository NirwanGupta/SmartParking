import {Routes, Route, Navigate} from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import { Toaster } from 'react-hot-toast';
import { useThemeStore } from './store/useThemeStore';
import VerifyEmailPage from './pages/VerifyEmailPage';
import SendEmailPage from './pages/SendEmailPage';
import ForgotPassword from './pages/ForgotPassword';
import ResetPasswordPage from './pages/ResetPasswordPage';
import HomePage from './pages/HomePage';
import Navbar from './components/NavBar';
import { useEffect } from 'react';
import { useAuthStore } from './store/useAuthStore';
import { Loader } from 'lucide-react';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import GoogleMapPage from './pages/GoogleMapPage';
import ParkingPage from './pages/parkingPage';
import BookSlot from './pages/BookSlot';

function App() {
  const {checkAuth, isCheckingAuth, authUser} = useAuthStore();
  const {theme} = useThemeStore();
  useEffect(() => {
    checkAuth();
  }, [checkAuth])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme]);

  if(isCheckingAuth && !authUser) {
    return <div className='flex items-center justify-center h-screen' >
      <Loader className='size-10 animate-spin' />
    </div>
  }

  return (
    <div data-theme={theme}>
      <Navbar />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/send-email' element={<SendEmailPage />} />
        <Route path='/verify-email' element={<VerifyEmailPage />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/reset-password' element={<ResetPasswordPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/profile' element={<ProfilePage />} />
        <Route path='/settings' element={<SettingsPage />} />
        <Route path='/map' element={<GoogleMapPage />} />
        <Route path='/parkings' element={<ParkingPage />} />
        <Route path='/bookSlot' element={<BookSlot />} />
      </Routes>

      <Toaster />
    </div>
  )
}

export default App
