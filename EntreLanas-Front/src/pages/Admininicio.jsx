import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function AdminInicio() {
  const [stats, setStats] = useState({ productos: 0, pedidos: 0, usuarios: 0 });

  useEffect(() => {
    // Cargar contadores reales desde el backend
    const fetchStats = async () => {
      try {
        const [prodRes, pedRes] = await Promise.all([
          fetch('http://localhost:8080/api/productos'),
          fetch('http://localhost:8080/api/pedidos'),
        ]);
        const productos = await prodRes.json();
        const pedidos   = await pedRes.json();
        setStats(prev => ({
          ...prev,
          productos: productos.length,
          pedidos: pedidos.length,
        }));
      } catch {
        // Si falla, deja los contadores en 0
      }
    };
    fetchStats();
  }, []);

  const secciones = [
    {
      path: '/admin/productos',
      label: 'Productos',
      icono: 'fa-box',
      descripcion: 'Gestiona el catálogo completo',
      contador: stats.productos,
      contadorLabel: 'productos',
      // Gradiente cálido — hilo y lana
      gradiente: 'linear-gradient(135deg, #c9a87c 0%, #e8c99a 50%, #f5e6d0 100%)',
      emoji: '🧶',
    },
    {
      path: '/admin/pedidos',
      label: 'Pedidos',
      icono: 'fa-truck',
      descripcion: 'Consulta y gestiona los pedidos',
      contador: stats.pedidos,
      contadorLabel: 'pedidos',
      // Gradiente verde suave — envío y entrega
      gradiente: 'linear-gradient(135deg, #7cad8f 0%, #a3c9b0 50%, #d4edda 100%)',
      emoji: '📦',
    },
    {
      path: '/admin/usuarios',
      label: 'Usuarios',
      icono: 'fa-users',
      descripcion: 'Administra las cuentas de clientes',
      contador: stats.usuarios,
      contadorLabel: 'usuarios',
      // Gradiente rosa suave — comunidad y personas
      gradiente: 'linear-gradient(135deg, #c97c9a 0%, #e0a8bf 50%, #f5d4e2 100%)',
      emoji: '👥',
    },
  ];

  return (
    <div>
      {/* Cabecera */}
      <div className="mb-5">
        <h2 className="logo-text fw-bold mb-1" style={{ fontSize: '2rem' }}>
          <i className="fa-solid fa-house text-accent me-2"></i>
          Panel de Administración
        </h2>
        <p className="text-muted small">Bienvenido. Selecciona una sección para comenzar.</p>
      </div>

      {/* Tarjetas de acceso rápido */}
      <div className="row g-4">
        {secciones.map(({ path, label, icono, descripcion, contador, contadorLabel, gradiente, emoji }) => (
          <div key={path} className="col-12 col-md-4">
            <Link to={path} className="text-decoration-none">
              <div
                className="rounded-4 overflow-hidden shadow-sm position-relative"
                style={{
                  background: gradiente,
                  minHeight: '220px',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.12)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '';
                }}
              >
                {/* Emoji decorativo de fondo */}
                <div
                  className="position-absolute"
                  style={{
                    fontSize: '7rem',
                    opacity: 0.15,
                    right: '-10px',
                    bottom: '-10px',
                    lineHeight: 1,
                    userSelect: 'none',
                  }}
                >
                  {emoji}
                </div>

                {/* Contenido */}
                <div className="p-4 d-flex flex-column justify-content-between h-100"
                  style={{ minHeight: '220px' }}>
                  <div>
                    <div
                      className="d-inline-flex align-items-center justify-content-center rounded-3 mb-3"
                      style={{
                        width: '48px', height: '48px',
                        backgroundColor: 'rgba(255,255,255,0.4)',
                        backdropFilter: 'blur(4px)',
                      }}
                    >
                      <i className={`fa-solid ${icono} fa-lg text-white`}></i>
                    </div>
                    <h3 className="logo-text fw-bold text-white mb-1" style={{ fontSize: '1.6rem' }}>
                      {label}
                    </h3>
                    <p className="text-white mb-0" style={{ opacity: 0.85, fontSize: '0.875rem' }}>
                      {descripcion}
                    </p>
                  </div>

                  {/* Contador */}
                  <div className="mt-4 d-flex align-items-end justify-content-between">
                    {contador > 0 && (
                      <div
                        className="px-3 py-1 rounded-pill"
                        style={{ backgroundColor: 'rgba(255,255,255,0.3)', backdropFilter: 'blur(4px)' }}
                      >
                        <span className="text-white fw-bold" style={{ fontSize: '0.85rem' }}>
                          {contador} {contadorLabel}
                        </span>
                      </div>
                    )}
                    <div
                      className="ms-auto d-flex align-items-center justify-content-center rounded-circle"
                      style={{
                        width: '36px', height: '36px',
                        backgroundColor: 'rgba(255,255,255,0.3)',
                      }}
                    >
                      <i className="fa-solid fa-arrow-right text-white fa-sm"></i>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminInicio;