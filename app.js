/**
 * Kothai Old Paper Mart - Interactive Application Logic
 * Modern, responsive, interactive features
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrapCalculator();
  initRateCardFilter();
  initBookingForm();
  initFaqAccordion();
  initStatsCounter();
  initBackToTop();
  initSmoothScroll();
});

/* ----------------------------------------------------
   1. NAVIGATION & MOBILE DRAWER
---------------------------------------------------- */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link, .drawer-link');
  const overlay = document.querySelector('.nav-overlay');

  // Sticky header shadow on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      toggleMobileMenu();
    });
  }

  if (overlay) {
    overlay.addEventListener('click', () => {
      closeMobileMenu();
    });
  }

  // Close menu when clicking link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMobileMenu();
    });
  });

  function toggleMobileMenu() {
    mobileToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    if (overlay) overlay.classList.toggle('active');
    document.body.classList.toggle('menu-open');
  }

  function closeMobileMenu() {
    mobileToggle.classList.remove('active');
    navMenu.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    document.body.classList.remove('menu-open');
  }
}

/* ----------------------------------------------------
   2. SCRAP VALUE CALCULATOR
---------------------------------------------------- */
// Indicative rates per unit / kg in INR
const SCRAP_PRICING = {
  newspaper: { name: 'Newspaper (Raddi)', rate: 15, unit: 'kg' },
  cardboard: { name: 'Cardboard / Carton Boxes', rate: 12, unit: 'kg' },
  books: { name: 'Books & Office White Paper', rate: 14, unit: 'kg' },
  copper: { name: 'Copper Scrap (Pure Wire/Pipes)', rate: 950, unit: 'kg' },
  brass: { name: 'Brass Scrap (Utensils/Fittings)', rate: 500, unit: 'kg' },
  aluminium: { name: 'Aluminium (Utensils/Sheets)', rate: 140, unit: 'kg' },
  iron: { name: 'Iron & Heavy Steel Scrap', rate: 35, unit: 'kg' },
  steel: { name: 'Stainless Steel (304/Utensils)', rate: 45, unit: 'kg' },
  battery: { name: 'Lead Acid / Inverter Battery', rate: 85, unit: 'kg' },
  ac_split: { name: 'Split AC (1.5 Ton Copper)', rate: 4500, unit: 'unit' },
  ac_window: { name: 'Window AC (Complete Unit)', rate: 3000, unit: 'unit' },
  fridge: { name: 'Old Refrigerator', rate: 1300, unit: 'unit' },
  washing_machine: { name: 'Washing Machine', rate: 1000, unit: 'unit' },
  plastic: { name: 'Rigid & PET Plastic', rate: 12, unit: 'kg' },
  pc_laptop: { name: 'Old Laptops / Desktop PCs', rate: 700, unit: 'unit' }
};

function initScrapCalculator() {
  const itemSelect = document.getElementById('calc-item');
  const weightInput = document.getElementById('calc-weight');
  const weightSlider = document.getElementById('calc-slider');
  const unitLabel = document.getElementById('calc-unit-label');
  const rateLabel = document.getElementById('calc-rate-label');
  const totalAmount = document.getElementById('calc-total');
  const calcBookBtn = document.getElementById('calc-book-btn');

  if (!itemSelect || !weightInput || !totalAmount) return;

  function updateCalculation() {
    const selectedKey = itemSelect.value;
    const itemData = SCRAP_PRICING[selectedKey] || SCRAP_PRICING.newspaper;
    let qty = parseFloat(weightInput.value) || 0;

    if (qty < 1) qty = 1;

    const isPerUnit = itemData.unit === 'unit';
    if (unitLabel) unitLabel.textContent = isPerUnit ? 'Units (Pieces)' : 'Kilograms (Kg)';
    if (rateLabel) rateLabel.textContent = `₹${itemData.rate.toLocaleString('en-IN')} / ${itemData.unit}`;

    // Adjust slider range based on type
    if (weightSlider) {
      if (isPerUnit) {
        weightSlider.min = 1;
        weightSlider.max = 20;
        weightSlider.step = 1;
        if (qty > 20) qty = 20;
      } else {
        weightSlider.min = 5;
        weightSlider.max = 500;
        weightSlider.step = 5;
      }
      weightSlider.value = qty;
    }

    const estimatedTotal = qty * itemData.rate;
    totalAmount.textContent = `₹${Math.round(estimatedTotal).toLocaleString('en-IN')}`;

    if (calcBookBtn) {
      calcBookBtn.dataset.item = itemData.name;
      calcBookBtn.dataset.qty = `${qty} ${itemData.unit}`;
      calcBookBtn.dataset.estimate = `₹${Math.round(estimatedTotal).toLocaleString('en-IN')}`;
    }
  }

  itemSelect.addEventListener('change', () => {
    const selectedKey = itemSelect.value;
    const itemData = SCRAP_PRICING[selectedKey];
    if (itemData.unit === 'unit' && parseFloat(weightInput.value) > 20) {
      weightInput.value = 1;
    }
    updateCalculation();
  });

  weightInput.addEventListener('input', () => {
    if (weightSlider) weightSlider.value = weightInput.value;
    updateCalculation();
  });

  if (weightSlider) {
    weightSlider.addEventListener('input', () => {
      weightInput.value = weightSlider.value;
      updateCalculation();
    });
  }

  // Pre-fill booking form from calculator
  if (calcBookBtn) {
    calcBookBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const itemName = calcBookBtn.dataset.item;
      const itemQty = calcBookBtn.dataset.qty;
      const estTotal = calcBookBtn.dataset.estimate;

      // Scroll to booking form
      const bookingSection = document.getElementById('book-pickup');
      if (bookingSection) {
        bookingSection.scrollIntoView({ behavior: 'smooth' });

        // Fill note
        const noteInput = document.getElementById('book-notes');
        if (noteInput) {
          noteInput.value = `Estimated Scrap: ${itemName} (${itemQty}) ~ Est. Payout: ${estTotal}`;
        }

        // Highlight form
        const formCard = document.querySelector('.booking-card');
        if (formCard) {
          formCard.classList.add('highlight-pulse');
          setTimeout(() => formCard.classList.remove('highlight-pulse'), 1500);
        }
      }
    });
  }

  // Initial calculation
  updateCalculation();
}

