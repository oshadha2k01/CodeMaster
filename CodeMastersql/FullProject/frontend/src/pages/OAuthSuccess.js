import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { toast } from 'react-toastify';

export default function OAuthSuccess() {
  const [params] = useSearchParams();
  const token = params.get('token');
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      toast.error('Login failed');
      navigate('/signin', { replace: true });
      return;
    }

    try {
      login(token);
      toast.success('Logged in with Google');
      navigate('/home', { replace: true });
    } catch (err) {
      toast.error('Authentication error');
      navigate('/signin', { replace: true });
    }
  }, [token, login, navigate]);

  return null;
}
