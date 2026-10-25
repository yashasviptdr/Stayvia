/**
 * ==============================================================================
 * Stayvia - Client-side Main JavaScript
 * Handles dynamic UI rendering, search filtering, modals, and backend status checks
 * Tailored for students studying near MITS Gwalior (Gola Ka Mandir)
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

function initApp() {
  renderTrustPillars();
  renderAccommodations();
  renderMessServices();
  setupSearchForm();
  setupFilterControls();
  checkBackendHealth();
  setupActionModals();
  checkAuthSession();
}

/**
 * 1. Check Backend Health
 * Queries /api/health to confirm Express server connectivity
 */
async function checkBackendHealth() {
  const badgeEl = document.getElementById('serverStatusBadge');
  if (!badgeEl) return;

  try {
    const response = await fetch('/api/health');
    if (response.ok) {
      const data = await response.json();
      badgeEl.className = 'badge bg-success-subtle text-success border border-success-subtle px-2 py-1';
      badgeEl.innerHTML = `<i class="bi bi-check-circle-fill me-1"></i> Express Server Active (v${data.version || '1.0'})`;
    } else {
      badgeEl.className = 'badge bg-warning-subtle text-warning border border-warning-subtle px-2 py-1';
      badgeEl.innerHTML = `<i class="bi bi-exclamation-triangle-fill me-1"></i> Backend returned status ${response.status}`;
    }
  } catch (err) {
    // Expected when running directly as a static file (e.g., file:/// protocol)
    badgeEl.className = 'badge bg-secondary-subtle text-secondary border border-secondary-subtle px-2 py-1';
    badgeEl.innerHTML = `<i class="bi bi-hdd-network me-1"></i> Static Preview Mode`;
  }
}

/**
 * 2. Render Trust & Value Pillars
 */
function renderTrustPillars() {
  const container = document.getElementById('trustPillarsContainer');
  if (!container || !window.STAYVIA_SAMPLE_DATA) return;

  const pillars = window.STAYVIA_SAMPLE_DATA.trustPillars || [];
  container.innerHTML = pillars.map(pillar => `
    <div class="col-md-6 col-lg-3">
      <div class="trust-pillar-card">
        <div class="pillar-icon-box">
          <i class="bi ${pillar.icon}"></i>
        </div>
        <h3>${escapeHtml(pillar.title)}</h3>
        <p>${escapeHtml(pillar.description)}</p>
      </div>
    </div>
  `).join('');
}

/**
 * 3. Render Accommodation Cards
 */
