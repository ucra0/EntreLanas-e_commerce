import { useState, useEffect } from 'react';

// ── Valores de los Enums del backend ──
const CATEGORIAS = ['AMIGURUMI', 'ROPA', 'MATERIAL'];
const COLORES    = ['ROJO', 'AZUL', 'AMARILLO', 'VERDE', 'ROSA', 'MORADO', 'NEGRO', 'BLANCO', 'MARRON', 'NARANJA', 'GRIS'];
const FIBRAS     = ['LANA', 'SEDA', 'CACHEMIRA', 'ALGODON', 'LINO', 'BAMBU', 'NAILON', 'POLIESTER'];
const TALLAS     = ['BEBE', 'NIÑO', 'ADULTO'];
const ESTILOS    = ['KAWAI', 'REALISTA', 'CLASICO'];
const TIPOS      = ['MINI', 'LLAVERO', 'INANIMADO'];

const PRODUCTO_VACIO = {
  titulo: '', descripcion: '', precio: { importe: '', moneda: 'EUR' },
  imagen: '', stock: '', categoria: 'AMIGURUMI',
  color: '', talla: '', fibra: '', estilo: '', tipo: '',
};

// Badge de categoría con color
const CategoriaBadge = ({ categoria }) => {
  const config = {
    AMIGURUMI: { bg: '#fce4ec', color: '#880e4f' },
    ROPA:      { bg: '#e3f2fd', color: '#0d47a1' },
    MATERIAL:  { bg: '#e8f5e9', color: '#1b5e20' },
  };
  const { bg, color } = config[categoria] ?? { bg: '#f5f5f5', color: '#333' };
  return (
    <span className="badge rounded-pill px-2 py-1 small fw-semibold"
      style={{ backgroundColor: bg, color, fontSize: '0.75rem' }}>
      {categoria}
    </span>
  );
};

