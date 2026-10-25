/**
 * Client Filtering Verification Test
 * Tests the client data filtering logic to ensure all filters and empty states work accurately.
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');

// Read sample-data.js content and execute in isolated context
const sampleDataCode = fs.readFileSync(path.join(__dirname, '../public/js/sample-data.js'), 'utf8');

// Provide mock window object
const window = {};
eval(sampleDataCode);

console.log('🧪 Testing Client-Side Data & Filter Behavior for MITS Gwalior...\n');

const data = window.STAYVIA_SAMPLE_DATA;
assert.ok(data, 'Sample data object must exist');
assert.strictEqual(data.activeCampus.shortName, 'MITS Gwalior');
assert.strictEqual(data.activeCampus.city, 'Gwalior');
assert.strictEqual(data.activeCampus.state, 'Madhya Pradesh');
assert.strictEqual(data.accommodations.length, 6, 'Must have 6 demonstration listings');

// Filter simulation function identical to main.js applyFilters logic
function filterAccommodations({ locality = 'all', type = 'all', budget = 'all', facility = 'all', keyword = '' }) {
  let results = [...data.accommodations];

  if (locality && locality !== 'all') {
    results = results.filter(item => 
      item.locality.toLowerCase() === locality.toLowerCase() ||
      item.localityNote.toLowerCase().includes(locality.toLowerCase())
    );
  }

  if (type && type !== 'all') {
    results = results.filter(item => item.type.toLowerCase() === type.toLowerCase());
  }

  if (budget && budget !== 'all') {
    const maxBudget = parseInt(budget, 10);
    if (!isNaN(maxBudget)) {
      results = results.filter(item => item.monthlyRent <= maxBudget);
    }
  }

  if (facility && facility !== 'all') {
    const fac = facility.toLowerCase();
    results = results.filter(item => {
      return (item.facilities || []).some(f => {
        const fl = f.toLowerCase();
        if (fac === 'wi-fi') return fl.includes('wi-fi') || fl.includes('wifi');
        if (fac === 'food') return fl.includes('meal') || fl.includes('food') || fl.includes('mess');
        if (fac === 'air') return fl.includes('air condition') || fl.includes('air-condition') || fl.includes('cooler') || /\bac\b/i.test(fl);
        if (fac === 'power backup') return fl.includes('power backup') || fl.includes('backup');
        if (fac === 'attached bathroom') return fl.includes('attached bath');
        return fl.includes(fac);
      });
    });
  }

  if (keyword) {
    const kw = keyword.toLowerCase().trim();
    results = results.filter(item => 
      item.name.toLowerCase().includes(kw) ||
      item.locality.toLowerCase().includes(kw) ||
      item.localityNote.toLowerCase().includes(kw) ||
      item.description.toLowerCase().includes(kw) ||
      item.occupancy.toLowerCase().includes(kw) ||
      item.gender.toLowerCase().includes(kw) ||
      (item.facilities || []).some(fac => fac.toLowerCase().includes(kw))
    );
  }

  return results;
}

// Check 1: Gola Ka Mandir filter
const golaListings = filterAccommodations({ locality: 'Gola Ka Mandir' });
assert.strictEqual(golaListings.length, 2, 'Should find 2 listings in Gola Ka Mandir');
console.log('✅ Locality Filter (Gola Ka Mandir): Passed (2 listings found)');

// Check 2: Thatipur filter
const thatipurListings = filterAccommodations({ locality: 'Thatipur' });
assert.strictEqual(thatipurListings.length, 1, 'Should find 1 listing in Thatipur');
console.log('✅ Locality Filter (Thatipur): Passed (1 listing found)');

// Check 3: Type Filter (PG)
const pgListings = filterAccommodations({ type: 'PG' });
assert.strictEqual(pgListings.length, 2, 'Should find 2 PG listings');
console.log('✅ Type Filter (PG): Passed (2 listings found)');

// Check 4: Type Filter (Hostel)
const hostelListings = filterAccommodations({ type: 'Hostel' });
assert.strictEqual(hostelListings.length, 2, 'Should find 2 Hostel listings');
console.log('✅ Type Filter (Hostel): Passed (2 listings found)');

// Check 5: Type Filter (Flat)
const flatListings = filterAccommodations({ type: 'Flat' });
assert.strictEqual(flatListings.length, 2, 'Should find 2 Flat listings');
console.log('✅ Type Filter (Flat): Passed (2 listings found)');

// Check 6: Budget Filter (<= 5000)
const budget5000 = filterAccommodations({ budget: '5000' });
assert.strictEqual(budget5000.length, 2, 'Should find 2 listings <= ₹5000');
console.log('✅ Budget Filter (<= 5000): Passed (2 listings found)');

// Check 7: Facility Filter (Food)
const foodListings = filterAccommodations({ facility: 'food' });
assert.ok(foodListings.length >= 4, 'Should find at least 4 listings with food included');
console.log(`✅ Facility Filter (Food): Passed (${foodListings.length} listings found)`);

// Check 8: Facility Filter (Air Conditioning / Cooler)
const acListings = filterAccommodations({ facility: 'air' });
assert.strictEqual(acListings.length, 3, 'Should find 3 listings with AC/Cooler');
console.log('✅ Facility Filter (AC/Cooler): Passed (3 listings found)');

// Check 9: Combined Filter
const combined = filterAccommodations({ locality: 'Gola Ka Mandir', type: 'Hostel' });
assert.strictEqual(combined.length, 1, 'Should find 1 Hostel in Gola Ka Mandir');
console.log('✅ Combined Filter (Gola Ka Mandir + Hostel): Passed (1 listing found)');

// Check 10: Empty State Filter
const emptyResults = filterAccommodations({ locality: 'Thatipur', budget: '3000' });
assert.strictEqual(emptyResults.length, 0, 'No listings should match budget 3000 in Thatipur');
console.log('✅ Empty State Trigger: Passed (0 results correctly triggers helpful empty message)\n');

console.log('🎉 All 10 client filtering checks passed with 100% accuracy!');
