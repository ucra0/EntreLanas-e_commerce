import { useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const PAYPAL_CLIENT_ID = 'Acay-VE2IwSyQgudtkVJR9N-EdxoZ0yYY-TUFsBHX7aZM1RTK-QBGCzU_qnD2aJXVqwzu0-j7kM5o622';

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

// ── Funciones de validación ──────────────────────────────

// Dirección: mínimo 5 chars, debe contener letra y número
const validarDireccion = (v) => v.trim().length >= 5 && /[a-zA-ZáéíóúñÁÉÍÓÚÑ]/.test(v) && /\d/.test(v);

// Código postal España: 5 dígitos, empieza por 01-52
const validarCP = (v) => /^(?:0[1-9]|[1-4]\d|5[0-2])\d{3}$/.test(v.trim());

// Teléfono España: 9 dígitos empezando por 6, 7, 8 o 9
const validarTelefono = (v) => /^[6789]\d{8}$/.test(v.replace(/\s/g, ''));

// Número de tarjeta: 13-19 dígitos (Luhn básico)
const validarTarjeta = (v) => {
  const digits = v.replace(/\s/g, '');
  if (!/^\d{13,19}$/.test(digits)) return false;
  // Algoritmo de Luhn
  let sum = 0;
  let par = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = parseInt(digits[i]);
    if (par) { d *= 2; if (d > 9) d -= 9; }
    sum += d;
    par = !par;
  }
  return sum % 10 === 0;
};

// Fecha vencimiento: MM/AA, no caducada
const validarFecha = (v) => {
  if (!/^\d{2}\/\d{2}$/.test(v)) return false;
  const [mm, aa] = v.split('/').map(Number);
  if (mm < 1 || mm > 12) return false;
  const ahora = new Date();
  const expira = new Date(2000 + aa, mm - 1);
  return expira >= new Date(ahora.getFullYear(), ahora.getMonth());
};

// CVV: 3 o 4 dígitos
const validarCVV = (v) => /^\d{3,4}$/.test(v.trim());

// Titular: mínimo 2 palabras, solo letras y espacios
const validarTitular = (v) => /^[a-zA-ZáéíóúñÁÉÍÓÚÑ\s]{5,}$/.test(v.trim()) && v.trim().split(/\s+/).length >= 2;

// Teléfono Bizum: 9 dígitos empezando por 6 o 7
const validarTelefonoBizum = (v) => /^[67]\d{8}$/.test(v.replace(/\s/g, ''));

// Email Klarna: formato email válido
const validarEmailKlarna = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