function AdminProductos() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');

  // Modal
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [productoActual, setProductoActual] = useState(PRODUCTO_VACIO);
  const [guardando, setGuardando] = useState(false);
  const [errorModal, setErrorModal] = useState('');

  // Confirmación borrado
  const [confirmando, setConfirmando] = useState(null); // id del producto a borrar

  // ── Cargar productos ──
  const cargarProductos = async () => {
    setCargando(true);
    try {
      const res = await fetch('http://localhost:8080/api/productos');
      if (!res.ok) throw new Error('Error al cargar productos');
      const data = await res.json();
      setProductos(data);
    } catch (err) {
      setError('No se pudieron cargar los productos.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { cargarProductos(); }, []);

  // ── Filtrado local ──
  const productosFiltrados = productos.filter(p => {
    const coincideTexto = p.titulo.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCategoria = filtroCategoria ? p.categoria === filtroCategoria : true;
    return coincideTexto && coincideCategoria;
  });

  // ── Abrir modal crear ──
  const abrirCrear = () => {
    setProductoActual(PRODUCTO_VACIO);
    setModoEdicion(false);
    setErrorModal('');
    setModalAbierto(true);
  };

  // ── Abrir modal editar ──
  const abrirEditar = async (id) => {
    setErrorModal('');
    try {
      const res = await fetch(`http://localhost:8080/api/productos/${id}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setProductoActual({
        ...data,
        precio: { importe: data.precio?.importe ?? '', moneda: data.precio?.moneda ?? 'EUR' },
        color:   data.color   ?? '',
        talla:   data.talla   ?? '',
        fibra:   data.fibra   ?? '',
        estilo:  data.estilo  ?? '',
        tipo:    data.tipo    ?? '',
      });
      setModoEdicion(true);
      setModalAbierto(true);
    } catch {
      setError('No se pudo cargar el producto para editar.');
    }
  };

  // ── Guardar (crear o editar) ──
  const handleGuardar = async (e) => {
    e.preventDefault();
    setErrorModal('');

    if (!productoActual.titulo || !productoActual.descripcion ||
        !productoActual.precio.importe || !productoActual.stock ||
        !productoActual.imagen) {
      setErrorModal('Rellena todos los campos obligatorios (*).');
      return;
    }

    setGuardando(true);
    try {
      const url = modoEdicion
        ? `http://localhost:8080/api/productos/${productoActual.id}`
        : 'http://localhost:8080/api/productos';
      const method = modoEdicion ? 'PUT' : 'POST';

      // Construir el body respetando la estructura ProductoDetalleDTO
      const body = {
        id: productoActual.id ?? null,
        titulo: productoActual.titulo,
        descripcion: productoActual.descripcion,
        precio: {
          importe: parseFloat(String(productoActual.precio.importe).replace(',', '.')),
          moneda: productoActual.precio.moneda || 'EUR',
        },
        imagen: productoActual.imagen,
        stock: parseInt(productoActual.stock),
        categoria: productoActual.categoria,
        color:   productoActual.color   || null,
        talla:   productoActual.talla   || null,
        fibra:   productoActual.fibra   || null,
        estilo:  productoActual.estilo  || null,
        tipo:    productoActual.tipo    || null,
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error(await res.text());

      setModalAbierto(false);
      await cargarProductos();
    } catch (err) {
      setErrorModal('Error al guardar: ' + err.message);
    } finally {
      setGuardando(false);
    }
  };

  // ── Eliminar ──
  const handleEliminar = async (id) => {
    try {
      const res = await fetch(`http://localhost:8080/api/productos/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      setConfirmando(null);
      await cargarProductos();
    } catch {
      setError('No se pudo eliminar el producto.');
    }
  };

  const handleCampo = (e) => {
    const { name, value } = e.target;
    if (name === 'importe' || name === 'moneda') {
      setProductoActual(prev => ({ ...prev, precio: { ...prev.precio, [name]: value } }));
    } else {
      setProductoActual(prev => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div>
      {/* Cabecera */}
      <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-3">
        <div>
          <h2 className="logo-text fw-bold mb-1" style={{ fontSize: '2rem' }}>
            <i className="fa-solid fa-box text-accent me-2"></i> Catálogo de Productos
          </h2>
          <p className="text-muted small mb-0">{productos.length} productos en total</p>
        </div>
        <button
          className="btn btn-primary-accent rounded-pill px-4 py-2 shadow-sm d-flex align-items-center gap-2"
          onClick={abrirCrear}>
          <i className="fa-solid fa-plus"></i> Añadir nuevo producto
        </button>
      </div>

      {/* Error global */}
      {error && (
        <div className="alert alert-danger rounded-3 d-flex align-items-center gap-2 mb-4">
          <i className="fa-solid fa-circle-exclamation"></i><span>{error}</span>
        </div>
      )}

      {/* Filtros */}
      <div className="card-premium p-3 mb-4 d-flex flex-wrap gap-3 align-items-center">
        <div className="flex-grow-1 position-relative" style={{ minWidth: '200px' }}>
          <i className="fa-solid fa-magnifying-glass position-absolute text-muted"
            style={{ left: '12px', top: '50%', transform: 'translateY(-50%)' }}></i>
          <input
            type="text"
            className="form-control rounded-3 ps-5"
            placeholder="Buscar por nombre..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
          />
        </div>
        <select
          className="form-select rounded-3"
          style={{ width: 'auto', minWidth: '160px' }}
          value={filtroCategoria}
          onChange={e => setFiltroCategoria(e.target.value)}
        >
          <option value="">Todas las categorías</option>
          {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        {(busqueda || filtroCategoria) && (
          <button
            className="btn btn-sm btn-outline-secondary rounded-pill px-3"
            onClick={() => { setBusqueda(''); setFiltroCategoria(''); }}>
            <i className="fa-solid fa-xmark me-1"></i> Limpiar
          </button>
        )}
      </div>

      {/* Tabla */}
      <div className="card-premium overflow-hidden">
        {cargando ? (
          <div className="text-center py-5">
            <div className="spinner-border text-accent" role="status"
              style={{ width: '2.5rem', height: '2.5rem' }}></div>
            <p className="text-muted mt-3">Cargando productos...</p>
          </div>
        ) : productosFiltrados.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <i className="fa-solid fa-box-open fa-3x mb-3 opacity-25"></i>
            <p>No se encontraron productos.</p>
          </div>
        ) : (
          <table className="table mb-0 align-middle">
            <thead style={{ backgroundColor: '#f8f5f0' }}>
              <tr>
                {['Imagen', 'Nombre', 'Categoría', 'Stock', 'Precio', 'Acciones'].map(col => (
                  <th key={col}
                    className="py-3 px-4 fw-semibold text-muted small text-uppercase"
                    style={{ letterSpacing: '0.5px', borderBottom: '1px solid var(--border-color)' }}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {productosFiltrados.map(p => (
                <tr key={p.id}
                  style={{ borderBottom: '1px solid var(--border-color, #f0ebe3)' }}>

                  {/* Imagen */}
                  <td className="py-3 px-4">
                    <div className="rounded-3 overflow-hidden shadow-sm"
                      style={{ width: '56px', height: '56px', flexShrink: 0 }}>
                      <img
                        src={p.imagen?.startsWith('http') || p.imagen?.startsWith('/')
                          ? p.imagen : `/${p.imagen}`}
                        alt={p.titulo}
                        className="w-100 h-100"
                        style={{ objectFit: 'cover' }}
                        onError={e => { e.target.src = '/imagenes/placeholder.png'; }}
                      />
                    </div>
                  </td>

                  {/* Nombre */}
                  <td className="py-3 px-4">
                    <p className="fw-semibold text-dark mb-0">{p.titulo}</p>
                    <p className="text-muted small mb-0" style={{ fontSize: '0.75rem' }}>
                      {p.descripcion?.slice(0, 50)}{p.descripcion?.length > 50 ? '...' : ''}
                    </p>
                  </td>

                  {/* Categoría */}
                  <td className="py-3 px-4">
                    <CategoriaBadge categoria={p.categoria} />
                  </td>

                  {/* Stock */}
                  <td className="py-3 px-4">
                    <span className={`fw-bold ${p.stock === 0 ? 'text-danger' : p.stock <= 5 ? 'text-warning' : 'text-dark'}`}>
                      {p.stock}
                    </span>
                    {p.stock === 0 && (
                      <span className="badge rounded-pill ms-2"
                        style={{ backgroundColor: '#f8d7da', color: '#721c24', fontSize: '0.7rem' }}>
                        Sin stock
                      </span>
                    )}
                    {p.stock > 0 && p.stock <= 5 && (
                      <span className="badge rounded-pill ms-2"
                        style={{ backgroundColor: '#fff3cd', color: '#856404', fontSize: '0.7rem' }}>
                        Bajo
                      </span>
                    )}
                  </td>

                  {/* Precio */}
                  <td className="py-3 px-4 fw-bold text-accent">
                    {p.precio?.importe} {p.precio?.moneda === 'EUR' ? '€' : p.precio?.moneda}
                  </td>

                  {/* Acciones */}
                  <td className="py-3 px-4">
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-sm rounded-3 d-flex align-items-center gap-1"
                        style={{ backgroundColor: '#e3f2fd', color: '#0d47a1', border: 'none' }}
                        onClick={() => abrirEditar(p.id)}
                        title="Editar">
                        <i className="fa-solid fa-pen fa-xs"></i>
                      </button>
                      <button
                        className="btn btn-sm rounded-3 d-flex align-items-center gap-1"
                        style={{ backgroundColor: '#fce4ec', color: '#880e4f', border: 'none' }}
                        onClick={() => setConfirmando(p.id)}
                        title="Eliminar">
                        <i className="fa-solid fa-trash fa-xs"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Modal Crear / Editar ── */}
      {modalAbierto && (
        <div className="modal d-block" tabIndex="-1"
          style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <div className="modal-dialog modal-lg modal-dialog-scrollable">
            <div className="modal-content rounded-4 border-0 shadow">

              <div className="modal-header border-0 pb-0 px-4 pt-4">
                <h5 className="modal-title logo-text fw-bold fs-4">
                  {modoEdicion ? '✏️ Editar producto' : '➕ Nuevo producto'}
                </h5>
                <button type="button" className="btn-close"
                  onClick={() => setModalAbierto(false)}></button>
              </div>

              <form onSubmit={handleGuardar}>
                <div className="modal-body px-4 py-3">

                  {errorModal && (
                    <div className="alert alert-danger rounded-3 small d-flex align-items-center gap-2 mb-3">
                      <i className="fa-solid fa-circle-exclamation flex-shrink-0"></i>
                      <span>{errorModal}</span>
                    </div>
                  )}

                  {/* Título + Categoría */}
                  <div className="row g-3 mb-3">
                    <div className="col-8">
                      <label className="form-label fw-semibold small">Título *</label>
                      <input type="text" name="titulo" className="form-control rounded-3"
                        placeholder="Nombre del producto"
                        value={productoActual.titulo} onChange={handleCampo} required />
                    </div>
                    <div className="col-4">
                      <label className="form-label fw-semibold small">Categoría *</label>
                      <select name="categoria" className="form-select rounded-3"
                        value={productoActual.categoria} onChange={handleCampo}>
                        {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Descripción */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Descripción *</label>
                    <textarea name="descripcion" className="form-control rounded-3" rows={3}
                      placeholder="Describe el producto..."
                      value={productoActual.descripcion} onChange={handleCampo} required />
                  </div>

                  {/* Precio + Stock + Imagen */}
                  <div className="row g-3 mb-3">
                    <div className="col-4">
                      <label className="form-label fw-semibold small">Precio *</label>
                      <div className="input-group">
                        <input type="number" name="importe" className="form-control rounded-start-3"
                          placeholder="0.00" step="0.01" min="0"
                          value={productoActual.precio.importe} onChange={handleCampo} required />
                        <span className="input-group-text rounded-end-3">€</span>
                      </div>
                    </div>
                    <div className="col-3">
                      <label className="form-label fw-semibold small">Stock *</label>
                      <input type="number" name="stock" className="form-control rounded-3"
                        placeholder="0" min="0"
                        value={productoActual.stock} onChange={handleCampo} required />
                    </div>
                    <div className="col-5">
                      <label className="form-label fw-semibold small">Imagen (ruta) *</label>
                      <input type="text" name="imagen" className="form-control rounded-3"
                        placeholder="/imagenes/producto.jpg"
                        value={productoActual.imagen} onChange={handleCampo} required />
                    </div>
                  </div>

                  {/* Atributos opcionales según categoría */}
                  <div className="p-3 rounded-3 mb-3"
                    style={{ backgroundColor: '#f8f5f0', border: '1px solid var(--border-color)' }}>
                    <p className="text-muted small fw-semibold mb-3 text-uppercase"
                      style={{ letterSpacing: '0.5px' }}>
                      Atributos opcionales
                    </p>
                    <div className="row g-3">
                      <div className="col-6 col-md-4">
                        <label className="form-label fw-semibold small">Color</label>
                        <select name="color" className="form-select rounded-3"
                          value={productoActual.color} onChange={handleCampo}>
                          <option value="">— Sin color —</option>
                          {COLORES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div className="col-6 col-md-4">
                        <label className="form-label fw-semibold small">Fibra</label>
                        <select name="fibra" className="form-select rounded-3"
                          value={productoActual.fibra} onChange={handleCampo}>
                          <option value="">— Sin fibra —</option>
                          {FIBRAS.map(f => <option key={f} value={f}>{f}</option>)}
                        </select>
                      </div>
                      <div className="col-6 col-md-4">
                        <label className="form-label fw-semibold small">Talla</label>
                        <select name="talla" className="form-select rounded-3"
                          value={productoActual.talla} onChange={handleCampo}>
                          <option value="">— Sin talla —</option>
                          {TALLAS.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>
                      <div className="col-6 col-md-4">
                        <label className="form-label fw-semibold small">Estilo</label>
                        <select name="estilo" className="form-select rounded-3"
                          value={productoActual.estilo} onChange={handleCampo}>
                          <option value="">— Sin estilo —</option>
                          {ESTILOS.map(e => <option key={e} value={e}>{e}</option>)}
                        </select>
                      </div>
                      <div className="col-6 col-md-4">
                        <label className="form-label fw-semibold small">Tipo</label>
                        <select name="tipo" className="form-select rounded-3"
                          value={productoActual.tipo} onChange={handleCampo}>
                          <option value="">— Sin tipo —</option>
                          {TIPOS.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Preview imagen */}
                  {productoActual.imagen && (
                    <div className="text-center">
                      <p className="text-muted small mb-2">Vista previa de imagen:</p>
                      <img
                        src={productoActual.imagen?.startsWith('http') || productoActual.imagen?.startsWith('/')
                          ? productoActual.imagen : `/${productoActual.imagen}`}
                        alt="preview"
                        className="rounded-3 shadow-sm"
                        style={{ maxHeight: '120px', objectFit: 'cover' }}
                        onError={e => { e.target.style.display = 'none'; }}
                      />
                    </div>
                  )}
                </div>

                <div className="modal-footer border-0 px-4 pb-4">
                  <button type="button" className="btn btn-outline-secondary rounded-pill px-4"
                    onClick={() => setModalAbierto(false)}>
                    Cancelar
                  </button>
                  <button type="submit"
                    className="btn btn-primary-accent rounded-pill px-5 d-flex align-items-center gap-2"
                    disabled={guardando}>
                    {guardando
                      ? <><i className="fa-solid fa-circle-notch fa-spin"></i> Guardando...</>
                      : <><i className="fa-solid fa-floppy-disk"></i> {modoEdicion ? 'Guardar cambios' : 'Crear producto'}</>}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal confirmación eliminar ── */}
      {confirmando !== null && (
        <div className="modal d-block" tabIndex="-1"
          style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '420px' }}>
            <div className="modal-content rounded-4 border-0 shadow text-center p-4">
              <i className="fa-solid fa-triangle-exclamation text-warning fa-3x mb-3"></i>
              <h5 className="logo-text fw-bold mb-2">¿Eliminar producto?</h5>
              <p className="text-muted mb-4">Esta acción no se puede deshacer.</p>
              <div className="d-flex gap-3 justify-content-center">
                <button className="btn btn-outline-secondary rounded-pill px-4"
                  onClick={() => setConfirmando(null)}>
                  Cancelar
                </button>
                <button
                  className="btn rounded-pill px-4"
                  style={{ backgroundColor: '#f8d7da', color: '#721c24', border: 'none' }}
                  onClick={() => handleEliminar(confirmando)}>
                  <i className="fa-solid fa-trash me-2"></i> Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminProductos;