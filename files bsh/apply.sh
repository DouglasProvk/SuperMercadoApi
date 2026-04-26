#!/usr/bin/env bash
# ================================================================
#  SuperGestão — Aplica refatoração e faz commit
#  Execute na RAIZ do repositório (onde está SuperMercadoApi.sln)
#  Exemplo: bash apply.sh
# ================================================================
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(pwd)"
CLIENT="$REPO_ROOT/supermercadoapi.client"
SERVER="$REPO_ROOT/SuperMercadoApi.Server"

echo "📁 Repositório: $REPO_ROOT"
echo "📁 Script dir:  $SCRIPT_DIR"

if [ ! -f "$REPO_ROOT/SuperMercadoApi.sln" ]; then
  echo "❌ Execute na raiz do repositório (onde está SuperMercadoApi.sln)"
  exit 1
fi

# ── Cria pastas ──────────────────────────────
mkdir -p "$CLIENT/src/services" "$CLIENT/src/contexts" \
         "$CLIENT/src/components" "$CLIENT/src/pages"

# ── Remove arquivos antigos ──────────────────
echo "🗑️  Limpando arquivos antigos..."
for f in \
  src/App.tsx src/App.css src/index.css src/main.tsx src/index.ts \
  src/services/api.ts \
  src/contexts/AuthContext.tsx \
  src/components/TwSidebar.tsx src/components/TwTopbar.tsx \
  src/components/TwAlertsList.tsx src/components/TwKpiCard.tsx \
  src/components/KpiCard.tsx src/components/AlertsList.tsx \
  src/components/SalesChart.tsx src/components/PrivateRoute.tsx \
  src/pages/DashboardTailwind.tsx src/pages/Dashboard.tsx \
  src/pages/Login.tsx src/pages/Produtos.tsx src/pages/Estoque.tsx \
  src/pages/Promocoes.tsx src/pages/Caixa.tsx src/pages/Vendas.tsx \
  src/pages/Usuarios.tsx
do
  rm -f "$CLIENT/$f"
done

# ── Copia novos arquivos do diretório do script ──
echo "📄 Copiando arquivos novos..."
cp "$SCRIPT_DIR/src/App.tsx"                         "$CLIENT/src/App.tsx"
cp "$SCRIPT_DIR/src/index.css"                       "$CLIENT/src/index.css"
cp "$SCRIPT_DIR/src/main.tsx"                        "$CLIENT/src/main.tsx"
cp "$SCRIPT_DIR/src/services/api.ts"                 "$CLIENT/src/services/api.ts"
cp "$SCRIPT_DIR/src/contexts/ThemeContext.tsx"        "$CLIENT/src/contexts/ThemeContext.tsx"
cp "$SCRIPT_DIR/src/contexts/AuthContext.tsx"         "$CLIENT/src/contexts/AuthContext.tsx"
cp "$SCRIPT_DIR/src/components/Sidebar.tsx"           "$CLIENT/src/components/Sidebar.tsx"
cp "$SCRIPT_DIR/src/components/Topbar.tsx"            "$CLIENT/src/components/Topbar.tsx"
cp "$SCRIPT_DIR/src/components/PrivateLayout.tsx"     "$CLIENT/src/components/PrivateLayout.tsx"
cp "$SCRIPT_DIR/src/pages/Login.tsx"                  "$CLIENT/src/pages/Login.tsx"
cp "$SCRIPT_DIR/src/pages/Dashboard.tsx"             "$CLIENT/src/pages/Dashboard.tsx"
cp "$SCRIPT_DIR/src/pages/Produtos.tsx"              "$CLIENT/src/pages/Produtos.tsx"
cp "$SCRIPT_DIR/src/pages/Estoque.tsx"               "$CLIENT/src/pages/Estoque.tsx"
cp "$SCRIPT_DIR/src/pages/Promocoes.tsx"             "$CLIENT/src/pages/Promocoes.tsx"
cp "$SCRIPT_DIR/src/pages/Caixa.tsx"                 "$CLIENT/src/pages/Caixa.tsx"
cp "$SCRIPT_DIR/src/pages/Vendas.tsx"                "$CLIENT/src/pages/Vendas.tsx"
cp "$SCRIPT_DIR/src/pages/Clientes.tsx"              "$CLIENT/src/pages/Clientes.tsx"
cp "$SCRIPT_DIR/src/pages/Financeiro.tsx"            "$CLIENT/src/pages/Financeiro.tsx"
cp "$SCRIPT_DIR/src/pages/Usuarios.tsx"              "$CLIENT/src/pages/Usuarios.tsx"
cp "$SCRIPT_DIR/vite.config.ts"                      "$CLIENT/vite.config.ts"
cp "$SCRIPT_DIR/tailwind.config.cjs"                 "$CLIENT/tailwind.config.cjs"

echo "  ✅ Todos os arquivos copiados"

# ── Corrige SpaProxyServerUrl no .csproj ─────
echo "🔧 Corrigindo .csproj (porta SPA Proxy)..."
CSPROJ="$SERVER/SuperMercadoApi.Server.csproj"
sed -i 's|<SpaProxyServerUrl>.*</SpaProxyServerUrl>|<SpaProxyServerUrl>https://localhost:5173</SpaProxyServerUrl>|g' "$CSPROJ"
echo "  ✅ SpaProxyServerUrl → https://localhost:5173"

# ── Remove MUI ───────────────────────────────
echo "🗑️  Removendo dependências MUI..."
cd "$CLIENT"
npm uninstall @mui/material @mui/icons-material @emotion/react @emotion/styled 2>/dev/null || echo "  (MUI não estava instalado)"

# ── npm install ───────────────────────────────
echo "📦 npm install..."
npm install
echo "  ✅ Dependências atualizadas"

# ── Git commit ────────────────────────────────
echo "📝 Commit..."
cd "$REPO_ROOT"
git add -A
git commit -m "refactor(frontend): design system + integração completa com API

- Remove MUI; zero dependência de UI library externa
- Design system com CSS variables (dark/light theme persistido)
- Fontes Syne + DM Sans
- ThemeContext + AuthContext (JWT auto-refresh via interceptor Axios)
- Sidebar, Topbar, PrivateLayout reutilizáveis
- Páginas totalmente integradas ao backend:
  Dashboard, Produtos (CRUD), Estoque, Promoções, Caixa PDV,
  Vendas, Clientes (novo), Financeiro (novo), Usuários
- vite.config.ts: proxy /api → https://localhost:7155
- .csproj: SpaProxyServerUrl corrigido para porta 5173"

echo ""
echo "✅ Concluído!"
echo "   Inicie o backend pelo Visual Studio — o Vite sobe automaticamente."
echo "   Ou rode manualmente: cd supermercadoapi.client && npm run dev"