/* ----------------------------------------------------
   3. RATE CARD FILTER & SEARCH
---------------------------------------------------- */
function initRateCardFilter() {
  const filterBtns = document.querySelectorAll('.rate-tab-btn');
  const rateCards = document.querySelectorAll('.rate-card');
  const searchInput = document.getElementById('rate-search-input');

  if (!rateCards.length) return;

  function filterItems() {
    const activeTab = document.querySelector('.rate-tab-btn.active');
    const category = activeTab ? activeTab.dataset.category : 'all';
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

    let visibleCount = 0;

    rateCards.forEach(card => {
      const cardCategory = card.dataset.category;
      const cardTitle = card.querySelector('.rate-title')?.textContent.toLowerCase() || '';
      const cardDesc = card.querySelector('.rate-desc')?.textContent.toLowerCase() || '';

      const matchesCategory = (category === 'all' || cardCategory === category);
      const matchesSearch = (!query || cardTitle.includes(query) || cardDesc.includes(query));

      if (matchesCategory && matchesSearch) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    const noResults = document.getElementById('rate-no-results');
    if (noResults) {
      noResults.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterItems();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', filterItems);
  }

  // Quick "Sell This" buttons on rate cards
  const sellButtons = document.querySelectorAll('.rate-sell-btn');
  sellButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const itemName = btn.dataset.item;
      const itemRate = btn.dataset.rate;

      const bookingSection = document.getElementById('book-pickup');
      if (bookingSection) {
        bookingSection.scrollIntoView({ behavior: 'smooth' });

        const noteInput = document.getElementById('book-notes');
        if (noteInput) {
          noteInput.value = `Interested in selling: ${itemName} (${itemRate})`;
        }

        const formCard = document.querySelector('.booking-card');
        if (formCard) {
          formCard.classList.add('highlight-pulse');
          setTimeout(() => formCard.classList.remove('highlight-pulse'), 1500);
        }
      }
    });
  });
}

