/**
 * ==============================================================================
 * Stayvia Server
 * Student Accommodation and Mess Management Platform
 * ==============================================================================
 */

const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const db = require('./config/db');
const apiRoutes = require('./routes/api');
const { notFoundHandler, globalErrorHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// ------------------------------------------------------------------------------
// 1. Security & Core Middleware
// ------------------------------------------------------------------------------

// Configure Helmet with Content Security Policy that permits CDNs used for fonts & styles
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://cdn.jsdelivr.net"
        ],
        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://cdn.jsdelivr.net",
          "https://fonts.googleapis.com",
          "https://cdnjs.cloudflare.com"
        ],
        fontSrc: [
          "'self'",
          "https://fonts.gstatic.com",
          "https://cdn.jsdelivr.net",
          "https://cdnjs.cloudflare.com"
        ],
        imgSrc: [
          "'self'",
          "data:",
          "https://images.unsplash.com",
          "https://images.pexels.com"
        ],
        connectSrc: ["'self'"],
        scriptSrcAttr: ["'unsafe-inline'"]
      }
    },
    crossOriginEmbedderPolicy: false
  })
);

// Enable Cross-Origin Resource Sharing
app.use(cors());

// HTTP request logger in development mode
if (NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Request body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ------------------------------------------------------------------------------
// 2. Static Assets Delivery (No-Cache headers for demonstration/development)
// ------------------------------------------------------------------------------
app.use(express.static(path.join(__dirname, 'public'), {
  etag: false,
  lastModified: false,
  setHeaders: (res) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
  }
}));

// Helper to send HTML files without browser caching
const sendFreshHtml = (res, filename) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  res.sendFile(path.join(__dirname, 'public', filename));
};

// ------------------------------------------------------------------------------
// 3. API Routes
// ------------------------------------------------------------------------------
app.use('/api', apiRoutes);

// Root route (serves the index.html homepage explicitly)
app.get('/', (req, res) => {
  sendFreshHtml(res, 'index.html');
});

// Dedicated HTML page routes for clean navigation
app.get('/login', (req, res) => {
  sendFreshHtml(res, 'login.html');
});

app.get('/signup', (req, res) => {
  sendFreshHtml(res, 'signup.html');
});

app.get('/property', (req, res) => {
  sendFreshHtml(res, 'property.html');
});

app.get('/owner-dashboard', (req, res) => {
  sendFreshHtml(res, 'owner-dashboard.html');
});

app.get('/dashboard', (req, res) => {
  sendFreshHtml(res, 'owner-dashboard.html');
});

// ------------------------------------------------------------------------------
// 4. Centralized Error Handling
// ------------------------------------------------------------------------------
app.use(notFoundHandler);
app.use(globalErrorHandler);

// ------------------------------------------------------------------------------
// 5. Server Startup & Safe DB Connectivity Test
// ------------------------------------------------------------------------------
const server = app.listen(PORT, async () => {
  console.log('\n=============================================================');
  console.log('  🏠 STAYVIA - Student Accommodation & Mess Management');
  console.log('=============================================================');
  console.log(`  🌐 Server running at: http://localhost:${PORT}`);
  console.log(`  🩺 Health check at:  http://localhost:${PORT}/api/health`);
  console.log(`  📦 Environment:      ${NODE_ENV}`);
  console.log('-------------------------------------------------------------');

  // Safely check MySQL connectivity without crashing if not configured yet
  const dbStatus = await db.testConnection();
  if (dbStatus.connected) {
    console.log(`  ✅ MySQL Database:   ${dbStatus.message}`);
  } else {
    console.log(`  ℹ️  MySQL Database:   ${dbStatus.message}`);
    console.log('     (Homepage & frontend demo features are fully functional!)');
  }
  console.log('=============================================================\n');
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received. Closing HTTP server gracefully.');
  server.close(() => {
    console.log('Stayvia HTTP server closed.');
  });
});

process.on('SIGINT', () => {
  console.log('\nStayvia server stopped.');
  process.exit(0);
});

module.exports = app;
