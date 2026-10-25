/**
 * Stayvia Sample Accommodation & Mess Demonstration Data
 * Tailored for students searching near Madhav Institute of Technology and Science (MITS), Gwalior
 * 
 * NOTE FOR DEVELOPERS & USERS:
 * - All properties, prices, and mess services in this file are DEMONSTRATION CONTENT ONLY.
 * - Illustrated prices represent sample values for interface preview, not confirmed market rates.
 * - No listings claim actual availability, official affiliation with MITS Gwalior, or physical verification.
 * - This structure is modular and designed to support additional campuses and cities in future phases.
 */

window.STAYVIA_SAMPLE_DATA = {
  // Active campus focus configuration (modular for future multi-campus expansion)
  activeCampus: {
    name: "Madhav Institute of Technology and Science (MITS)",
    shortName: "MITS Gwalior",
    city: "Gwalior",
    state: "Madhya Pradesh",
    locality: "Gola Ka Mandir",
    pincode: "474005",
    description: "Premier autonomous engineering institute located in Gola Ka Mandir, Gwalior."
  },

  // Available Gwalior student localities (for filter dropdowns)
  localities: [
    { id: "all", name: "All Localities in Gwalior" },
    { id: "Gola Ka Mandir", name: "Gola Ka Mandir (MITS Campus Area)" },
    { id: "Anand Nagar", name: "Anand Nagar" },
    { id: "Thatipur", name: "Thatipur" },
    { id: "Morar", name: "Morar" },
    { id: "City Center", name: "City Center" }
  ],

  // Demonstration Accommodation Listings
  accommodations: [
    {
      id: 1,
      name: "Sample Mandir View Student PG (Demo)",
      type: "PG",
      gender: "Boys",
      city: "Gwalior",
      state: "Madhya Pradesh",
      locality: "Gola Ka Mandir",
      campusReference: "MITS Gwalior",
      localityNote: "Located in Gola Ka Mandir (MITS Campus Area)",
      monthlyRent: 5500,
      deposit: 5500,
      depositNote: "Illustrative 1 Month Deposit (Demo)",
      electricityExtra: false,
      image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80",
      alt: "Demonstration image of clean student room with desk",
      occupancy: "Double & Triple Sharing",
      facilities: ["High-speed Wi-Fi", "Homestyle Food (2 Meals)", "Power Backup", "RO Water", "Study Desk", "CCTV Security"],
      rating: 4.5,
      reviewsCount: 18,
      isDemo: true,
      description: "Demonstration listing illustrating a boys PG residence in Gola Ka Mandir. Illustrative layout with study desk, shared room accommodations, and home-style meal plans for students attending MITS.",
      rules: [
        "Demonstration guideline: Standard student gate timings",
        "Demonstration guideline: College ID verification at move-in",
        "Demonstration guideline: Quiet hours during examination periods"
      ]
    },
    {
      id: 2,
      name: "Sample Anand Vihar Girls Residency (Demo)",
      type: "Hostel",
      gender: "Girls",
      city: "Gwalior",
      state: "Madhya Pradesh",
      locality: "Anand Nagar",
      campusReference: "MITS Gwalior",
      localityNote: "Located in Anand Nagar, Gwalior",
      monthlyRent: 6800,
      deposit: 6800,
      depositNote: "Illustrative 1 Month Deposit (Demo)",
      electricityExtra: true,
      image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80",
      alt: "Demonstration image of women student residency room",
      occupancy: "Single & Double Sharing",
      facilities: ["High-speed Wi-Fi", "3 Meals Daily", "Air Cooler / AC Option", "Power Backup", "Biometric Entry", "Laundromat Access"],
      rating: 4.7,
      reviewsCount: 22,
      isDemo: true,
      description: "Demonstration listing depicting a secure female student residence in Anand Nagar, featuring full meal plans, power backup for summer study, and biometric gate access.",
      rules: [
        "Demonstration guideline: Biometric check-in policy",
        "Demonstration guideline: Advance parent intimation for leaves",
        "Demonstration guideline: Visitors permitted in common visitor area only"
      ]
    },
    {
      id: 3,
      name: "Sample Thatipur Scholar Apartments (Demo)",
      type: "Flat",
      gender: "Co-ed (Shared Flats)",
      city: "Gwalior",
      state: "Madhya Pradesh",
      locality: "Thatipur",
      campusReference: "MITS Gwalior",
      localityNote: "Located in Thatipur, Gwalior",
      monthlyRent: 4800,
      deposit: 9600,
      depositNote: "Illustrative 2 Months Deposit (Demo)",
      electricityExtra: true,
      image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
      alt: "Demonstration image of shared student apartment living space",
      occupancy: "Shared 2BHK Flat (Double Occupancy per Room)",
      facilities: ["High-speed Wi-Fi", "Equipped Kitchen", "Washing Machine", "Power Backup", "Attached Balcony", "Parking Space"],
      rating: 4.4,
      reviewsCount: 15,
      isDemo: true,
      description: "Demonstration listing for independent shared apartment living in Thatipur. Suitable for senior engineering scholars who prefer self-cooking and an independent study environment.",
      rules: [
        "Demonstration guideline: Society bylaws regarding noise levels",
        "Demonstration guideline: Equal utility bill sharing among flatmates",
        "Demonstration guideline: Visitor hours respect roommate privacy"
      ]
    },
    {
      id: 4,
      name: "Sample Campus Edge Hostel (Demo)",
      type: "Hostel",
      gender: "Boys",
      city: "Gwalior",
      state: "Madhya Pradesh",
      locality: "Gola Ka Mandir",
      campusReference: "MITS Gwalior",
      localityNote: "Located in Gola Ka Mandir (MITS Campus Area)",
      monthlyRent: 7200,
      deposit: 7200,
      depositNote: "Illustrative 1 Month Deposit (Demo)",
      electricityExtra: false,
      image: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80",
      alt: "Demonstration image of boys hostel with beds and lockers",
      occupancy: "Single & Double Sharing",
      facilities: ["High-speed Wi-Fi", "3 Meals Daily", "Air Conditioned", "Power Backup", "Attached Bathroom", "Study Hall"],
      rating: 4.6,
      reviewsCount: 26,
      isDemo: true,
      description: "Demonstration listing illustrating a full-service student hostel in the Gola Ka Mandir hub, featuring air-conditioned rooms, scheduled mess services, and a dedicated late-night study room.",
      rules: [
        "Demonstration guideline: Fixed mess timings for breakfast and dinner",
        "Demonstration guideline: Eco-friendly energy conservation policy",
        "Demonstration guideline: Gate closes at 10:00 PM on weekdays"
      ]
    },
    {
      id: 5,
      name: "Sample Morar Greens PG (Demo)",
      type: "PG",
      gender: "Boys",
      city: "Gwalior",
      state: "Madhya Pradesh",
      locality: "Morar",
      campusReference: "MITS Gwalior",
      localityNote: "Located in Morar, Gwalior",
      monthlyRent: 4200,
      deposit: 4200,
      depositNote: "Illustrative 1 Month Deposit (Demo)",
      electricityExtra: false,
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80",
      alt: "Demonstration image of budget student room with natural light",
      occupancy: "Double & Triple Sharing",
      facilities: ["High-speed Wi-Fi", "Homestyle Food (2 Meals)", "RO Water", "Power Backup", "Hot Water Geyser"],
      rating: 4.3,
      reviewsCount: 12,
      isDemo: true,
      description: "Budget-conscious demonstration PG listing in Morar, representing an affordable student stay option within transit distance of Gola Ka Mandir and MITS.",
      rules: [
        "Demonstration guideline: Mess attendance for dinner count",
        "Demonstration guideline: Respectful shared room cleanliness",
        "Demonstration guideline: No unauthorized electrical heating appliances"
      ]
    },
    {
      id: 6,
      name: "Sample City Center Student Suites (Demo)",
      type: "Flat",
      gender: "Co-ed (Private Rooms in Flat)",
      city: "Gwalior",
      state: "Madhya Pradesh",
      locality: "City Center",
      campusReference: "MITS Gwalior",
      localityNote: "Located in City Center, Gwalior",
      monthlyRent: 8500,
      deposit: 17000,
      depositNote: "Illustrative 2 Months Deposit (Demo)",
      electricityExtra: true,
      image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
      alt: "Demonstration image of modern apartment private bedroom",
      occupancy: "Private Bedroom in Shared 3BHK",
      facilities: ["High-speed Wi-Fi", "Air Conditioned", "Equipped Kitchen", "Power Backup", "Daily Housekeeping", "Lift & Security"],
      rating: 4.8,
      reviewsCount: 19,
      isDemo: true,
      description: "Demonstration premium flat accommodation in Gwalior's City Center commercial district. Designed for scholars seeking private room comfort with shared high-end amenities.",
      rules: [
        "Demonstration guideline: Society parking regulations",
        "Demonstration guideline: Strict noise curfews past 11 PM",
        "Demonstration guideline: Maintain common kitchen sanitation"
      ]
    }
  ],

  // Demonstration Mess & Tiffin Services (Local to Gwalior)
  messServices: [
    {
      id: 1,
      name: "Sample Gwalior Tiffin & Homestyle Mess (Demo)",
      cuisine: "North Indian / MP Thali Meals",
      dietType: "Pure Vegetarian",
      coverage: "Gola Ka Mandir, Anand Nagar & MITS area",
      monthlyStartingPrice: 2800,
      deliveryOption: "Student Hostel / PG Doorstep Delivery",
      trialAvailable: true,
      rating: 4.7,
      reviewsCount: 34,
      highlights: [
        "Freshly made 4 Phulkas with seasonal vegetable subzi",
        "Dal Tadka, Steamed Rice, Papad & Salad",
        "Hygienic stainless steel tiffin packing",
        "Flexible lunch and dinner delivery slots"
      ]
    },
    {
      id: 2,
      name: "Sample Chambal Flavors Student Kitchen (Demo)",
      cuisine: "MP Homestyle (Veg & Non-Veg Days)",
      dietType: "Veg & Non-Veg (Wed & Sun)",
      coverage: "Thatipur, Morar & Gola Ka Mandir",
      monthlyStartingPrice: 3200,
      deliveryOption: "Doorstep Delivery & Dine-In Takeaway",
      trialAvailable: true,
      rating: 4.6,
      reviewsCount: 28,
      highlights: [
        "Traditional regional preparation with light spices",
        "Dedicated vegetarian kitchen preparation space",
        "Special weekend chicken curry or paneer special",
        "Weekly menu rotation based on student votes"
      ]
    },
    {
      id: 3,
      name: "Sample Shanti Student Dabba Service (Demo)",
      cuisine: "Pure Veg Budget Daily Thali",
      dietType: "Pure Vegetarian",
      coverage: "Gola Ka Mandir, Pinto Park & Anand Nagar",
      monthlyStartingPrice: 2500,
      deliveryOption: "Direct Room Delivery Twice Daily",
      trialAvailable: true,
      rating: 4.5,
      reviewsCount: 20,
      highlights: [
        "Affordable daily meal plans for engineering students",
        "Low oil and digestive spices for daily nourishment",
        "Weekend sweet dish / dessert included",
        "Easy pause/resume service for exam holidays"
      ]
    }
  ],

  // Curated demonstration photo presets for owners to select easily
  photoPresets: [
    { label: "Modern Student Room (PG)", url: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80" },
    { label: "Airy Double Bed PG", url: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80" },
    { label: "Cozy Women's Residency", url: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80" },
    { label: "Spacious Student Apartment", url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80" },
    { label: "Budget Study Hostel", url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80" },
    { label: "Executive Private Flat Room", url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80" }
  ],

  // Value Pillars Tailored for Student Needs
  trustPillars: [
    {
      icon: "bi-geo-alt-fill",
      title: "MITS Gwalior Locality Focus",
      description: "Discover accommodation options clustered around Gola Ka Mandir, Anand Nagar, Thatipur, and Morar with transparent locality information."
    },
    {
      icon: "bi-building-check",
      title: "Compare Hostels, PGs & Flats",
      description: "Filter single, double, and triple sharing rooms with illustrative monthly rent, deposit guidelines, and electricity billing policies."
    },
    {
      icon: "bi-shield-check",
      title: "Review Facilities Upfront",
      description: "Check for Wi-Fi, air cooling/AC, power backup for hot summers, meal inclusion, and gate timings before scheduling any visit."
    },
    {
      icon: "bi-egg-fried",
      title: "Campus Mess & Tiffin Services",
      description: "Explore local homestyle tiffin providers delivering healthy daily vegetarian and non-vegetarian meals near MITS Gwalior."
    }
  ]
};

/**
 * ==============================================================================
 * Stayvia Client-Side Authentication Manager (Demonstration Mode)
 * Provides unified cross-page demo session handling via localStorage & sessionStorage
 * ==============================================================================
 */
window.StayviaAuth = {
  STORAGE_KEY: 'stayvia_demo_user',

  // Get current user session from localStorage
  getUser() {
    try {
      if (typeof localStorage === 'undefined') return null;
      const key = (this && this.STORAGE_KEY) || 'stayvia_demo_user';
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      const user = JSON.parse(raw);
      if (user && (user.name || user.email)) {
        return user;
      }
      return null;
    } catch (e) {
      console.warn('[StayviaAuth] Error parsing demo user session', e);
      return null;
    }
  },

  // Store user session consistently in both localStorage and sessionStorage
  setUser(userData) {
    try {
      const key = (this && this.STORAGE_KEY) || 'stayvia_demo_user';
      const dataStr = JSON.stringify(userData);
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(key, dataStr);
      }
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem(key, dataStr);
      }
    } catch (e) {
      console.error('[StayviaAuth] Error saving demo user session', e);
    }
  },

  // Clear demo session completely without touching property listings or inquiries
  signOut() {
    try {
      const key = (this && this.STORAGE_KEY) || 'stayvia_demo_user';
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(key);
        localStorage.removeItem('stayvia_demo_user');
      }
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.removeItem(key);
        sessionStorage.removeItem('stayvia_demo_user');
      }
    } catch (e) {
      console.error('[StayviaAuth] Error clearing session', e);
    }
  },

  isOwner() {
    const user = this.getUser();
    return user !== null && user.role === 'owner';
  },

  isStudent() {
    const user = this.getUser();
    return user !== null && user.role !== 'owner';
  },

  isLoggedIn() {
    return this.getUser() !== null;
  }
};

/**
 * ==============================================================================
 * Stayvia Client-Side Storage Manager (Demonstration Mode)
 * Uses browser localStorage to safely persist owner-created listings & edits
 * ==============================================================================
 */
window.StayviaStorage = {
  STORAGE_KEY_LISTINGS: 'stayvia_owner_listings',
  STORAGE_KEY_INQUIRIES: 'stayvia_demo_inquiries',

  photoPresets: [
    { label: "Modern PG Room", url: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80" },
    { label: "Twin Sharing Hostel", url: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80" },
    { label: "Women's PG Suite", url: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80" },
    { label: "Student Flat Layout", url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80" },
    { label: "Single Room Study", url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80" }
  ],

  // Get only owner-created listings from localStorage
  getOwnerListings() {
    try {
      if (typeof localStorage === 'undefined') return [];
      const raw = localStorage.getItem(this.STORAGE_KEY_LISTINGS);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.warn('[StayviaStorage] Could not read owner listings from localStorage', e);
      return [];
    }
  },

  // Save owner-created listings to localStorage
  saveOwnerListings(listings) {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(this.STORAGE_KEY_LISTINGS, JSON.stringify(listings));
      }
    } catch (e) {
      console.error('[StayviaStorage] Could not save owner listings to localStorage', e);
    }
  },

  // Return all accommodations merged: Owner-created + default sample accommodations
  getAllAccommodations() {
    const defaults = (window.STAYVIA_SAMPLE_DATA && window.STAYVIA_SAMPLE_DATA.accommodations) || [];
    const ownerListings = this.getOwnerListings();

    if (!ownerListings || ownerListings.length === 0) {
      return defaults;
    }

    // Merge: Owner-created listings appear at the top
    const defaultMap = new Map(defaults.map(item => [Number(item.id), { ...item }]));
    const customListings = [];

    ownerListings.forEach(item => {
      const numId = Number(item.id);
      if (defaultMap.has(numId)) {
        defaultMap.set(numId, item); // Overridden default listing
      } else {
        customListings.push(item); // Brand new owner listing
      }
    });

    return [...customListings, ...defaultMap.values()];
  },

  // Fetch single accommodation by ID from merged catalog
  getAccommodationById(id) {
    const numId = parseInt(id, 10);
    if (isNaN(numId)) return null;
    const all = this.getAllAccommodations();
    return all.find(item => Number(item.id) === numId) || null;
  },

  // Add new owner listing with strict duplicate detection and robust field defaults
  addOwnerListing(listingData) {
    const listings = this.getOwnerListings();
    
    const cleanName = (listingData.name || '').trim();
    const cleanLocality = (listingData.locality || '').trim();

    if (!cleanName) {
      const err = new Error('Property listing title is required.');
      err.code = 'VALIDATION_ERROR';
      throw err;
    }

    // Check for duplicate listing (exact name and locality)
    const isDuplicate = listings.some(l => 
      l.name.trim().toLowerCase() === cleanName.toLowerCase() &&
      l.locality.trim().toLowerCase() === cleanLocality.toLowerCase()
    );
    if (isDuplicate) {
      const err = new Error(`A listing titled "${cleanName}" in "${cleanLocality}" already exists in your properties.`);
      err.code = 'DUPLICATE_LISTING';
      throw err;
    }

    // Generate a unique ID starting from 101 to avoid colliding with default sample IDs (1-6)
    const existingIds = listings.map(l => Number(l.id));
    const defaultIds = [1, 2, 3, 4, 5, 6];
    let nextId = 101;
    while (existingIds.includes(nextId) || defaultIds.includes(nextId)) {
      nextId++;
    }

    const cleanData = { ...listingData };
    delete cleanData.id;

    const rentNum = Number(cleanData.monthlyRent) || 5000;
    const roomsNum = Number(cleanData.availableRooms) || 1;

    const newListing = {
      isOwnerListing: true,
      ownerName: cleanData.ownerName || cleanData.contactName || 'Rajesh Sharma',
      contactPhone: cleanData.contactPhone || '9826012345',
      status: cleanData.status || 'available', // 'available' or 'occupied'
      rating: 4.8,
      reviewsCount: 0,
      city: 'Gwalior',
      state: 'Madhya Pradesh',
      campusReference: 'MITS Gwalior',
      createdAt: new Date().toISOString(),
      ...cleanData,
      id: nextId,
      name: cleanName,
      type: cleanData.type || 'PG',
      locality: cleanLocality || 'Gola Ka Mandir',
      address: cleanData.address || `${cleanLocality || 'Gola Ka Mandir'}, Gwalior, MP`,
      monthlyRent: rentNum,
      deposit: rentNum,
      depositNote: cleanData.depositNote || '1 Month Security Deposit (Refundable)',
      gender: cleanData.gender || 'Boys',
      occupancy: cleanData.occupancy || 'Double Sharing',
      availableRooms: roomsNum,
      facilities: Array.isArray(cleanData.facilities) && cleanData.facilities.length > 0
        ? cleanData.facilities
        : ["High-speed Wi-Fi", "Power Backup", "RO Water"],
      description: cleanData.description || `Modern student ${cleanData.type || 'PG'} accommodation located in ${cleanLocality || 'Gola Ka Mandir'}, convenient for scholars attending MITS Gwalior.`,
      rules: Array.isArray(cleanData.rules) && cleanData.rules.length > 0
        ? cleanData.rules
        : ["Standard 10 PM student curfew applies", "College ID required at check-in", "Quiet study hours during exams"],
      localityNote: cleanData.localityNote || `Located in ${cleanLocality || 'Gola Ka Mandir'} (Near MITS Gwalior)`,
      image: cleanData.image || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80',
      alt: cleanData.alt || `${cleanName} student residence near MITS Gwalior`
    };

    listings.unshift(newListing);
    this.saveOwnerListings(listings);
    return newListing;
  },

  // Update existing owner listing
  updateOwnerListing(id, updatedFields) {
    const numId = parseInt(id, 10);
    const listings = this.getOwnerListings();
    const index = listings.findIndex(l => Number(l.id) === numId);

    const cleanFields = { ...updatedFields };
    delete cleanFields.id;
    if (cleanFields.monthlyRent !== undefined) cleanFields.monthlyRent = Number(cleanFields.monthlyRent) || 0;
    if (cleanFields.availableRooms !== undefined) cleanFields.availableRooms = Number(cleanFields.availableRooms) || 1;

    if (index !== -1) {
      listings[index] = {
        ...listings[index],
        ...cleanFields,
        id: numId,
        updatedAt: new Date().toISOString()
      };
      this.saveOwnerListings(listings);
      return listings[index];
    } else {
      // If editing an existing default listing (1-6), save a customized copy in owner listings
      const defaults = (window.STAYVIA_SAMPLE_DATA && window.STAYVIA_SAMPLE_DATA.accommodations) || [];
      const original = defaults.find(d => Number(d.id) === numId);
      if (original) {
        const customCopy = {
          ...original,
          isOwnerListing: true,
          ...cleanFields,
          id: numId,
          updatedAt: new Date().toISOString()
        };
        listings.unshift(customCopy);
        this.saveOwnerListings(listings);
        return customCopy;
      }
    }
    return null;
  },

  // Toggle availability (available <-> occupied)
  toggleAvailability(id) {
    const numId = parseInt(id, 10);
    const item = this.getAccommodationById(numId);
    if (!item) return null;

    const newStatus = (item.status === 'occupied') ? 'available' : 'occupied';
    return this.updateOwnerListing(numId, { status: newStatus });
  },

  // Delete owner listing
  deleteOwnerListing(id) {
    const numId = parseInt(id, 10);
    let listings = this.getOwnerListings();
    const initialLen = listings.length;
    listings = listings.filter(l => Number(l.id) !== numId);
    this.saveOwnerListings(listings);
    return listings.length < initialLen;
  },

  // Inquiry / Walkthrough Request Management
  getInquiries() {
    try {
      if (typeof localStorage === 'undefined') return [];
      const raw = localStorage.getItem(this.STORAGE_KEY_INQUIRIES);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  },

  saveInquiry(inquiry) {
    try {
      const list = this.getInquiries();
      const newInquiry = {
        id: `INQ-${Date.now()}`,
        referenceNumber: inquiry.referenceNumber || `STAY-GWL-${Math.floor(10000 + Math.random() * 90000)}`,
        timestamp: new Date().toISOString(),
        status: 'pending',
        ...inquiry
      };
      list.unshift(newInquiry);
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(this.STORAGE_KEY_INQUIRIES, JSON.stringify(list));
      }
      return newInquiry;
    } catch (e) {
      console.error(e);
      return null;
    }
  }
};
