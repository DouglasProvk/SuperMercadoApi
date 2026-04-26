import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const Login: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const { toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { if (isAuthenticated) navigate('/dashboard'); }, [isAuthenticated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, senha);
    } catch (err: any) {
      setError(err?.response?.data?.erro || err?.message || 'Credenciais inválidas.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-base)',
      padding: '24px',
      position: 'relative',
    }}>
      {/* BG decoration */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        background: 'radial-gradient(ellipse 60% 50% at 50% 0%, var(--accent-dim) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Theme toggle */}
      <button
        className="icon-btn"
        style={{ position: 'absolute', top: 20, right: 20 }}
        onClick={toggleTheme}
      >
        {isDark ? '☀️' : '🌙'}
      </button>

      <div style={{ width: '100%', maxWidth: 400, position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 56, height: 56,
            borderRadius: 14,
            background: 'var(--accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Syne, sans-serif',
            fontWeight: 800, fontSize: 22, color: '#0d0f14',
            margin: '0 auto 14px',
            boxShadow: '0 0 30px var(--accent-glow)',
          }}>SG</div>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 24, margin: 0 }}>
            SuperGestão
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4 }}>
            Sistema de Gestão para Supermercados
          </p>
        </div>

        {/* Card */}
        <div className="card card-pad">
          {error && (
            <div style={{
              background: 'var(--danger-dim)', border: '1px solid var(--danger)',
              borderRadius: 'var(--radius-sm)', padding: '10px 14px',
              fontSize: 13, color: 'var(--danger)', marginBottom: 16,
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="input-wrap">
              <label className="input-label">E-mail</label>
              <input
                className="input"
                type="email"
                placeholder="admin@supermercado.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
                disabled={loading}
              />
            </div>

            <div className="input-wrap">
              <label className="input-label">Senha</label>
              <div style={{ position: 'relative' }}>
                <input
                  className="input"
                  type={showPwd ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                  disabled={loading}
                  style={{ paddingRight: 40 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  style={{
                    position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--text-muted)', fontSize: 15,
                  }}
                >
                  {showPwd ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%', padding: '11px', marginTop: 4, fontSize: 14 }}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          {/* Demo credentials */}
          <div style={{
            marginTop: 20, padding: '12px 14px',
            background: 'var(--accent-dim)', borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--accent)',
          }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent)', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '.06em' }}>
              Credenciais de teste
            </p>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0 }}>
              admin@supermercado.com / senha123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