function renderAccommodations(filteredList = null) {
  const container = document.getElementById('accommodationsList');
  const countEl = document.getElementById('resultsCount');
  if (!container || !window.STAYVIA_SAMPLE_DATA) return;

  const list = filteredList !== null 
    ? filteredList 
    : (window.StayviaStorage ? window.StayviaStorage.getAllAccommodations() : (window.STAYVIA_SAMPLE_DATA.accommodations || []));

  if (countEl) {
    countEl.textContent = `Showing ${list.length} demonstration accommodation${list.length === 1 ? '' : 's'} near MITS Gwalior`;
  }

  // Exact empty state requirement
  if (list.length === 0) {
    container.innerHTML = `
      <div class="col-12 text-center py-5">
        <div class="p-5 bg-white rounded-4 border">
          <i class="bi bi-search text-secondary display-4 mb-3 d-block"></i>
          <h3 class="h4 fw-bold">No matching sample listings found. Try changing your filters.</h3>
          <p class="text-secondary mb-4">No demonstration properties in Gwalior matched your selected combination of locality, type, budget, or facility. Try relaxing your filters to see more sample stays.</p>
          <button class="btn btn-stayvia-primary px-4 py-2" onclick="resetSearchFilters()">
            <i class="bi bi-arrow-counterclockwise me-1"></i> Reset All Filters
          </button>
        </div>
      </div>
    `;
    return;
  }

  container.innerHTML = list.map(item => `
    <div class="col-md-6 col-lg-4">
      <article class="accommodation-card position-relative">
        <a href="/property?id=${item.id}" class="card-image-wrap text-decoration-none d-block position-relative">
          <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.alt || item.name)}" loading="lazy">
          <span class="card-type-badge">${escapeHtml(item.type)}</span>
          <span class="card-gender-badge"><i class="bi bi-person me-1"></i>${escapeHtml(item.gender)}</span>
          ${item.status === 'occupied' ? `<span class="badge bg-warning position-absolute top-0 end-0 m-2 shadow-sm text-dark fw-bold"><i class="bi bi-lock-fill me-1"></i>Fully Occupied</span>` : ''}
        </a>
        
        <div class="card-body-content">
          <div class="card-location-meta">
            <i class="bi bi-geo-alt-fill text-danger"></i>
            <span>${escapeHtml(item.locality)}, Gwalior</span>
            <span class="badge ${item.isOwnerListing ? 'bg-success-subtle text-success border border-success-subtle' : 'bg-secondary-subtle text-secondary'} ms-auto small" style="font-size: 0.68rem;">
              ${item.isOwnerListing ? '<i class="bi bi-person-badge me-1"></i>Owner Listing' : 'Sample Data'}
            </span>
          </div>
          
          <h3 class="accommodation-title">
            <a href="/property?id=${item.id}" class="text-dark text-decoration-none">
              ${escapeHtml(item.name)}
            </a>
          </h3>
          <p class="accommodation-distance mb-2 text-muted small">
            <i class="bi bi-mortarboard me-1 text-primary"></i> ${escapeHtml(item.localityNote || item.locality)}
          </p>
          
          <div class="facilities-pills-row">
            ${(item.facilities || []).slice(0, 3).map(fac => `
              <span class="facility-pill">${escapeHtml(fac)}</span>
            `).join('')}
            ${item.facilities && item.facilities.length > 3 ? `
              <span class="facility-pill text-muted">+${item.facilities.length - 3} more</span>
            ` : ''}
          </div>
          
          <div class="card-pricing-footer">
            <div>
              <div class="pricing-amount">₹${item.monthlyRent.toLocaleString('en-IN')}<span class="pricing-unit">/mo</span></div>
              <div class="deposit-subtext">${escapeHtml(item.depositNote || 'Standard deposit')}</div>
            </div>
            
            <div class="d-flex gap-1">
              <button class="btn btn-sm btn-outline-secondary px-2" title="Quick Preview" onclick="openAccommodationModal(${item.id})">
                <i class="bi bi-eye"></i>
              </button>
              <a href="/property?id=${item.id}" class="btn btn-sm btn-stayvia-primary">
                View Details <i class="bi bi-arrow-right ms-1"></i>
              </a>
            </div>
          </div>
        </div>
      </article>
    </div>
  `).join('');
}

/**
 * 4. Render Mess Services Cards
 */
