import {Routes, Route, Navigate} from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import { Toaster } from 'react-hot-toast';
import { useThemeStore } from './store/useThemeStore';

function App() {
  const {theme} = useThemeStore();
  return (
    <div data-theme={theme}>
      <Routes>
        {/* <Route path='/' element={<HomePage />} /> */}
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/login' element={<LoginPage />} />
      </Routes>

      <Toaster />
    </div>
  )
}

export default App
