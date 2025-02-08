import {Routes, Route, Navigate} from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import { Toaster } from 'react-hot-toast';
import { useThemeStore } from './store/useThemeStore';
import VerifyEmailPage from './pages/VerifyEmailPage';
import SendEmailPage from './pages/SendEmailPage';
import ForgotPassword from './pages/ForgotPassword'; 
import ResetPasswordPage from './pages/ResetPasswordPage';

function App() {
  const {theme} = useThemeStore();
  return (
    <div data-theme={theme}>
      <Routes>
        {/* <Route path='/' element={<HomePage />} /> */}
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/send-email' element={<SendEmailPage />} />
        <Route path='/verify-email' element={<VerifyEmailPage />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/reset-password' element={<ResetPasswordPage />} />
        <Route path='/login' element={<LoginPage />} />
      </Routes>

      <Toaster />
    </div>
  )
}

export default App