function renderMessServices() {
  const container = document.getElementById('messServicesContainer');
  if (!container || !window.STAYVIA_SAMPLE_DATA) return;

  const services = window.STAYVIA_SAMPLE_DATA.messServices || [];
  container.innerHTML = services.map(service => `
    <div class="col-md-4">
      <div class="mess-card">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <span class="mess-diet-badge mb-0">
            <i class="bi bi-check2-circle"></i> ${escapeHtml(service.dietType)}
          </span>
          <span class="badge bg-secondary-subtle text-secondary small" style="font-size: 0.68rem;">Sample Mess</span>
        </div>

        <h3 class="h5 fw-bold mb-1">${escapeHtml(service.name)}</h3>
        <p class="text-secondary small mb-2"><i class="bi bi-geo-alt me-1 text-danger"></i>${escapeHtml(service.coverage)}</p>
        
        <p class="text-dark small fw-medium mb-1"><strong>Cuisine:</strong> ${escapeHtml(service.cuisine)}</p>
        
        <ul class="mess-highlights-list">
          ${service.highlights.map(h => `
            <li><i class="bi bi-check-lg"></i> <span>${escapeHtml(h)}</span></li>
          `).join('')}
        </ul>
        
        <div class="mt-auto pt-3 border-top d-flex align-items-center justify-content-between">
          <div>
            <div class="fw-bold text-dark">₹${service.monthlyStartingPrice.toLocaleString('en-IN')}<span class="small text-muted fw-normal">/mo (Sample)</span></div>
            <span class="badge bg-light text-secondary border">Trial: ${service.trialAvailable ? 'Available' : 'N/A'}</span>
          </div>
          <button class="btn btn-sm btn-stayvia-outline-teal" onclick="openMessInquiryModal(${service.id})">
            Inquire Mess
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

/**
 * 5. Search & Filter Handlers
 */
function setupSearchForm() {
  const form = document.getElementById('heroSearchForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    applyFilters();

    // Smooth scroll down to accommodations section
    const target = document.getElementById('accommodations');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
}

function setupFilterControls() {
  // Accommodation Type button pills
  const filterButtons = document.querySelectorAll('.filter-type-btn');
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active', 'btn-stayvia-primary'));
      filterButtons.forEach(b => b.classList.add('btn-stayvia-outline'));
      
      btn.classList.remove('btn-stayvia-outline');
      btn.classList.add('active', 'btn-stayvia-primary');

      const type = btn.getAttribute('data-type');
      const select = document.getElementById('searchType');
      if (select) select.value = type;
      applyFilters();
    });
  });

  // Secondary Quick Locality Dropdown
  const quickLocality = document.getElementById('quickLocalityFilter');
  if (quickLocality) {
    quickLocality.addEventListener('change', () => {
      const searchLoc = document.getElementById('searchLocality');
      if (searchLoc) searchLoc.value = quickLocality.value;
      applyFilters();
    });
  }

  // Primary Locality Select changes quick dropdown too
  const searchLoc = document.getElementById('searchLocality');
  if (searchLoc) {
    searchLoc.addEventListener('change', () => {
      if (quickLocality) quickLocality.value = searchLoc.value;
      applyFilters();
    });
  }

  // Secondary Quick Facility Dropdown
  const quickFacility = document.getElementById('quickFacilityFilter');
  if (quickFacility) {
    quickFacility.addEventListener('change', () => {
      const searchFac = document.getElementById('searchFacility');
      if (searchFac) searchFac.value = quickFacility.value;
      applyFilters();
    });
  }

  // Primary Facility Select changes quick dropdown too
  const searchFac = document.getElementById('searchFacility');
  if (searchFac) {
    searchFac.addEventListener('change', () => {
      if (quickFacility) quickFacility.value = searchFac.value;
      applyFilters();
    });
  }

  // Primary Budget Select
  const searchBudget = document.getElementById('searchBudget');
  if (searchBudget) {
    searchBudget.addEventListener('change', () => {
      applyFilters();
    });
  }

  // Search Type Select updates buttons
  const searchType = document.getElementById('searchType');
  if (searchType) {
    searchType.addEventListener('change', () => {
      filterButtons.forEach(b => {
        if (b.getAttribute('data-type') === searchType.value) {
          b.classList.remove('btn-stayvia-outline');
          b.classList.add('active', 'btn-stayvia-primary');
        } else {
          b.classList.remove('active', 'btn-stayvia-primary');
          b.classList.add('btn-stayvia-outline');
        }
      });
      applyFilters();
    });
  }

  // Keyword input live filter on typing
  const searchKeyword = document.getElementById('searchKeyword');
  if (searchKeyword) {
    searchKeyword.addEventListener('input', () => {
      applyFilters();
    });
  }
}

/**
 * Filter Evaluation Engine
 */
function applyFilters() {
  if (!window.STAYVIA_SAMPLE_DATA) return;

  const locality = (document.getElementById('searchLocality')?.value || 'all').toLowerCase().trim();
  const type = (document.getElementById('searchType')?.value || 'all').toLowerCase().trim();
  const budget = document.getElementById('searchBudget')?.value || 'all';
  const facility = (document.getElementById('searchFacility')?.value || 'all').toLowerCase().trim();
  const keyword = (document.getElementById('searchKeyword')?.value || '').toLowerCase().trim();

  let results = window.StayviaStorage 
    ? window.StayviaStorage.getAllAccommodations() 
    : (window.STAYVIA_SAMPLE_DATA?.accommodations || []);

  // 1. Filter by Locality in Gwalior
  if (locality && locality !== 'all') {
    results = results.filter(item => 
      (item.locality || '').toLowerCase() === locality ||
      (item.localityNote || '').toLowerCase().includes(locality)
    );
  }

  // 2. Filter by Accommodation Type (Hostel, PG, Flat)
  if (type && type !== 'all') {
    results = results.filter(item => (item.type || '').toLowerCase() === type);
  }

  // 3. Filter by Monthly Budget
  if (budget && budget !== 'all') {
    const maxBudget = parseInt(budget, 10);
    if (!isNaN(maxBudget)) {
      results = results.filter(item => (Number(item.monthlyRent) || 0) <= maxBudget);
    }
  }

  // 4. Filter by Facility
  if (facility && facility !== 'all') {
    results = results.filter(item => {
      return (item.facilities || []).some(fac => {
        const f = (fac || '').toLowerCase();
        if (facility === 'wi-fi') return f.includes('wi-fi') || f.includes('wifi') || f.includes('internet');
        if (facility === 'food') return f.includes('meal') || f.includes('food') || f.includes('mess');
        if (facility === 'air') return f.includes('air condition') || f.includes('air-condition') || f.includes('cooler') || /\bac\b/i.test(f);
        if (facility === 'power backup') return f.includes('power backup') || f.includes('backup');
        if (facility === 'attached bathroom') return f.includes('attached bath') || f.includes('ensuite');
        return f.includes(facility);
      });
    });
  }

  // 5. Filter by Optional Freeform Keyword
  if (keyword) {
    results = results.filter(item => 
      (item.name || '').toLowerCase().includes(keyword) ||
      (item.locality || '').toLowerCase().includes(keyword) ||
      (item.localityNote || '').toLowerCase().includes(keyword) ||
      (item.description || '').toLowerCase().includes(keyword) ||
      (item.occupancy || '').toLowerCase().includes(keyword) ||
      (item.gender || '').toLowerCase().includes(keyword) ||
      (item.facilities || []).some(fac => (fac || '').toLowerCase().includes(keyword))
    );
  }

  renderAccommodations(results);
}

function resetSearchFilters() {
  const searchLoc = document.getElementById('searchLocality');
  const quickLoc = document.getElementById('quickLocalityFilter');
  const searchType = document.getElementById('searchType');
  const searchBudget = document.getElementById('searchBudget');
  const searchFac = document.getElementById('searchFacility');
  const quickFac = document.getElementById('quickFacilityFilter');
  const searchKeyword = document.getElementById('searchKeyword');

  if (searchLoc) searchLoc.value = 'all';
  if (quickLoc) quickLoc.value = 'all';
  if (searchType) searchType.value = 'all';
  if (searchBudget) searchBudget.value = 'all';
  if (searchFac) searchFac.value = 'all';
  if (quickFac) quickFac.value = 'all';
  if (searchKeyword) searchKeyword.value = '';

  const filterButtons = document.querySelectorAll('.filter-type-btn');
  filterButtons.forEach(b => {
    b.classList.remove('active', 'btn-stayvia-primary');
    b.classList.add('btn-stayvia-outline');
    if (b.getAttribute('data-type') === 'all') {
      b.classList.remove('btn-stayvia-outline');
      b.classList.add('active', 'btn-stayvia-primary');
    }
  });

  renderAccommodations(null);
}

/**
 * 6. Modal Interactions
 */
function openAccommodationModal(id) {
  const allListings = window.StayviaStorage 
    ? window.StayviaStorage.getAllAccommodations() 
    : (window.STAYVIA_SAMPLE_DATA?.accommodations || []);
  const item = allListings.find(acc => acc.id === id);
  if (!item) return;

  const titleEl = document.getElementById('accModalTitle');
  const bodyEl = document.getElementById('accModalBody');
  if (!titleEl || !bodyEl) return;

  titleEl.textContent = `${item.name}`;
  bodyEl.innerHTML = `
    <div class="row g-4">
      <div class="col-md-6">
        <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}" class="img-fluid rounded-3 mb-3" style="width: 100%; height: 260px; object-fit: cover;">
        
        <div class="alert alert-info py-2 px-3 small mb-3">
          <i class="bi bi-info-circle me-1"></i> <strong>Demonstration Data Only:</strong> This is a sample listing to illustrate Stayvia's interface for MITS Gwalior students. Prices are illustrative example values. Verified distances and map integration will be introduced in future updates.
        </div>
        
        <div class="p-3 bg-light rounded-3 border">
          <h5 class="h6 fw-bold mb-2">Demonstration House Guidelines</h5>
          <ul class="small text-secondary mb-0 ps-3">
            ${(item.rules || []).map(r => `<li>${escapeHtml(r)}</li>`).join('')}
          </ul>
        </div>
      </div>
      
      <div class="col-md-6">
        <div class="d-flex align-items-center gap-2 mb-2">
          <span class="badge bg-dark">${escapeHtml(item.type)}</span>
          <span class="badge bg-secondary-subtle text-dark border">${escapeHtml(item.gender)}</span>
          <span class="badge bg-light text-secondary border">Demonstration Preview</span>
        </div>
        
        <h4 class="h5 fw-bold mb-1">${escapeHtml(item.name)}</h4>
        <p class="text-secondary small mb-2">
          <i class="bi bi-geo-alt text-danger me-1"></i><strong>${escapeHtml(item.locality)}, Gwalior, MP</strong>
        </p>
        <p class="text-primary small mb-3">
          <i class="bi bi-mortarboard me-1"></i>${escapeHtml(item.localityNote)}
        </p>
        
        <p class="small text-secondary mb-3">${escapeHtml(item.description)}</p>
        
        <div class="p-3 bg-white rounded-3 border mb-3">
          <div class="d-flex justify-content-between align-items-baseline mb-1">
            <span class="text-muted small">Indicative Rent:</span>
            <span class="fw-bold text-dark fs-5">₹${item.monthlyRent.toLocaleString('en-IN')}/mo <span class="small fw-normal text-muted">(Illustrative)</span></span>
          </div>
          <div class="d-flex justify-content-between align-items-baseline mb-1">
            <span class="text-muted small">Security Deposit:</span>
            <span class="fw-semibold text-dark small">${escapeHtml(item.depositNote)}</span>
          </div>
          <div class="d-flex justify-content-between align-items-baseline">
            <span class="text-muted small">Occupancy Options:</span>
            <span class="fw-semibold text-dark small">${escapeHtml(item.occupancy)}</span>
          </div>
        </div>
        
        <h5 class="h6 fw-bold mb-2">Amenities & Facilities</h5>
        <div class="d-flex flex-wrap gap-1 mb-4">
          ${item.facilities.map(f => `<span class="badge bg-light text-dark border">${escapeHtml(f)}</span>`).join('')}
        </div>
        
        <div class="d-grid gap-2">
          <a href="/property?id=${item.id}" class="btn btn-stayvia-primary py-2 fw-semibold">
            <i class="bi bi-box-arrow-up-right me-1"></i> Open Full Property Page & Schedule Visit
          </a>
        </div>
      </div>
    </div>
  `;

  const modal = new bootstrap.Modal(document.getElementById('accommodationModal'));
  modal.show();
}

function checkAuthSession() {
  try {
    const user = window.StayviaAuth ? window.StayviaAuth.getUser() : null;
    const authArea = document.getElementById('navAuthArea');
    const ownerDashLink = document.getElementById('navOwnerDashboardLink');

    // Show Owner Dashboard link in main navbar ONLY if logged in as an Owner
    if (ownerDashLink) {
      ownerDashLink.style.display = (user && user.role === 'owner') ? 'block' : 'none';
    }

    if (!authArea) return;

    if (user && user.name) {
      authArea.innerHTML = `
        <div class="dropdown">
          <button class="btn btn-sm btn-outline-secondary dropdown-toggle d-flex align-items-center gap-1 py-1 px-2" type="button" data-bs-toggle="dropdown" aria-expanded="false" id="userMenuBtn">
            <i class="bi ${user.role === 'owner' ? 'bi-buildings text-teal' : 'bi-mortarboard-fill text-teal'}" style="color: var(--stayvia-teal);"></i>
            <span class="fw-semibold">${escapeHtml(user.name)}</span>
            <span class="badge ${user.role === 'owner' ? 'bg-primary' : 'bg-secondary'} ms-1 small" style="font-size: 0.65rem;">${user.role === 'owner' ? 'Owner' : 'Student'}</span>
          </button>
          <ul class="dropdown-menu dropdown-menu-end shadow-sm">
            <li><span class="dropdown-header small">Signed in as <strong>${escapeHtml(user.role === 'owner' ? 'Hostel / PG Owner' : 'Student Scholar')}</strong></span></li>
            <li><span class="dropdown-item-text small text-muted">${escapeHtml(user.email || '')}</span></li>
            <li><hr class="dropdown-divider"></li>
            ${user.role === 'owner' ? `
              <li><a class="dropdown-item small text-primary fw-bold" href="/owner-dashboard"><i class="bi bi-speedometer2 me-2"></i>Owner Dashboard</a></li>
              <li><hr class="dropdown-divider"></li>
            ` : `
              <li><a class="dropdown-item small" href="/#accommodations"><i class="bi bi-search me-2"></i>Browse Accommodations</a></li>
              <li><hr class="dropdown-divider"></li>
            `}
            <li><a class="dropdown-item small text-danger" href="#" data-action="logout" onclick="logoutUser(); return false;"><i class="bi bi-box-arrow-right me-2"></i>Sign Out</a></li>
          </ul>
        </div>
      `;
    } else {
      authArea.innerHTML = `
        <a href="/login" class="btn btn-stayvia-outline btn-sm px-3" id="navLoginBtn">
          <i class="bi bi-box-arrow-in-right me-1"></i> Login
        </a>
        <a href="/signup" class="btn btn-stayvia-primary btn-sm px-3" id="navSignupBtn">
          Sign Up
        </a>
      `;
    }
  } catch (e) {
    console.error(e);
  }
}

// Global click event delegation for robust action handling
document.addEventListener('click', (e) => {
  const logoutBtn = e.target.closest('[data-action="logout"]');
  if (logoutBtn) {
    e.preventDefault();
    logoutUser();
  }
});

// Re-check authentication on page show (handles browser Back/Forward cache)
window.addEventListener('pageshow', () => {
  checkAuthSession();
});

function logoutUser() {
  if (window.StayviaAuth && window.StayviaAuth.signOut) {
    window.StayviaAuth.signOut();
  }
  try {
    localStorage.removeItem('stayvia_demo_user');
    sessionStorage.removeItem('stayvia_demo_user');
  } catch (e) {}
  checkAuthSession();

  // Redirect to homepage if logging out from a secondary route
  if (window.location.pathname !== '/' && window.location.pathname !== '/index.html') {
    window.location.href = '/';
  }
}

function openMessInquiryModal(id) {
  const service = (window.STAYVIA_SAMPLE_DATA.messServices || []).find(m => m.id === id);
  if (!service) return;

  const titleEl = document.getElementById('accModalTitle');
  const bodyEl = document.getElementById('accModalBody');
  if (!titleEl || !bodyEl) return;

  titleEl.textContent = `Inquire Mess: ${service.name}`;
  bodyEl.innerHTML = `
    <div class="text-center py-3">
      <div class="pillar-icon-box mx-auto mb-3">
        <i class="bi bi-egg-fried"></i>
      </div>
      <h4 class="h5 fw-bold mb-1">${escapeHtml(service.name)}</h4>
      <p class="text-secondary small mb-3">${escapeHtml(service.cuisine)} • Illustrative: Starting at ₹${service.monthlyStartingPrice}/month</p>
      
      <div class="alert alert-info text-start small mb-4">
        <i class="bi bi-info-circle me-1"></i> <strong>Mess Subscription Feature (Roadmap Phase 3):</strong> Mess discovery and digital meal subscriptions for MITS Gwalior are scheduled for future development.
      </div>
      
      <form onsubmit="event.preventDefault(); alert('Thank you! Your inquiry for ${escapeHtml(service.name)} has been recorded in demo mode.'); bootstrap.Modal.getInstance(document.getElementById('accommodationModal')).hide();">
        <div class="mb-3 text-start">
          <label class="form-label small fw-bold">Your MITS Hostel or PG Locality (Gwalior)</label>
          <input type="text" class="form-control" required placeholder="e.g. Near Gola Ka Mandir, Room 102">
        </div>
        <div class="mb-3 text-start">
          <label class="form-label small fw-bold">Phone Number</label>
          <input type="tel" class="form-control" required placeholder="e.g. 9876543210">
        </div>
        <button type="submit" class="btn btn-stayvia-primary w-100">Request Meal Trial (Demo)</button>
      </form>
    </div>
  `;

  const modal = new bootstrap.Modal(document.getElementById('accommodationModal'));
  modal.show();
}

function setupActionModals() {
  const ownerForm = document.getElementById('ownerLeadForm');
  if (ownerForm) {
    ownerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Thank you for listing interest! Your Gwalior property lead has been recorded in demo mode.');
      ownerForm.reset();
      const modal = bootstrap.Modal.getInstance(document.getElementById('listPropertyModal'));
      if (modal) modal.hide();
    });
  }

  const authForm = document.getElementById('authForm');
  if (authForm) {
    authForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Authentication with JWT and MySQL accounts will be activated in Phase 2.');
      const modal = bootstrap.Modal.getInstance(document.getElementById('authModal'));
      if (modal) modal.hide();
    });
  }
}

// Security utility to prevent XSS injection in dynamic HTML injection
function escapeHtml(str) {
  if (typeof str !== 'string') return str;
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
