// ===== GROUP 15 SOFTWARE SOLUTIONS - SCRIPTS PRINCIPALES =====

// ===== VARIABLES GLOBALES =====
let serviciosData = null;

// ===== FUNCIÓN PARA CARGAR DATOS JSON =====
async function cargarServiciosData() {
    try {
        const response = await fetch('./servicios.json');
        serviciosData = await response.json();
        return serviciosData;
    } catch (error) {
        console.error('Error al cargar servicios.json:', error);
        return null;
    }
}

// ===== FUNCIÓN PARA CARGAR DETALLE DE SERVICIO =====
async function cargarDetalleServicio() {
    console.log('🔍 Iniciando carga de detalle...');
    
    const urlParams = new URLSearchParams(window.location.search);
    const servicioId = urlParams.get('servicio');
    if (!servicioId) return;

    if (!serviciosData) await cargarServiciosData();
    if (!serviciosData) return;
    
    const servicio = serviciosData.servicios[servicioId];
    if (!servicio) {
        console.error('Servicio no encontrado:', servicioId);
        return;
    }

    actualizarContenidoDetalle(servicio);
}

// ===== FUNCIÓN PARA ACTUALIZAR CONTENIDO HTML DEL DETALLE =====
function actualizarContenidoDetalle(servicio) {
    document.title = `${servicio.titulo} | Group 15 - Software Solutions`;

    const breadcrumb = document.querySelector('.breadcrumb');
    if (breadcrumb) {
        breadcrumb.innerHTML = `
            <a href="index.html">Inicio</a> > 
            <a href="catalogo.html">Servicios</a> > 
            ${servicio.titulo}
        `;
    }
    
    const serviceImage = document.querySelector('.service-detail img');
    if (serviceImage) {
        serviceImage.alt = servicio.titulo; // Mantener imagen del catálogo
    }

    const titulo = document.querySelector('.info h1');
    if (titulo) titulo.textContent = servicio.titulo;
    
    const priceContainer = document.querySelector('.info .price');
    if (priceContainer) {
        if (servicio.precioOriginal) {
            priceContainer.innerHTML = `
                <span class="original-price">${servicio.precioOriginal}</span>
                ${servicio.precio}
            `;
        } else {
            priceContainer.textContent = servicio.precio;
        }
    }
    
    const stock = document.querySelector('.stock');
    if (stock) {
        stock.textContent = servicio.stock || '✓ Disponible';
        stock.className = 'stock available';
    }
    
    const promo = document.querySelector('.promo');
    if (promo && servicio.promoTexto) {
        promo.textContent = servicio.promoTexto;
    } else if (promo) {
        promo.style.display = 'none';
    }
    
    const descripcion = document.querySelector('.description');
    if (descripcion) descripcion.textContent = servicio.descripcion;
    
    // Características
    const caracteristicasList = document.querySelector('#caracteristicas ul');
    if (caracteristicasList && servicio.caracteristicas) {
        caracteristicasList.innerHTML = '';
        servicio.caracteristicas.forEach(feature => {
            const li = document.createElement('li');
            li.textContent = feature;
            caracteristicasList.appendChild(li);
        });
    }

    // Tecnologías
    const tecnologiasSection = document.querySelector('#tecnologias');
    if (tecnologiasSection && servicio.tecnologias) {
        const tecnologiasList = tecnologiasSection.querySelector('ul');
        tecnologiasList.innerHTML = '';
        servicio.tecnologias.forEach(tech => {
            const li = document.createElement('li');
            li.textContent = tech;
            tecnologiasList.appendChild(li);
        });
        tecnologiasSection.style.display = 'block';
    } else if (tecnologiasSection) {
        tecnologiasSection.style.display = 'none';
    }

    // Proceso
    const procesoSection = document.querySelector('#proceso');
    if (procesoSection && servicio.proceso) {
        const procesoList = procesoSection.querySelector('ul');
        procesoList.innerHTML = '';
        servicio.proceso.forEach(step => {
            const li = document.createElement('li');
            li.textContent = step;
            procesoList.appendChild(li);
        });
        procesoSection.style.display = 'block';
    } else if (procesoSection) {
        procesoSection.style.display = 'none';
    }

    // Garantías
    const garantiasSection = document.querySelector('#garantias');
    if (garantiasSection && servicio.garantias) {
        const garantiasList = garantiasSection.querySelector('ul');
        garantiasList.innerHTML = '';
        servicio.garantias.forEach(garantia => {
            const li = document.createElement('li');
            li.textContent = garantia;
            garantiasList.appendChild(li);
        });
        garantiasSection.style.display = 'block';
    } else if (garantiasSection) {
        garantiasSection.style.display = 'none';
    }
}

// ===== FUNCIONES DEL MODAL =====
function openModal() {
    const modal = document.getElementById('contact-modal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function closeModal() {
    const modal = document.getElementById('contact-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}


// ===== SMOOTH SCROLL PARA NAVEGACIÓN =====
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const target = document.getElementById(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// ===== EVENTOS DE CARGA DE PÁGINA =====
document.addEventListener('DOMContentLoaded', function() {
    initSmoothScroll();
    
    const currentPage = window.location.pathname;
    if (currentPage.includes('catalogo') || currentPage.includes('index')) {
        if (document.querySelector('.grid')) initCatalogoEffects();
    }
    if (currentPage.includes('detalle') || window.location.search.includes('servicio=')) {
        cargarDetalleServicio();
    }

    const solicitarBtn = document.getElementById('solicitar-btn');
    if (solicitarBtn) solicitarBtn.addEventListener('click', openModal);

    const closeBtn = document.querySelector('.close');
    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    const modal = document.getElementById('contact-modal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) closeModal();
        });
    }
    // Botón enviar en el modal
    const enviarBtn = document.getElementById('enviar-btn');
    if (enviarBtn) {
    enviarBtn.addEventListener('click', () => {
    const userInfo = document.getElementById('user-info');
    if (userInfo) {
      alert("✅ Datos enviados .");
      userInfo.value = ""; // limpiar el campo
    }
  });
}

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeModal();
    });
});

window.closeModal = closeModal;