/* ----------------------------------------------------
   4. SCHEDULE PICKUP BOOKING FORM (Online & WhatsApp)
---------------------------------------------------- */
function initBookingForm() {
  const bookingForm = document.getElementById('pickup-form');
  const whatsappBookBtn = document.getElementById('book-whatsapp-btn');
  const modal = document.getElementById('booking-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');

  if (!bookingForm) return;

  function getFormData() {
    const name = document.getElementById('book-name')?.value.trim() || '';
    const phone = document.getElementById('book-phone')?.value.trim() || '';
    const locality = document.getElementById('book-locality')?.value.trim() || '';
    const address = document.getElementById('book-address')?.value.trim() || '';
    const date = document.getElementById('book-date')?.value || 'Earliest Available';
    const slot = document.getElementById('book-slot')?.value || 'Flexible';
    const weight = document.getElementById('book-weight')?.value || 'Not specified';
    const notes = document.getElementById('book-notes')?.value.trim() || 'None';

    // Collect checked categories
    const categories = [];
    document.querySelectorAll('input[name="scrap_cat"]:checked').forEach(cb => {
      categories.push(cb.value);
    });

    return {
      name,
      phone,
      locality,
      address,
      date,
      slot,
      weight,
      categories: categories.length ? categories.join(', ') : 'Mixed Scrap',
      notes
    };
  }

  // Form submit -> Shows confirmation modal
  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = getFormData();

    if (!data.name || !data.phone || !data.address) {
      alert('Please fill in your Name, Phone Number, and Address.');
      return;
    }

    // Populate modal
    const summaryElem = document.getElementById('modal-summary');
    if (summaryElem) {
      summaryElem.innerHTML = `
        <div class="summary-item"><strong>Customer:</strong> ${escapeHtml(data.name)}</div>
        <div class="summary-item"><strong>Contact:</strong> ${escapeHtml(data.phone)}</div>
        <div class="summary-item"><strong>Address:</strong> ${escapeHtml(data.address)}, ${escapeHtml(data.locality)}</div>
        <div class="summary-item"><strong>Scrap Type:</strong> ${escapeHtml(data.categories)}</div>
        <div class="summary-item"><strong>Weight Bracket:</strong> ${escapeHtml(data.weight)}</div>
        <div class="summary-item"><strong>Scheduled Slot:</strong> ${escapeHtml(data.date)} (${escapeHtml(data.slot)})</div>
      `;
    }

    // WhatsApp confirm button in modal
    const modalWaBtn = document.getElementById('modal-wa-btn');
    if (modalWaBtn) {
      modalWaBtn.href = generateWhatsAppLink(data);
    }

    if (modal) {
      modal.classList.add('active');
    }
  });

  // Direct WhatsApp Book button
  if (whatsappBookBtn) {
    whatsappBookBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const data = getFormData();
      if (!data.name || !data.phone) {
        alert('Please provide your name and phone number so we can confirm your pickup on WhatsApp.');
        document.getElementById('book-name')?.focus();
        return;
      }
      const waUrl = generateWhatsAppLink(data);
      window.open(waUrl, '_blank');
    });
  }

  // Close modal
  if (modalCloseBtn && modal) {
    modalCloseBtn.addEventListener('click', () => {
      modal.classList.remove('active');
      bookingForm.reset();
    });
  }

  // Close modal on background click
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
        bookingForm.reset();
      }
    });
  }

  function generateWhatsAppLink(data) {
    const text = 
`*Kothai Old Paper Mart - Doorstep Pickup Request*
---------------------------------------
👤 *Name:* ${data.name}
📞 *Phone:* ${data.phone}
📍 *Address:* ${data.address}, ${data.locality}
📦 *Scrap Items:* ${data.categories}
⚖️ *Est. Weight:* ${data.weight}
📅 *Preferred Slot:* ${data.date} (${data.slot})
📝 *Notes:* ${data.notes}
---------------------------------------
Please confirm the pickup executive schedule. Thank you!`;

    return `https://wa.me/919448861176?text=${encodeURIComponent(text)}`;
  }

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
}

/* ----------------------------------------------------
   5. ACCORDION FAQ
---------------------------------------------------- */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (!question) return;

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      // Close other open faqs
      faqItems.forEach(other => {
        if (other !== item) other.classList.remove('active');
      });

      if (!isOpen) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  });
}

/* ----------------------------------------------------
   6. ANIMATED STATS COUNTER
---------------------------------------------------- */
function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  if (!statNumbers.length) return;

  let hasAnimated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        animateCounters();
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.querySelector('.stats-banner') || statNumbers[0].closest('section');
  if (statsSection) {
    observer.observe(statsSection);
  }

  function animateCounters() {
    statNumbers.forEach(stat => {
      const target = parseInt(stat.dataset.target, 10);
      const prefix = stat.dataset.prefix || '';
      const suffix = stat.dataset.suffix || '';
      const duration = 1800;
      const stepTime = 20;
      const totalSteps = duration / stepTime;
      const increment = target / totalSteps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          stat.textContent = `${prefix}${target.toLocaleString('en-IN')}${suffix}`;
          clearInterval(timer);
        } else {
          stat.textContent = `${prefix}${Math.floor(current).toLocaleString('en-IN')}${suffix}`;
        }
      }, stepTime);
    });
  }
}

/* ----------------------------------------------------
   7. BACK TO TOP & FLOATING ACTIONS
---------------------------------------------------- */
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ----------------------------------------------------
   8. SMOOTH SCROLLING FOR ALL ANCHOR LINKS
---------------------------------------------------- */
function initSmoothScroll() {
  const catPills = document.querySelectorAll('.cat-nav-pill');

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const targetElem = document.querySelector(targetId);
      if (targetElem) {
        e.preventDefault();

        // Update active class if it's a category pill
        if (this.classList.contains('cat-nav-pill')) {
          catPills.forEach(p => p.classList.remove('active'));
          this.classList.add('active');
        }

        const floatingBar = document.querySelector('.floating-top-bar');
        const catBar = document.querySelector('.category-nav-section');
        const offset = (floatingBar?.offsetHeight || 70) + (catBar?.offsetHeight || 55) + 10;
        const targetPos = targetElem.getBoundingClientRect().top + window.pageYOffset - offset;

        window.scrollTo({
          top: targetPos,
          behavior: 'smooth'
        });
      }
    });
  });
}
