import React from 'react';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  StorefrontRounded as StoreIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [email, setEmail] = React.useState('');
  const [senha, setSenha] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, senha);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.message ||
          'Erro ao fazer login. Verifique suas credenciais.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1abc9c 0%, #16a085 100%)',
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={8}
          sx={{
            p: 4,
            borderRadius: 2,
            backgroundColor: '#ffffff',
          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box
              sx={{
                width: 60,
                height: 60,
                background: 'linear-gradient(135deg, #1abc9c 0%, #16a085 100%)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: 32,
                margin: '0 auto 1rem',
              }}
            >
              <StoreIcon sx={{ fontSize: 32 }} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
              SuperGestao
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Sistema de Gestao para Supermercados
            </Typography>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* Form */}
          <Box component="form" onSubmit={handleLogin}>
            <TextField
              fullWidth
              label="E-mail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              margin="normal"
              required
              autoFocus
              variant="outlined"
            />

            <TextField
              fullWidth
              label="Senha"
              type={showPassword ? 'text' : 'password'}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              disabled={loading}
              margin="normal"
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      disabled={loading}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              fullWidth
              variant="contained"
              size="large"
              type="submit"
              disabled={loading}
              sx={{
                mt: 3,
                mb: 2,
                background: 'linear-gradient(135deg, #1abc9c 0%, #16a085 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #16a085 0%, #117a65 100%)',
                },
              }}
            >
              {loading ? <CircularProgress size={24} /> : 'Entrar'}
            </Button>

            {/* Demo Credentials */}
            <Paper
              sx={{
                p: 2,
                mt: 3,
                backgroundColor: '#f0f9f7',
                border: '1px solid #1abc9c',
              }}
            >
              <Typography variant="caption" sx={{ fontWeight: 600, color: '#1abc9c' }}>
                Credenciais de Teste:
              </Typography>
              <Typography variant="caption" display="block" sx={{ color: 'text.secondary', mt: 0.5 }}>
                E-mail: admin@supermercado.com
              </Typography>
              <Typography variant="caption" display="block" sx={{ color: 'text.secondary' }}>
                Senha: senha123
              </Typography>
            </Paper>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};