// Nombre/Apellidos: mínimo 2 chars, solo letras
const validarNombre = (v) => /^[a-zA-ZáéíóúñÁÉÍÓÚÑ\s\-']{2,}$/.test(v.trim());

// ── Formatear número de tarjeta con espacios cada 4 dígitos ──
const formatearTarjeta = (v) =>
  v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();

// ── Formatear fecha MM/AA ──
const formatearFecha = (v) => {
  const digits = v.replace(/\D/g, '').slice(0, 4);
  if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return digits;
};

// ── Componente campo con error inline ──
const Campo = ({ error, children }) => (
  <div>
    {children}
    {error && (
      <p className="text-danger small mb-0 mt-1">
        <i className="fa-solid fa-circle-exclamation me-1"></i>{error}
      </p>
    )}
  </div>
);

function Checkout() {
  const { carrito, total, setCarrito } = useCart();
  const { user }   = useAuth();
  const navigate   = useNavigate();

  const [form, setForm] = useState({
    email:                  user?.email || '',
    pais:                   'España',
    nombre:                 user?.nombre || '',
    apellidos:              user?.apellidos || '',
    direccion:              '',
    direccion2:             '',
    codigoPostal:           '',
    provincia:              'A Coruña',
    telefono:               '',
    guardarInfo:            false,
    metodoPago:             'tarjeta',
    numeroTarjeta:          '',
    fechaVencimiento:       '',
    cvv:                    '',
    titular:                '',
    usarDireccionFacturacion: true,
    telefonoBizum:          '',
    klarnaEmail:            '',
  });

  // Errores por campo
  const [errores, setErrores] = useState({});
  const [procesando, setProcesando]           = useState(false);
  const [pedidoCompletado, setPedidoCompletado] = useState(false);
  const [error, setError]                     = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let val = type === 'checkbox' ? checked : value;

    // Formateo automático
    if (name === 'numeroTarjeta') val = formatearTarjeta(val);
    if (name === 'fechaVencimiento') val = formatearFecha(val);
    if (name === 'cvv') val = val.replace(/\D/g, '').slice(0, 4);
    if (name === 'telefono' || name === 'telefonoBizum')
      val = val.replace(/\D/g, '').slice(0, 9);
    if (name === 'codigoPostal') val = val.replace(/\D/g, '').slice(0, 5);

    setForm(prev => ({ ...prev, [name]: val }));
    // Limpiar error del campo al editar
    if (errores[name]) setErrores(prev => ({ ...prev, [name]: '' }));
  };

  const seleccionarMetodo = (metodo) => {
    setError('');
    setErrores({});
    setForm(prev => ({ ...prev, metodoPago: metodo }));
  };

  // ── Validar todos los campos y devolver objeto de errores ──
  const validarTodo = () => {
    const e = {};

    if (!validarNombre(form.nombre))
      e.nombre = 'Introduce un nombre válido (mínimo 2 letras).';
    if (!validarNombre(form.apellidos))
      e.apellidos = 'Introduce unos apellidos válidos.';
    if (!form.email.includes('@'))
      e.email = 'Introduce un email válido.';
    if (!validarDireccion(form.direccion))
      e.direccion = 'Introduce una dirección válida (ej: Calle Mayor 12).';
    if (!validarCP(form.codigoPostal))
      e.codigoPostal = 'Código postal español no válido (5 dígitos, 01000-52999).';
    if (!validarTelefono(form.telefono))
      e.telefono = 'Teléfono no válido (9 dígitos, empieza por 6, 7, 8 o 9).';

    if (form.metodoPago === 'tarjeta') {
      if (!validarTarjeta(form.numeroTarjeta))
        e.numeroTarjeta = 'Número de tarjeta no válido.';
      if (!validarFecha(form.fechaVencimiento))
        e.fechaVencimiento = 'Fecha no válida o tarjeta caducada (MM/AA).';
      if (!validarCVV(form.cvv))
        e.cvv = 'CVV no válido (3 o 4 dígitos).';
      if (!validarTitular(form.titular))
        e.titular = 'Introduce el nombre completo del titular.';
    }

    if (form.metodoPago === 'bizum') {
      if (!validarTelefonoBizum(form.telefonoBizum))
        e.telefonoBizum = 'Teléfono Bizum no válido (9 dígitos, empieza por 6 o 7).';
    }

    if (form.metodoPago === 'klarna') {
      if (!validarEmailKlarna(form.klarnaEmail))
        e.klarnaEmail = 'Introduce un email válido de Klarna.';
    }

    return e;
  };

  const crearPedidoEnBackend = async () => {
    const pedidoDTO = {
      usuario_id: user.usuario_id,
      lineas: carrito.map(item => ({ producto_id: item.id, cantidad: item.cantidad })),
    };
    const response = await fetch('http://localhost:8080/api/pedidos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pedidoDTO),
    });
    if (!response.ok) throw new Error(await response.text() || 'Error al procesar el pedido');
    setPedidoCompletado(true);
    setCarrito([]);
    setTimeout(() => navigate('/'), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const erroresValidacion = validarTodo();
    if (Object.keys(erroresValidacion).length > 0) {
      setErrores(erroresValidacion);
      // Hacer scroll al primer error
      const primerError = document.querySelector('.text-danger');
      if (primerError) primerError.scrollIntoView({ behavior: 'smooth', block: 'center' });
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

  // ── Guardas ──
  if (!user) {
    return (
      <div className="flex-grow-1 d-flex justify-content-center align-items-center py-5">
        <div className="text-center card-premium p-5" style={{ maxWidth: '500px' }}>
          <i className="fa-solid fa-lock text-accent mb-4" style={{ fontSize: '4rem' }}></i>
          <h2 className="logo-text mb-3">Acceso Restringido</h2>
          <p className="text-muted mb-4">Debes iniciar sesión para completar tu compra.</p>
          <Link to="/login" className="btn btn-primary-accent rounded-pill px-5 py-2">Ir a Iniciar Sesión</Link>
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
            Gracias por tu compra, <strong>{user.nombre}</strong>. Lo estamos preparando con mucho cariño.
          </p>
          <p className="text-muted small">Redirigiendo al inicio en unos segundos...</p>
          <div className="spinner-border text-accent mt-3" role="status" style={{ width: '1.5rem', height: '1.5rem' }}></div>
        </div>
      </div>
    );
  }

  // Helper para clase de input con error
  const inputClass = (campo) =>
    `form-control rounded-3${errores[campo] ? ' is-invalid' : ''}`;

  return (
    <PayPalScriptProvider options={{ clientId: PAYPAL_CLIENT_ID, currency: 'EUR' }}>
      <div className="flex-grow-1 py-5">
        <div className="container py-lg-4" style={{ maxWidth: '1100px' }}>


          <form onSubmit={handleSubmit} noValidate>
            <div className="row gap-5 gap-lg-0 align-items-start">

              {/* ── COLUMNA IZQUIERDA ── */}
              <div className="col-lg-7">

                {/* Pago Exprés */}
                <div className="card-premium p-4 mb-4">
                  <p className="text-muted small text-center mb-3 fw-bold text-uppercase" style={{ letterSpacing: '1px' }}>
                    Pago Exprés
                  </p>
                  <div className="d-flex justify-content-center gap-3 flex-wrap">
                    <button type="button" onClick={() => seleccionarMetodo('applepay')}
                      className={`btn border rounded-3 px-4 py-2 d-flex align-items-center gap-2 shadow-sm ${form.metodoPago === 'applepay' ? 'bg-dark text-white border-dark' : ''}`}
                      style={{ minWidth: '110px' }}>
                      <i className="fa-brands fa-apple fs-5"></i><span className="fw-semibold">Pay</span>
                    </button>
                    <button type="button" onClick={() => seleccionarMetodo('googlepay')}
                      className={`btn border rounded-3 px-4 py-2 d-flex align-items-center gap-2 shadow-sm ${form.metodoPago === 'googlepay' ? 'border-dark' : ''}`}
                      style={{ minWidth: '110px' }}>
                      <i className="fa-brands fa-google fs-5"></i><span className="fw-semibold">Pay</span>
                    </button>
                    <button type="button" onClick={() => seleccionarMetodo('paypal')}
                      className={`btn border rounded-3 px-4 py-2 d-flex align-items-center gap-2 shadow-sm ${form.metodoPago === 'paypal' ? 'border-primary' : ''}`}
                      style={{ minWidth: '110px' }}>
                      <i className="fa-brands fa-paypal fs-5 text-primary"></i><span className="fw-semibold">PayPal</span>
                    </button>
                  </div>

                  {form.metodoPago === 'applepay' && (
                    <div className="mt-3 p-3 rounded-3 text-center" style={{ backgroundColor: '#f8f5f0', border: '1px solid var(--border-color)' }}>
                      <i className="fa-brands fa-apple fs-1 mb-2 d-block"></i>
                      <p className="text-muted small mb-2">Apple Pay requiere un dispositivo Apple y Safari.</p>
                      <button type="button" className="btn btn-dark rounded-3 px-4 d-inline-flex align-items-center gap-2">
                        <i className="fa-brands fa-apple"></i> Pagar con Apple Pay
                      </button>
                    </div>
                  )}
                  {form.metodoPago === 'googlepay' && (
                    <div className="mt-3 p-3 rounded-3 text-center" style={{ backgroundColor: '#f8f5f0', border: '1px solid var(--border-color)' }}>
                      <i className="fa-brands fa-google fs-1 mb-2 d-block text-danger"></i>
                      <p className="text-muted small mb-2">Serás redirigido a Google Pay para completar el pago.</p>
                      <button type="button" className="btn btn-outline-dark rounded-3 px-4 d-inline-flex align-items-center gap-2">
                        <i className="fa-brands fa-google"></i> Pagar con Google Pay
                      </button>
                    </div>
                  )}
                  {form.metodoPago === 'paypal' && (
                    <div className="mt-3">
                      <PayPalButtons
                        fundingSource="paypal"
                        style={{ layout: 'vertical', color: 'gold', shape: 'rect', label: 'paypal' }}
                        createOrder={(data, actions) => actions.order.create({
                          purchase_units: [{ amount: { value: String(parseFloat(total).toFixed(2)), currency_code: 'EUR' }, description: `Pedido EntreLanas — ${carrito.length} artículo(s)` }],
                        })}
                        onApprove={async (data, actions) => {
                          setProcesando(true);
                          try { await actions.order.capture(); await crearPedidoEnBackend(); }
                          catch (err) { setError('Error al confirmar el pago con PayPal: ' + err.message); setProcesando(false); }
                        }}
                        onError={() => setError('Ha ocurrido un error con PayPal. Inténtalo de nuevo.')}
                        onCancel={() => setError('Has cancelado el pago con PayPal.')}
                      />
                    </div>
                  )}

                  <div className="d-flex align-items-center gap-3 mt-3">
                    <hr className="flex-grow-1" /><span className="text-muted small">o</span><hr className="flex-grow-1" />
                  </div>
                </div>

                {/* Información de contacto */}
                <div className="card-premium p-4 mb-4">
                  <h5 className="logo-text fw-bold mb-3">Información de contacto</h5>
                  <Campo error={errores.email}>
                    <input type="email" name="email" className={inputClass('email')}
                      placeholder="Correo electrónico" value={form.email} onChange={handleChange} />
                  </Campo>
                </div>

                {/* Entrega */}
                <div className="card-premium p-4 mb-4">
                  <h5 className="logo-text fw-bold mb-3">Entrega</h5>

                  <div className="mb-3">
                    <label className="form-label text-muted small fw-semibold">País / Región</label>
                    <select name="pais" className="form-select rounded-3" value={form.pais} onChange={handleChange}>
                      {PAISES.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-6">
                      <Campo error={errores.nombre}>
                        <input type="text" name="nombre" className={inputClass('nombre')}
                          placeholder="Nombre" value={form.nombre} onChange={handleChange} />
                      </Campo>
                    </div>
                    <div className="col-6">
                      <Campo error={errores.apellidos}>
                        <input type="text" name="apellidos" className={inputClass('apellidos')}
                          placeholder="Apellidos" value={form.apellidos} onChange={handleChange} />
                      </Campo>
                    </div>
                  </div>

                  <div className="mb-3 position-relative">
                    <Campo error={errores.direccion}>
                      <input type="text" name="direccion" className={`${inputClass('direccion')} pe-5`}
                        placeholder="Dirección (ej: Calle Mayor 12)" value={form.direccion} onChange={handleChange} />
                      <i className="fa-solid fa-magnifying-glass position-absolute text-muted"
                        style={{ right: '14px', top: errores.direccion ? '30%' : '50%', transform: 'translateY(-50%)' }}></i>
                    </Campo>
                  </div>

                  <div className="mb-3">
                    <input type="text" name="direccion2" className="form-control rounded-3"
                      placeholder="Casa, apartamento, etc. (opcional)" value={form.direccion2} onChange={handleChange} />
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-4">
                      <Campo error={errores.codigoPostal}>
                        <input type="text" name="codigoPostal" className={inputClass('codigoPostal')}
                          placeholder="Cód. postal" value={form.codigoPostal} onChange={handleChange}
                          maxLength={5} inputMode="numeric" />
                      </Campo>
                    </div>
                    <div className="col-8">
                      <select name="provincia" className="form-select rounded-3" value={form.provincia} onChange={handleChange}>
                        {PROVINCIAS.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="mb-3">
                    <Campo error={errores.telefono}>
                      <input type="tel" name="telefono" className={inputClass('telefono')}
                        placeholder="Teléfono (9 dígitos)" value={form.telefono} onChange={handleChange}
                        maxLength={9} inputMode="numeric" />
                    </Campo>
                  </div>

                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" name="guardarInfo" id="guardarInfo"
                      checked={form.guardarInfo} onChange={handleChange} />
                    <label className="form-check-label text-muted small" htmlFor="guardarInfo">
                      Guardar mi información para futuras compras
                    </label>
                  </div>
                </div>

                {/* Envíos */}
                <div className="card-premium p-4 mb-4">
                  <h5 className="logo-text fw-bold mb-3">Envíos</h5>
                  {form.direccion && validarDireccion(form.direccion) ? (
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
                      <p className="mb-0 small">Ingresa tu dirección de envío para ver los métodos disponibles</p>
                    </div>
                  )}
                </div>

                {/* Pago */}
                <div className="card-premium p-4 mb-4">
                  <h5 className="logo-text fw-bold mb-1">Pago</h5>
                  <p className="text-muted small mb-3">
                    <i className="fa-solid fa-shield-halved me-1 text-accent"></i>
                    Todas las transacciones son seguras y están encriptadas.
                  </p>

                  {/* Tarjeta */}
                  <div className="rounded-3 border mb-2 overflow-hidden"
                    style={{ borderColor: form.metodoPago === 'tarjeta' ? 'var(--accent-color, #c9a87c)' : '#dee2e6' }}>
                    <div className="d-flex align-items-center justify-content-between p-3"
                      style={{ cursor: 'pointer', backgroundColor: form.metodoPago === 'tarjeta' ? '#f8f5f0' : 'white' }}
                      onClick={() => seleccionarMetodo('tarjeta')}>
                      <div className="d-flex align-items-center gap-2">
                        <input type="radio" name="metodoPago" value="tarjeta"
                          checked={form.metodoPago === 'tarjeta'} onChange={() => seleccionarMetodo('tarjeta')}
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
                          <Campo error={errores.numeroTarjeta}>
                            <input type="text" name="numeroTarjeta" className={`${inputClass('numeroTarjeta')} pe-5`}
                              placeholder="Número de tarjeta" value={form.numeroTarjeta} onChange={handleChange}
                              maxLength={19} inputMode="numeric" />
                            <i className="fa-solid fa-lock position-absolute text-muted"
                              style={{ right: '14px', top: errores.numeroTarjeta ? '30%' : '50%', transform: 'translateY(-50%)' }}></i>
                          </Campo>
                        </div>
                        <div className="row g-3 mb-3">
                          <div className="col-6">
                            <Campo error={errores.fechaVencimiento}>
                              <input type="text" name="fechaVencimiento" className={inputClass('fechaVencimiento')}
                                placeholder="MM/AA" value={form.fechaVencimiento} onChange={handleChange} maxLength={5} />
                            </Campo>
                          </div>
                          <div className="col-6">
                            <Campo error={errores.cvv}>
                              <input type="text" name="cvv" className={inputClass('cvv')}
                                placeholder="CVV" value={form.cvv} onChange={handleChange}
                                maxLength={3} inputMode="numeric" />
                            </Campo>
                          </div>
                        </div>
                        <div className="mb-3">
                          <Campo error={errores.titular}>
                            <input type="text" name="titular" className={inputClass('titular')}
                              placeholder="Nombre del titular (como aparece en la tarjeta)"
                              value={form.titular} onChange={handleChange} />
                          </Campo>
                        </div>
                        <div className="form-check">
                          <input className="form-check-input" type="checkbox"
                            name="usarDireccionFacturacion" id="usarDireccionFacturacion"
                            checked={form.usarDireccionFacturacion} onChange={handleChange} />
                          <label className="form-check-label text-muted small" htmlFor="usarDireccionFacturacion">
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
                          checked={form.metodoPago === 'bizum'} onChange={() => seleccionarMetodo('bizum')}
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
                        <Campo error={errores.telefonoBizum}>
                          <div className="input-group">
                            <span className="input-group-text rounded-start-3">🇪🇸 +34</span>
                            <input type="tel" name="telefonoBizum"
                              className={`form-control rounded-end-3${errores.telefonoBizum ? ' is-invalid' : ''}`}
                              placeholder="6XX XXX XXX" value={form.telefonoBizum} onChange={handleChange}
                              maxLength={9} inputMode="numeric" />
                          </div>
                        </Campo>
                        <div className="p-2 rounded-3 text-center text-muted small mt-3"
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
                          checked={form.metodoPago === 'klarna'} onChange={() => seleccionarMetodo('klarna')}
                          className="form-check-input mt-0" />
                        <span className="fw-medium">Klarna — Paga en 3 plazos</span>
                      </div>
                      <span className="fw-bold px-2 py-1 rounded-2 text-dark"
                        style={{ backgroundColor: '#ffb3c7', fontSize: '0.95rem' }}>Klarna.</span>
                    </div>
                    {form.metodoPago === 'klarna' && (
                      <div className="p-3 border-top" style={{ backgroundColor: '#fff5f8' }}>
                        <div className="d-flex gap-2 justify-content-center mb-3">
                          {[1, 2, 3].map(n => (
                            <div key={n} className="text-center p-2 rounded-3 flex-grow-1"
                              style={{ backgroundColor: '#ffe0ea', border: '1px solid #ffb3c7' }}>
                              <p className="mb-0 fw-bold text-dark small">Plazo {n}</p>
                              <p className="mb-0 text-muted" style={{ fontSize: '0.75rem' }}>{(total / 3).toFixed(2)} €</p>
                            </div>
                          ))}
                        </div>
                        <Campo error={errores.klarnaEmail}>
                          <input type="email" name="klarnaEmail"
                            className={`${inputClass('klarnaEmail')} mb-2`}
                            placeholder="Email de tu cuenta Klarna"
                            value={form.klarnaEmail} onChange={handleChange} />
                        </Campo>
                        <p className="text-muted small mb-0">
                          <i className="fa-solid fa-circle-info me-1" style={{ color: '#f077a0' }}></i>
                          Sin intereses. 3 cuotas de <strong>{(total / 3).toFixed(2)} €</strong>.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {error && (
                  <div className="alert alert-danger rounded-3 d-flex align-items-center gap-2 mb-3">
                    <i className="fa-solid fa-circle-exclamation flex-shrink-0"></i>
                    <span>{error}</span>
                  </div>
                )}

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

              {/* ── COLUMNA DERECHA ── */}
              <div className="col-lg-5">
                <div className="card-premium p-4 sticky-sidebar">
                  <div className="d-flex flex-column gap-3 mb-4">
                    {carrito.map((item) => (
                      <div key={item.id} className="d-flex align-items-center gap-3">
                        <div className="position-relative" style={{ flexShrink: 0 }}>
                          <div className="rounded-3 overflow-hidden shadow-sm" style={{ width: '64px', height: '64px' }}>
                            <img src={item.imagen?.startsWith('http') || item.imagen?.startsWith('/') ? item.imagen : `/${item.imagen}`}
                              alt={item.titulo} className="w-100 h-100" style={{ objectFit: 'cover' }} />
                          </div>
                          {item.cantidad > 1 && (
                            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-accent shadow-sm"
                              style={{ fontSize: '0.65rem' }}>{item.cantidad}</span>
                          )}
                        </div>
                        <div className="flex-grow-1">
                          <p className="mb-0 fw-semibold text-dark small">{item.titulo}</p>
                          <p className="mb-0 text-muted" style={{ fontSize: '0.75rem' }}>
                            {item.talla ? `Talla: ${item.talla}` : item.fibra ? `Material: ${item.fibra}` : item.categoria}
                          </p>
                        </div>
                        <span className="fw-bold text-dark small">
                          {(item.precio.importe * item.cantidad).toFixed(2)} {item.precio.moneda === 'EUR' ? '€' : item.precio.moneda}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="d-flex gap-2 mb-4">
                    <input type="text" className="form-control rounded-3" placeholder="Tarjeta regalo o código de descuento" />
                    <button type="button" className="btn btn-outline-secondary rounded-3 px-3 fw-medium" style={{ whiteSpace: 'nowrap' }}>Aplicar</button>
                  </div>

                  <hr />

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
                    <span className="logo-text text-accent fw-bold" style={{ fontSize: '2rem' }}>{total.toFixed(2)} €</span>
                  </div>

                  <div className="text-center mt-4 pt-3 border-top">
                    <p className="text-muted small mb-2">
                      <i className="fa-solid fa-shield-halved me-1 text-accent"></i> Transacción 100% segura y encriptada
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