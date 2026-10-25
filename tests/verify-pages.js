const http = require('http');

const PORT = 3997;
process.env.PORT = PORT;
const app = require('../server');

// Give the server a moment to start
setTimeout(async () => {
  console.log('Testing running server routes at http://localhost:3000 ...\n');

  const routesToTest = [
    { path: '/', expectedText: 'Stayvia' },
    { path: '/login', expectedText: 'Welcome back' },
    { path: '/signup', expectedText: 'Create your Stayvia account' },
    { path: '/property?id=1', expectedText: 'Property Details' },
    { path: '/owner-dashboard', expectedText: 'Owner Dashboard' },
    { path: '/api/health', expectedText: '"status":"ok"' }
  ];

  let allPassed = true;

  for (const item of routesToTest) {
    try {
      const res = await new Promise((resolve, reject) => {
        http.get(`http://localhost:${PORT}${item.path}`, (response) => {
          let data = '';
          response.on('data', chunk => data += chunk);
          response.on('end', () => {
            resolve({
              statusCode: response.statusCode,
              body: data
            });
          });
        }).on('error', reject);
      });

      const containsText = res.body.includes(item.expectedText);
      if (res.statusCode === 200 && containsText) {
        console.log(`✅ [HTTP 200 OK] ${item.path} (Found expected content: "${item.expectedText}")`);
      } else {
        console.log(`❌ [HTTP ${res.statusCode}] ${item.path} (Failed to find: "${item.expectedText}")`);
        allPassed = false;
      }
    } catch (err) {
      console.log(`❌ [ERROR] ${item.path}: ${err.message}`);
      allPassed = false;
    }
  }

  console.log('\nResult: ' + (allPassed ? 'ALL ROUTES RETURNED HTTP 200 OK!' : 'SOME ROUTES FAILED'));
  process.exit(allPassed ? 0 : 1);
}, 600);
