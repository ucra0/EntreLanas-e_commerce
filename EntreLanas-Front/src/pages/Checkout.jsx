import { useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

// ─────────────────────────────────────────────────────────
const PAYPAL_CLIENT_ID = 'AcG-5lpphpt0EzvsVU57fZJd2gjZVmtFUKwQF7BTUao6rR3srgMBH6fmzYgpqPV-c_v1KAOWUSCfGkIa'; // Client ID real de PayPal
// ─────────────────────────────────────────────────────────

const PAISES = [
  'España', 'Portugal', 'Francia', 'Alemania', 'Italia',
  'Reino Unido', 'Países Bajos', 'Bélgica', 'Suiza', 'México',
  'Argentina', 'Colombia', 'Chile', 'Estados Unidos',
];

const PROVINCIAS = [
  'A Coruña', 'Álava', 'Albacete', 'Alicante', 'Almería', 'Asturias', 'Ávila',
  'Badajoz', 'Barcelona', 'Burgos', 'Cáceres', 'Cádiz', 'Cantabria', 'Castellón',
  'Ciudad Real', 'Córdoba', 'Cuenca', 'Girona', 'Granada', 'Guadalajara',
  'Guipúzcoa', 'Huelva', 'Huesca', 'Islas Baleares', 'Jaén', 'La Rioja',
  'Las Palmas', 'León', 'Lleida', 'Lugo', 'Madrid', 'Málaga', 'Murcia',
  'Navarra', 'Ourense', 'Palencia', 'Pontevedra', 'Salamanca',
  'Santa Cruz de Tenerife', 'Segovia', 'Sevilla', 'Soria', 'Tarragona',
  'Teruel', 'Toledo', 'Valencia', 'Valladolid', 'Vizcaya', 'Zamora', 'Zaragoza',
];

function Checkout() {
  const { carrito, total, setCarrito } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: user?.email || '',
    pais: 'España',
    nombre: user?.nombre || '',
    apellidos: user?.apellidos || '',
    direccion: '',
    direccion2: '',
    codigoPostal: '',
    provincia: 'A Coruña',
    telefono: '',
    guardarInfo: false,
    metodoPago: 'tarjeta',
    // Tarjeta
    numeroTarjeta: '',
    fechaVencimiento: '',
    cvv: '',
    titular: '',
    usarDireccionFacturacion: true,
    // Bizum
    telefonoBizum: '',
    // Klarna
    klarnaEmail: '',
  });

  const [procesando, setProcesando] = useState(false);
  const [pedidoCompletado, setPedidoCompletado] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const seleccionarMetodo = (metodo) => {
    setError('');
    setForm(prev => ({ ...prev, metodoPago: metodo }));
  };

  // Crea el pedido en el backend
  const crearPedidoEnBackend = async () => {
    const pedidoDTO = {
      usuario_id: user.usuario_id,
      lineas: carrito.map(item => ({
        producto_id: item.id,
        cantidad: item.cantidad,
      })),
    };

    const response = await fetch('http://localhost:8080/api/pedidos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pedidoDTO),
    });

    if (!response.ok) {
      const msg = await response.text();
      throw new Error(msg || 'Error al procesar el pedido');
    }

    setPedidoCompletado(true);
    setCarrito([]);
    setTimeout(() => navigate('/'), 3000);
  };

  // Submit para tarjeta, bizum y klarna
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.email || !form.nombre || !form.apellidos || !form.direccion ||
        !form.codigoPostal || !form.telefono) {
      setError('Por favor, completa todos los campos obligatorios de entrega.');
      return;
    }
    if (form.metodoPago === 'tarjeta' &&
        (!form.numeroTarjeta || !form.fechaVencimiento || !form.cvv || !form.titular)) {
      setError('Por favor, completa todos los datos de la tarjeta.');
      return;
    }
    if (form.metodoPago === 'bizum' && !form.telefonoBizum) {
      setError('Por favor, introduce tu número de teléfono de Bizum.');
      return;
    }
    if (form.metodoPago === 'klarna' && !form.klarnaEmail) {
      setError('Por favor, introduce tu email de Klarna.');
      return;
    }

    setProcesando(true);
    try {
      await crearPedidoEnBackend();
    } catch (err) {
      setError('Ha ocurrido un error: ' + err.message);
      setProcesando(false);
    }
  };

  // ── Guardas de acceso ──
  if (!user) {
    return (
      <div className="flex-grow-1 d-flex justify-content-center align-items-center py-5">
        <div className="text-center card-premium p-5" style={{ maxWidth: '500px' }}>
          <i className="fa-solid fa-lock text-accent mb-4" style={{ fontSize: '4rem' }}></i>
          <h2 className="logo-text mb-3">Acceso Restringido</h2>
          <p className="text-muted mb-4">Debes iniciar sesión para completar tu compra.</p>
          <Link to="/login" className="btn btn-primary-accent rounded-pill px-5 py-2">
            Ir a Iniciar Sesión
          </Link>
        </div>
      </div>
    );
  }

  if (carrito.length === 0 && !pedidoCompletado) {
    return (
      <div className="flex-grow-1 d-flex justify-content-center align-items-center py-5">
        <div className="text-center p-5">
          <i className="fa-solid fa-basket-shopping text-muted mb-4 opacity-25" style={{ fontSize: '7rem' }}></i>
          <h2 className="logo-text mb-3" style={{ fontSize: '2.5rem' }}>Tu cesta está vacía</h2>
          <p className="lead text-muted mb-5">Añade productos antes de continuar con el pago.</p>
          <Link to="/productos" className="btn btn-primary-accent rounded-pill px-5 py-3 fs-5 shadow-sm">
            <i className="fa-solid fa-wand-magic-sparkles me-2"></i> Descubrir el Catálogo
          </Link>
        </div>
      </div>
    );
  }

  if (pedidoCompletado) {
    return (
      <div className="flex-grow-1 d-flex justify-content-center align-items-center py-5">
        <div className="text-center card-premium p-5" style={{ maxWidth: '550px' }}>
          <div className="mb-4" style={{ fontSize: '5rem' }}>
            <i className="fa-solid fa-circle-check text-accent"></i>
          </div>
          <h2 className="logo-text mb-3">¡Pedido confirmado!</h2>
          <p className="text-muted mb-4">
            Gracias por tu compra, <strong>{user.nombre}</strong>.
            Lo estamos preparando con mucho cariño.
          </p>
          <p className="text-muted small">Redirigiendo al inicio en unos segundos...</p>
          <div className="spinner-border text-accent mt-3" role="status"
            style={{ width: '1.5rem', height: '1.5rem' }}></div>
        </div>
      </div>
    );
  }

  return (
    // PayPalScriptProvider envuelve todo el componente para que los botones funcionen
    <PayPalScriptProvider options={{ clientId: PAYPAL_CLIENT_ID, currency: 'EUR' }}>
      <div className="flex-grow-1 py-5">
        <div className="container py-lg-4" style={{ maxWidth: '1100px' }}>

          {/* Logo */}
          <div className="mb-5 text-center">
            <Link to="/" className="text-decoration-none">
              <h1 className="logo-text fs-2 text-dark">
                <i className="fa-solid fa-cookie-bite text-accent me-2"></i> EntreLanas
              </h1>
            </Link>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="row gap-5 gap-lg-0 align-items-start">

              
              <div className="col-lg-7">

                {/* ── Pago Exprés ── */}
                <div className="card-premium p-4 mb-4">
                  <p className="text-muted small text-center mb-3 fw-bold text-uppercase"
                    style={{ letterSpacing: '1px' }}>
                    Pago Exprés
                  </p>

                  <div className="d-flex justify-content-center gap-3 flex-wrap">
                    {/* Apple Pay */}
                    <button type="button"
                      onClick={() => seleccionarMetodo('applepay')}
                      className={`btn border rounded-3 px-4 py-2 d-flex align-items-center gap-2 shadow-sm
                        ${form.metodoPago === 'applepay' ? 'bg-dark text-white border-dark' : ''}`}
                      style={{ minWidth: '110px' }}>
                      <i className="fa-brands fa-apple fs-5"></i>
                      <span className="fw-semibold">Pay</span>
                    </button>

                    {/* Google Pay */}
                    <button type="button"
                      onClick={() => seleccionarMetodo('googlepay')}
                      className={`btn border rounded-3 px-4 py-2 d-flex align-items-center gap-2 shadow-sm
                        ${form.metodoPago === 'googlepay' ? 'border-dark' : ''}`}
                      style={{ minWidth: '110px' }}>
                      <i className="fa-brands fa-google fs-5"></i>
                      <span className="fw-semibold">Pay</span>
                    </button>

                    {/* PayPal */}
                    <button type="button"
                      onClick={() => seleccionarMetodo('paypal')}
                      className={`btn border rounded-3 px-4 py-2 d-flex align-items-center gap-2 shadow-sm
                        ${form.metodoPago === 'paypal' ? 'border-primary' : ''}`}
                      style={{ minWidth: '110px' }}>
                      <i className="fa-brands fa-paypal fs-5 text-primary"></i>
                      <span className="fw-semibold">PayPal</span>
                    </button>
                  </div>

                  {/* Panel Apple Pay */}
                  {form.metodoPago === 'applepay' && (
                    <div className="mt-3 p-3 rounded-3 text-center"
                      style={{ backgroundColor: '#f8f5f0', border: '1px solid var(--border-color)' }}>
                      <i className="fa-brands fa-apple fs-1 mb-2 d-block"></i>
                      <p className="text-muted small mb-2">
                        Apple Pay requiere un dispositivo Apple y Safari.
                      </p>
                      <button type="button"
                        className="btn btn-dark rounded-3 px-4 d-inline-flex align-items-center gap-2">
                        <i className="fa-brands fa-apple"></i> Pagar con Apple Pay
                      </button>
                    </div>
                  )}

                  {/* Panel Google Pay */}
                  {form.metodoPago === 'googlepay' && (
                    <div className="mt-3 p-3 rounded-3 text-center"
                      style={{ backgroundColor: '#f8f5f0', border: '1px solid var(--border-color)' }}>
                      <i className="fa-brands fa-google fs-1 mb-2 d-block text-danger"></i>
                      <p className="text-muted small mb-2">
                        Serás redirigido a Google Pay para completar el pago.
                      </p>
                      <button type="button"
                        className="btn btn-outline-dark rounded-3 px-4 d-inline-flex align-items-center gap-2">
                        <i className="fa-brands fa-google"></i> Pagar con Google Pay
                      </button>
                    </div>
                  )}

                  {/* ── Panel PayPal ── */}
                  {form.metodoPago === 'paypal' && (
                    <div className="mt-3">
                        <PayPalButtons
                            fundingSource="paypal" 
                            style={{ layout: 'vertical', color: 'gold', shape: 'rect', label: 'paypal' }}
                            createOrder={(data, actions) => actions.order.create({
                                purchase_units: [{
                                    amount: {
                                    value: total.toFixed(2),
                                    currency_code: 'EUR',
                                },
                                description: `Pedido EntreLanas — ${carrito.length} artículo(s)`,
                            }],
                        })}
                        onApprove={async (data, actions) => {
                            setProcesando(true);
                            try {
                                await actions.order.capture();
                                await crearPedidoEnBackend();
                            } catch (err) {
                                setError('Error al confirmar el pago con PayPal: ' + err.message);
                                setProcesando(false);
                            }
                        }}
                        onError={() => setError('Ha ocurrido un error con PayPal. Inténtalo de nuevo.')}
                        onCancel={() => setError('Has cancelado el pago con PayPal.')}
                        />
                    </div>
                    )}

                  <div className="d-flex align-items-center gap-3 mt-3">
                    <hr className="flex-grow-1" />
                    <span className="text-muted small">o</span>
                    <hr className="flex-grow-1" />
                  </div>
                </div>

                {/* ── Información de contacto ── */}
                <div className="card-premium p-4 mb-4">
                  <h5 className="logo-text fw-bold mb-3">Información de contacto</h5>
                  <input type="email" name="email" className="form-control rounded-3"
                    placeholder="Correo electrónico"
                    value={form.email} onChange={handleChange} required />
                </div>

                {/* ── Entrega ── */}
                <div className="card-premium p-4 mb-4">
                  <h5 className="logo-text fw-bold mb-3">Entrega</h5>

                  {/* País / Región */}
                  <div className="mb-3">
                    <label className="form-label text-muted small fw-semibold">País / Región</label>
                    <select name="pais" className="form-select rounded-3"
                      value={form.pais} onChange={handleChange}>
                      {PAISES.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>

                  {/* Nombre + Apellidos */}
                  <div className="row g-3 mb-3">
                    <div className="col-6">
                      <input type="text" name="nombre" className="form-control rounded-3"
                        placeholder="Nombre" value={form.nombre} onChange={handleChange} required />
                    </div>
                    <div className="col-6">
                      <input type="text" name="apellidos" className="form-control rounded-3"
                        placeholder="Apellidos" value={form.apellidos} onChange={handleChange} required />
                    </div>
                  </div>

                  {/* Dirección */}
                  <div className="mb-3 position-relative">
                    <input type="text" name="direccion" className="form-control rounded-3 pe-5"
                      placeholder="Dirección" value={form.direccion} onChange={handleChange} required />
                    <i className="fa-solid fa-magnifying-glass position-absolute text-muted"
                      style={{ right: '14px', top: '50%', transform: 'translateY(-50%)' }}></i>
                  </div>

                  {/* Dirección 2 */}
                  <div className="mb-3">
                    <input type="text" name="direccion2" className="form-control rounded-3"
                      placeholder="Casa, apartamento, etc. (opcional)"
                      value={form.direccion2} onChange={handleChange} />
                  </div>

                  {/* Código postal + Provincia (sin campo Ciudad manual) */}
                  <div className="row g-3 mb-3">
                    <div className="col-4">
                      <input type="text" name="codigoPostal" className="form-control rounded-3"
                        placeholder="Código postal" value={form.codigoPostal} onChange={handleChange} required />
                    </div>
                    <div className="col-8">
                      <select name="provincia" className="form-select rounded-3"
                        value={form.provincia} onChange={handleChange}>
                        {PROVINCIAS.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Teléfono */}
                  <div className="mb-3">
                    <input type="tel" name="telefono" className="form-control rounded-3"
                      placeholder="Teléfono" value={form.telefono} onChange={handleChange} required />
                  </div>

                  <div className="form-check">
                    <input className="form-check-input" type="checkbox"
                      name="guardarInfo" id="guardarInfo"
                      checked={form.guardarInfo} onChange={handleChange} />
                    <label className="form-check-label text-muted small" htmlFor="guardarInfo">
                      Guardar mi información para futuras compras
                    </label>
                  </div>
                </div>

                {/* ── Envíos ── */}
                <div className="card-premium p-4 mb-4">
                  <h5 className="logo-text fw-bold mb-3">Envíos</h5>
                  {form.direccion ? (
                    <div className="d-flex justify-content-between align-items-center p-3 rounded-3"
                      style={{ backgroundColor: '#f8f5f0', border: '1px solid var(--border-color)' }}>
                      <div className="d-flex align-items-center gap-2">
                        <i className="fa-solid fa-truck text-accent"></i>
                        <span className="fw-medium">Envío estándar (3-5 días hábiles)</span>
                      </div>
                      <span className="badge bg-success bg-opacity-10 text-success">¡Gratis!</span>
                    </div>
                  ) : (
                    <div className="p-3 rounded-3 text-center text-muted"
                      style={{ backgroundColor: '#f8f5f0', border: '1px solid var(--border-color)' }}>
                      <p className="mb-0 small">
                        Ingresa tu dirección de envío para ver los métodos disponibles
                      </p>
                      <p className="mb-0 small opacity-75 mt-1">
                        Aquí aparecerán las distintas opciones de envío
                      </p>
                    </div>
                  )}
                </div>

                {/* ── Pago ── */}
                <div className="card-premium p-4 mb-4">
                  <h5 className="logo-text fw-bold mb-1">Pago</h5>
                  <p className="text-muted small mb-3">
                    <i className="fa-solid fa-shield-halved me-1 text-accent"></i>
                    Todas las transacciones son seguras y están encriptadas.
                  </p>

                  {/* Tarjeta de crédito */}
                  <div className="rounded-3 border mb-2 overflow-hidden"
                    style={{ borderColor: form.metodoPago === 'tarjeta' ? 'var(--accent-color, #c9a87c)' : '#dee2e6' }}>
                    <div className="d-flex align-items-center justify-content-between p-3"
                      style={{ cursor: 'pointer', backgroundColor: form.metodoPago === 'tarjeta' ? '#f8f5f0' : 'white' }}
                      onClick={() => seleccionarMetodo('tarjeta')}>
                      <div className="d-flex align-items-center gap-2">
                        <input type="radio" name="metodoPago" value="tarjeta"
                          checked={form.metodoPago === 'tarjeta'}
                          onChange={() => seleccionarMetodo('tarjeta')}
                          className="form-check-input mt-0" />
                        <span className="fw-medium">Tarjeta de crédito</span>
                      </div>
                      <div className="d-flex gap-2">
                        <i className="fa-brands fa-cc-visa fa-lg text-primary"></i>
                        <i className="fa-brands fa-cc-mastercard fa-lg" style={{ color: '#eb001b' }}></i>
                        <i className="fa-brands fa-cc-amex fa-lg" style={{ color: '#2e77bc' }}></i>
                      </div>
                    </div>
                    {form.metodoPago === 'tarjeta' && (
                      <div className="p-3 border-top" style={{ backgroundColor: '#fafafa' }}>
                        <div className="mb-3 position-relative">
                          <input type="text" name="numeroTarjeta"
                            className="form-control rounded-3 pe-5"
                            placeholder="Número de tarjeta"
                            value={form.numeroTarjeta} onChange={handleChange} maxLength={19} />
                          <i className="fa-solid fa-lock position-absolute text-muted"
                            style={{ right: '14px', top: '50%', transform: 'translateY(-50%)' }}></i>
                        </div>
                        <div className="row g-3 mb-3">
                          <div className="col-6">
                            <input type="text" name="fechaVencimiento"
                              className="form-control rounded-3"
                              placeholder="Fecha de vencimiento (MM/AA)"
                              value={form.fechaVencimiento} onChange={handleChange} maxLength={5} />
                          </div>
                          <div className="col-6">
                            <input type="text" name="cvv"
                              className="form-control rounded-3"
                              placeholder="Código de seguridad"
                              value={form.cvv} onChange={handleChange} maxLength={4} />
                          </div>
                        </div>
                        <div className="mb-3">
                          <input type="text" name="titular"
                            className="form-control rounded-3"
                            placeholder="Nombre del titular"
                            value={form.titular} onChange={handleChange} />
                        </div>
                        <div className="form-check">
                          <input className="form-check-input" type="checkbox"
                            name="usarDireccionFacturacion" id="usarDireccionFacturacion"
                            checked={form.usarDireccionFacturacion} onChange={handleChange} />
                          <label className="form-check-label text-muted small"
                            htmlFor="usarDireccionFacturacion">
                            Usar la dirección de envío como dirección de facturación
                          </label>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Bizum */}
                  <div className="rounded-3 border mb-2 overflow-hidden"
                    style={{ borderColor: form.metodoPago === 'bizum' ? '#5c2d82' : '#dee2e6' }}>
                    <div className="d-flex align-items-center justify-content-between p-3"
                      style={{ cursor: 'pointer', backgroundColor: form.metodoPago === 'bizum' ? '#f8f5f0' : 'white' }}
                      onClick={() => seleccionarMetodo('bizum')}>
                      <div className="d-flex align-items-center gap-2">
                        <input type="radio" name="metodoPago" value="bizum"
                          checked={form.metodoPago === 'bizum'}
                          onChange={() => seleccionarMetodo('bizum')}
                          className="form-check-input mt-0" />
                        <span className="fw-medium">Bizum</span>
                      </div>
                      <span className="fw-bold" style={{ color: '#5c2d82', fontSize: '1.1rem' }}>
                        <i className="fa-solid fa-bolt me-1"></i>bizum
                      </span>
                    </div>
                    {form.metodoPago === 'bizum' && (
                      <div className="p-3 border-top" style={{ backgroundColor: '#fafafa' }}>
                        <p className="text-muted small mb-3">
                          Introduce el número de teléfono asociado a tu cuenta Bizum.
                        </p>
                        <div className="input-group mb-3">
                          <span className="input-group-text rounded-start-3">🇪🇸 +34</span>
                          <input type="tel" name="telefonoBizum" className="form-control rounded-end-3"
                            placeholder="6XX XXX XXX"
                            value={form.telefonoBizum} onChange={handleChange} maxLength={9} />
                        </div>
                        <div className="p-2 rounded-3 text-center text-muted small"
                          style={{ backgroundColor: '#f0eafa', border: '1px solid #d4b8f0' }}>
                          <i className="fa-solid fa-mobile-screen me-1" style={{ color: '#5c2d82' }}></i>
                          Recibirás una notificación en tu app bancaria para confirmar el pago.
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Klarna */}
                  <div className="rounded-3 border overflow-hidden"
                    style={{ borderColor: form.metodoPago === 'klarna' ? '#f077a0' : '#dee2e6' }}>
                    <div className="d-flex align-items-center justify-content-between p-3"
                      style={{ cursor: 'pointer', backgroundColor: form.metodoPago === 'klarna' ? '#fff5f8' : 'white' }}
                      onClick={() => seleccionarMetodo('klarna')}>
                      <div className="d-flex align-items-center gap-2">
                        <input type="radio" name="metodoPago" value="klarna"
                          checked={form.metodoPago === 'klarna'}
                          onChange={() => seleccionarMetodo('klarna')}
                          className="form-check-input mt-0" />
                        <span className="fw-medium">Klarna — Paga en 3 plazos</span>
                      </div>
                      <span className="fw-bold px-2 py-1 rounded-2 text-dark"
                        style={{ backgroundColor: '#ffb3c7', fontSize: '0.95rem' }}>
                        Klarna.
                      </span>
                    </div>
                    {form.metodoPago === 'klarna' && (
                      <div className="p-3 border-top" style={{ backgroundColor: '#fff5f8' }}>
                        <div className="d-flex gap-2 justify-content-center mb-3">
                          {[1, 2, 3].map(n => (
                            <div key={n} className="text-center p-2 rounded-3 flex-grow-1"
                              style={{ backgroundColor: '#ffe0ea', border: '1px solid #ffb3c7' }}>
                              <p className="mb-0 fw-bold text-dark small">Plazo {n}</p>
                              <p className="mb-0 text-muted" style={{ fontSize: '0.75rem' }}>
                                {(total / 3).toFixed(2)} €
                              </p>
                            </div>
                          ))}
                        </div>
                        <input type="email" name="klarnaEmail"
                          className="form-control rounded-3 mb-2"
                          placeholder="Email de tu cuenta Klarna"
                          value={form.klarnaEmail} onChange={handleChange} />
                        <p className="text-muted small mb-0">
                          <i className="fa-solid fa-circle-info me-1" style={{ color: '#f077a0' }}></i>
                          Sin intereses. 3 cuotas de <strong>{(total / 3).toFixed(2)} €</strong>.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="alert alert-danger rounded-3 d-flex align-items-center gap-2 mb-3" role="alert">
                    <i className="fa-solid fa-circle-exclamation flex-shrink-0"></i>
                    <span>{error}</span>
                  </div>
                )}

                {/* Botón pagar — oculto si el método es PayPal */}
                {form.metodoPago !== 'paypal' && (
                  <button type="submit"
                    className="btn btn-primary-accent w-100 rounded-pill py-3 fs-5 shadow-sm d-flex justify-content-center align-items-center gap-2"
                    disabled={procesando}>
                    {procesando
                      ? <><i className="fa-solid fa-circle-notch fa-spin"></i> Procesando pago...</>
                      : <><i className="fa-solid fa-lock me-2"></i> Pagar ahora</>}
                  </button>
                )}
              </div>

              
              <div className="col-lg-5">
                <div className="card-premium p-4 sticky-sidebar">

                  {/* Productos */}
                  <div className="d-flex flex-column gap-3 mb-4">
                    {carrito.map((item) => (
                      <div key={item.id} className="d-flex align-items-center gap-3">
                        <div className="position-relative" style={{ flexShrink: 0 }}>
                          <div className="rounded-3 overflow-hidden shadow-sm"
                            style={{ width: '64px', height: '64px' }}>
                            <img
                              src={item.imagen?.startsWith('http') || item.imagen?.startsWith('/')
                                ? item.imagen : `/${item.imagen}`}
                              alt={item.titulo}
                              className="w-100 h-100"
                              style={{ objectFit: 'cover' }}
                            />
                          </div>
                          {item.cantidad > 1 && (
                            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-accent shadow-sm"
                              style={{ fontSize: '0.65rem' }}>
                              {item.cantidad}
                            </span>
                          )}
                        </div>
                        <div className="flex-grow-1">
                          <p className="mb-0 fw-semibold text-dark small">{item.titulo}</p>
                          <p className="mb-0 text-muted" style={{ fontSize: '0.75rem' }}>
                            {item.talla
                              ? `Talla: ${item.talla}`
                              : item.fibra
                                ? `Material: ${item.fibra}`
                                : item.categoria}
                          </p>
                        </div>
                        <span className="fw-bold text-dark small">
                          {(item.precio.importe * item.cantidad).toFixed(2)}{' '}
                          {item.precio.moneda === 'EUR' ? '€' : item.precio.moneda}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Código descuento */}
                  <div className="d-flex gap-2 mb-4">
                    <input type="text" className="form-control rounded-3"
                      placeholder="Tarjeta regalo o código de descuento" />
                    <button type="button"
                      className="btn btn-outline-secondary rounded-3 px-3 fw-medium"
                      style={{ whiteSpace: 'nowrap' }}>
                      Aplicar
                    </button>
                  </div>

                  <hr />

                  {/* Totales */}
                  <div className="d-flex justify-content-between mb-2 text-muted">
                    <span>Subtotal ({carrito.reduce((acc, i) => acc + i.cantidad, 0)} artículos)</span>
                    <span>{total.toFixed(2)} €</span>
                  </div>
                  <div className="d-flex justify-content-between mb-3 text-muted">
                    <span>Envíos</span>
                    <span className="badge bg-success bg-opacity-10 text-success">¡Gratis!</span>
                  </div>

                  <div className="d-flex justify-content-between align-items-center pt-3 border-top">
                    <span className="fs-5 fw-bold text-dark logo-text">Total</span>
                    <span className="logo-text text-accent fw-bold" style={{ fontSize: '2rem' }}>
                      {total.toFixed(2)} €
                    </span>
                  </div>

                  <div className="text-center mt-4 pt-3 border-top">
                    <p className="text-muted small mb-2">
                      <i className="fa-solid fa-shield-halved me-1 text-accent"></i>
                      Transacción 100% segura y encriptada
                    </p>
                    <div className="d-flex justify-content-center gap-3 text-muted opacity-50 mt-2">
                      <i className="fa-brands fa-cc-visa fa-2x"></i>
                      <i className="fa-brands fa-cc-mastercard fa-2x"></i>
                      <i className="fa-brands fa-cc-amex fa-2x"></i>
                      <i className="fa-brands fa-paypal fa-2x"></i>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </form>
        </div>
      </div>
    </PayPalScriptProvider>
  );
}

export default Checkout;