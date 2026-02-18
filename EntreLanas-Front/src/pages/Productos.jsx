import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useSearchParams } from 'react-router-dom';

function Productos() {
  const [productos, setProductos] = useState([]);
  const [searchParams] = useSearchParams();
  
  const terminoBusqueda = searchParams.get('q') || '';
  const categoriaUrl = searchParams.get('categoria') || '';

  const [filtros, setFiltros] = useState({
    color: '',
    talla: '',
    fibra: '',
    estilo: '',
    tipo: '',
    precioMax: 100
  });

  useEffect(() => {
    axios.get('http://localhost:8080/api/productos')
      .then(res => { setProductos(res.data);
    console.log("DATOS REALES DEL BACKEND:", res.data); })
      .catch(err => console.error(err));
  }, []);

  const handleFiltroChange = (e) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  const limpiarFiltros = () => {
    setFiltros({ color: '', talla: '', fibra: '', estilo: '', tipo: '', precioMax: 100 });
  };

  // Filtrado A PRUEBA DE BALAS (Ignora mayúsculas/minúsculas y protege contra nulos)
  const productosFiltrados = productos.filter((prod) => {
    
    // 1. Filtro de Búsqueda
    const matchBusqueda = prod.titulo?.toLowerCase().includes(terminoBusqueda.toLowerCase());
    
    // 2. Filtro de Categoría (URL)
    const matchCategoria = categoriaUrl 
      ? prod.categoria?.toUpperCase() === categoriaUrl.toUpperCase() 
      : true;
    
    // 3. Filtros del Panel Lateral
    const matchColor = filtros.color 
      ? prod.color?.toUpperCase() === filtros.color.toUpperCase() 
      : true;
      
    const matchTalla = filtros.talla 
      ? prod.talla?.toUpperCase() === filtros.talla.toUpperCase() 
      : true;
      
    const matchFibra = filtros.fibra 
      ? prod.fibra?.toUpperCase() === filtros.fibra.toUpperCase() 
      : true;
      
    const matchEstilo = filtros.estilo 
      ? prod.estilo?.toUpperCase() === filtros.estilo.toUpperCase() 
      : true;
      
    const matchTipo = filtros.tipo 
      ? prod.tipo?.toUpperCase() === filtros.tipo.toUpperCase() 
      : true;
      
    // 4. Filtro de Precio (Forzamos a que sean números para evitar fallos matemáticos)
    const precioProducto = prod.precio?.importe || 0;
    const matchPrecio = precioProducto <= Number(filtros.precioMax);

    // Solo mostramos el producto si cumple TODOS los filtros activos
    return matchBusqueda && matchCategoria && matchColor && matchTalla && matchFibra && matchEstilo && matchTipo && matchPrecio;
  });

  return (
    <div className="bg-light min-vh-100 py-5">
      <div className="container">
        
        <h2 className="fw-bold mb-4 text-primary text-capitalize">
          {terminoBusqueda ? `🔍 Resultados para: "${terminoBusqueda}"` : (categoriaUrl ? `Catálogo de ${categoriaUrl.toLowerCase()}` : 'Catálogo Completo')}
        </h2>

        <div className="row">
          {/* SIDEBAR DE FILTROS */}
          <div className="col-lg-3 col-md-4 mb-4">
            <div className="card shadow-sm border-0 p-3 sticky-top" style={{ top: '80px' }}>
              <h5 className="fw-bold mb-3 border-bottom pb-2">Filtros</h5>

              {/* PRECIO */}
              <div className="mb-3">
                <label className="form-label fw-bold text-muted small">Precio Máximo: {filtros.precioMax}€</label>
                <input type="range" className="form-range" name="precioMax" min="0" max="100" value={filtros.precioMax} onChange={handleFiltroChange} />
              </div>

              {/* COLOR */}
              <div className="mb-3">
                <label className="form-label fw-bold text-muted small">Color</label>
                <select className="form-select form-select-sm" name="color" value={filtros.color} onChange={handleFiltroChange}>
                  <option value="">Todos los colores</option>
                  <option value="ROJO">Rojo</option>
                  <option value="AZUL">Azul</option>
                  <option value="AMARILLO">Amarillo</option>
                  <option value="VERDE">Verde</option>
                  <option value="ROSA">Rosa</option>
                  <option value="MORADO">Morado</option>
                  <option value="NEGRO">Negro</option>
                  <option value="BLANCO">Blanco</option>
                  <option value="MARRON">Marrón</option>
                  <option value="NARANJA">Naranja</option>
                  <option value="GRIS">Gris</option>
                </select>
              </div>

              {/* FILTROS ROPA */}
              {categoriaUrl === 'ROPA' && (
                <>
                  <div className="mb-3">
                    <label className="form-label fw-bold text-muted small">Talla</label>
                    <select className="form-select form-select-sm" name="talla" value={filtros.talla} onChange={handleFiltroChange}>
                      <option value="">Todas</option>
                      <option value="BEBE">Bebé</option>
                      <option value="NIÑO">Niño/a</option>
                      <option value="ADULTO">Adulto</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold text-muted small">Material (Fibra)</label>
                    <select className="form-select form-select-sm" name="fibra" value={filtros.fibra} onChange={handleFiltroChange}>
                      <option value="">Todas</option>
                      <option value="LANA">Lana</option>
                      <option value="SEDA">Seda</option>
                      <option value="CACHEMIRA">Cachemira</option>
                      <option value="ALGODON">Algodón</option>
                      <option value="LINO">Lino</option>
                      <option value="BAMBU">Bambú</option>
                      <option value="NAILON">Nailon</option>
                      <option value="POLIESTER">Poliéster</option>
                    </select>
                  </div>
                </>
              )}

              {/* FILTROS MATERIAL */}
              {categoriaUrl === 'MATERIAL' && (
                <>
                  <div className="mb-3">
                    <label className="form-label fw-bold text-muted small">Tipo de Fibra</label>
                    <select className="form-select form-select-sm" name="fibra" value={filtros.fibra} onChange={handleFiltroChange}>
                      <option value="">Todas</option>
                      <option value="LANA">Lana</option>
                      <option value="SEDA">Seda</option>
                      <option value="CACHEMIRA">Cachemira</option>
                      <option value="ALGODON">Algodón</option>
                      <option value="LINO">Lino</option>
                      <option value="BAMBU">Bambú</option>
                      <option value="NAILON">Nailon</option>
                      <option value="POLIESTER">Poliéster</option>
                    </select>
                  </div>
                </>
              )}

              {/* FILTROS AMIGURUMI */}
              {categoriaUrl === 'AMIGURUMI' && (
                <>
                  <div className="mb-3">
                    <label className="form-label fw-bold text-muted small">Tamaño / Utilidad</label>
                    <select className="form-select form-select-sm" name="tipo" value={filtros.tipo} onChange={handleFiltroChange}>
                      <option value="">Todos</option>
                      <option value="MINI">Mini Amigurumis</option>
                      <option value="LLAVERO">Llaveros</option>
                      <option value="INANIMADO">Inanimados</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold text-muted small">Estilo (Diseño)</label>
                    <select className="form-select form-select-sm" name="estilo" value={filtros.estilo} onChange={handleFiltroChange}>
                      <option value="">Todos</option>
                      <option value="KAWAI">Kawai</option>
                      <option value="REALISTA">Realista</option>
                      <option value="CLASICO">Clásico</option>
                    </select>
                  </div>
                </>
              )}

              <button onClick={limpiarFiltros} className="btn btn-outline-danger btn-sm w-100 mt-2">
                Limpiar Filtros
              </button>
            </div>
          </div>

          {/* PRODUCTOS */}
          <div className="col-lg-9 col-md-8">
            {productosFiltrados.length === 0 ? (
              <div className="alert alert-warning text-center shadow-sm">
                <h5>No se encontraron productos con estos filtros 😢</h5>
                <p className="mb-0">Prueba a cambiar el precio, el color o la categoría.</p>
              </div>
            ) : (
              <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-4">
                {productosFiltrados.map((prod) => (
                  <div key={prod.id} className="col">
                    <div className="card h-100 shadow-sm border-0 transition-hover">
                      <div className="position-relative" style={{ height: "200px", overflow: "hidden", backgroundColor: "#f8f9fa" }}>
                        <img src={prod.imagen} className="card-img-top w-100 h-100" alt={prod.titulo} style={{ objectFit: "cover" }} />
                        {/* Etiqueta de Stock flotante */}
                        {prod.stock < 20 && (
                          <span className="badge bg-danger position-absolute top-0 end-0 m-2">¡Solo {prod.stock}!</span>
                        )}
                      </div>
                      
                      <div className="card-body d-flex flex-column">
                        
                        {/* ETIQUETAS CON LOS ENUMS */}
                        <div className="mb-2 d-flex gap-1 flex-wrap">
                          <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 text-capitalize">
                            {prod.categoria?.toLowerCase()}
                          </span>
                          {prod.talla && <span className="badge bg-secondary text-capitalize">{prod.talla?.toLowerCase()}</span>}
                          {prod.fibra && <span className="badge bg-info text-dark text-capitalize">{prod.fibra?.toLowerCase()}</span>}
                          {prod.estilo && <span className="badge bg-warning text-dark text-capitalize">{prod.estilo?.toLowerCase()}</span>}
                          {prod.tipo && <span className="badge bg-success text-white text-capitalize">{prod.tipo?.toLowerCase()}</span>}
                        </div>
                        
                        <h6 className="card-title fw-bold text-dark">{prod.titulo}</h6>
                        
                        <div className="mt-auto pt-3 d-flex justify-content-between align-items-center border-top">
                          <span className="fs-5 fw-bold text-secondary">{prod.precio.importe} {prod.precio.moneda === 'EUR' ? '€' : prod.precio.moneda}</span>
                          <Link to={`/producto/${prod.id}`} className="btn btn-primary btn-sm px-3 fw-bold">
                            Ver detalles
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Productos;