import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useSearchParams } from 'react-router-dom';

function Productos() {
  const [productos, setProductos] = useState([]);
  const [searchParams] = useSearchParams();
  
  const terminoBusqueda = searchParams.get('q') || '';
  const categoriaUrl = searchParams.get('categoria') || '';

  const [filtros, setFiltros] = useState({
    color: '', talla: '', fibra: '', estilo: '', tipo: '', precioMax: 100
  });

  useEffect(() => {
    axios.get('http://localhost:8080/api/productos')
      .then(res => setProductos(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleFiltroChange = (e) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  const limpiarFiltros = () => {
    setFiltros({ color: '', talla: '', fibra: '', estilo: '', tipo: '', precioMax: 100 });
  };

  const productosFiltrados = productos.filter((prod) => {
    const matchBusqueda = prod.titulo?.toLowerCase().includes(terminoBusqueda.toLowerCase());
    const matchCategoria = categoriaUrl ? prod.categoria?.toUpperCase() === categoriaUrl.toUpperCase() : true;
    const matchColor = filtros.color ? prod.color?.toUpperCase() === filtros.color.toUpperCase() : true;
    const matchTalla = filtros.talla ? prod.talla?.toUpperCase() === filtros.talla.toUpperCase() : true;
    const matchFibra = filtros.fibra ? prod.fibra?.toUpperCase() === filtros.fibra.toUpperCase() : true;
    const matchEstilo = filtros.estilo ? prod.estilo?.toUpperCase() === filtros.estilo.toUpperCase() : true;
    const matchTipo = filtros.tipo ? prod.tipo?.toUpperCase() === filtros.tipo.toUpperCase() : true;
    const precioProducto = prod.precio?.importe || 0;
    const matchPrecio = precioProducto <= Number(filtros.precioMax);

    return matchBusqueda && matchCategoria && matchColor && matchTalla && matchFibra && matchEstilo && matchTipo && matchPrecio;
  });

  return (
    <div className="flex-grow-1 py-5">
      <div className="container">
        
        <h2 className="logo-text mb-5 text-center" style={{ fontSize: '2.5rem' }}>
          {terminoBusqueda 
            ? <><i className="fa-solid fa-magnifying-glass text-accent me-2"></i> Resultados para: "{terminoBusqueda}"</>
            : (categoriaUrl 
                ? <><i className="fa-solid fa-layer-group text-accent me-2"></i> Catálogo de {categoriaUrl.toLowerCase()}</>
                : <><i className="fa-solid fa-book-open text-accent me-2"></i> Catálogo Completo</>
              )
          }
        </h2>

        
        <div className="row gap-4 gap-lg-0 align-items-start">
          
          
          <div className="col-lg-3 mb-4">
            
            <div className="card-premium sticky-sidebar" style={{ padding: '1.5rem' }}>
              <h5 className="logo-text mb-4 border-bottom pb-3 fs-4"><i className="fa-solid fa-sliders text-accent me-2"></i> Filtros</h5>

              
              <div className="mb-4">
                <label className="form-label fw-bold text-muted small">Precio Máximo: {filtros.precioMax}€</label>
                <input 
                  type="range" 
                  className="custom-range" 
                  name="precioMax" 
                  min="0" 
                  max="100" 
                  value={filtros.precioMax} 
                  onChange={handleFiltroChange} 
                />
              </div>

              {/* COLOR */}
              <div className="mb-3">
                <label className="form-label fw-bold text-muted small">Color</label>
                <select className="form-select border-0 bg-light shadow-none" name="color" value={filtros.color} onChange={handleFiltroChange}>
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
                    <select className="form-select border-0 bg-light shadow-none" name="talla" value={filtros.talla} onChange={handleFiltroChange}>
                      <option value="">Todas</option>
                      <option value="BEBE">Bebé</option>
                      <option value="NIÑO">Niño/a</option>
                      <option value="ADULTO">Adulto</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold text-muted small">Fibra</label>
                    <select className="form-select border-0 bg-light shadow-none" name="fibra" value={filtros.fibra} onChange={handleFiltroChange}>
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
                <div className="mb-3">
                  <label className="form-label fw-bold text-muted small">Tipo de Fibra</label>
                  <select className="form-select border-0 bg-light shadow-none" name="fibra" value={filtros.fibra} onChange={handleFiltroChange}>
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
              )}

              {/* FILTROS AMIGURUMI */}
              {categoriaUrl === 'AMIGURUMI' && (
                <>
                  <div className="mb-3">
                    <label className="form-label fw-bold text-muted small">Tamaño / Utilidad</label>
                    <select className="form-select border-0 bg-light shadow-none" name="tipo" value={filtros.tipo} onChange={handleFiltroChange}>
                      <option value="">Todos</option>
                      <option value="MINI">Mini Amigurumis</option>
                      <option value="LLAVERO">Llaveros</option>
                      <option value="INANIMADO">Inanimados</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold text-muted small">Estilo</label>
                    <select className="form-select border-0 bg-light shadow-none" name="estilo" value={filtros.estilo} onChange={handleFiltroChange}>
                      <option value="">Todos</option>
                      <option value="KAWAI">Kawai</option>
                      <option value="REALISTA">Realista</option>
                      <option value="CLASICO">Clásico</option>
                    </select>
                  </div>
                </>
              )}

              <button onClick={limpiarFiltros} className="btn btn-outline-accent w-100 mt-4">
                <i className="fa-solid fa-eraser me-2"></i> Limpiar Filtros
              </button>
            </div>
          </div>

          
          <div className="col-lg-9">
            {productosFiltrados.length === 0 ? (
              <div className="text-center py-5 card-premium">
                <i className="fa-regular fa-face-frown text-muted mb-3" style={{ fontSize: '4rem' }}></i>
                <h4 className="logo-text">No se encontraron productos</h4>
                <p className="text-muted">Prueba a cambiar los filtros o navegar por otra categoría.</p>
                <button onClick={limpiarFiltros} className="btn bg-accent text-white rounded-pill px-4 mt-2 nav-link-hover">
                  Ver todo el catálogo
                </button>
              </div>
            ) : (
              <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-4">
                {productosFiltrados.map((prod) => (
                  <div key={prod.id} className="col">
                    <div className="card-premium h-100 d-flex flex-column text-center text-decoration-none text-dark">
                      
                      <span className="card-tag text-capitalize text-muted border">
                        {prod.categoria?.toLowerCase()}
                      </span>
                      
                      {prod.stock < 20 && (
                        <span className="position-absolute badge bg-danger text-white rounded-pill shadow-sm" style={{ top: '1.5rem', right: '1.5rem', zIndex: 10 }}>
                          ¡Solo {prod.stock}!
                        </span>
                      )}

                      <div className="card-img-premium">
                        <img src={prod.imagen} alt={prod.titulo} />
                      </div>
                      
                      <h6 className="fw-bold mt-2 mb-1 text-truncate px-2">{prod.titulo}</h6>
                      
                      
                      <div className="d-flex justify-content-center gap-2 mb-2 flex-wrap px-2 mt-2">
                        {prod.talla && <span className="badge badge-pastel text-capitalize">{prod.talla.toLowerCase()}</span>}
                        {prod.fibra && <span className="badge badge-pastel text-capitalize">{prod.fibra.toLowerCase()}</span>}
                        {prod.estilo && <span className="badge badge-pastel text-capitalize">{prod.estilo.toLowerCase()}</span>}
                      </div>

                      <p className="price-text fs-4 mb-4 mt-auto pt-3">
                        {prod.precio.importe} {prod.precio.moneda === 'EUR' ? '€' : prod.precio.moneda}
                      </p>
                      
                      <Link to={`/producto/${prod.id}`} className="btn btn-outline-accent w-100 py-2">
                        Ver detalles
                      </Link>
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