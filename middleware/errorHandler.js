/**
 * Stayvia Centralized Error Handling Middleware
 */

/**
 * 404 Not Found Middleware
 * Handles requests to endpoints or files that do not exist.
 */
function notFoundHandler(req, res, next) {
  const isApiRequest = req.originalUrl.startsWith('/api');

  if (isApiRequest) {
    return res.status(404).json({
      success: false,
      error: 'Not Found',
      message: `The requested API endpoint '${req.originalUrl}' does not exist on this server.`,
      availableEndpoints: {
        health: '/api/health',
        accommodations: '/api/accommodations'
      }
    });
  }

  // For static/browser page 404s
  res.status(404).send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>404 - Page Not Found | Stayvia</title>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
      <style>
        body { background-color: #0b192c; color: #f8fafc; font-family: system-ui, -apple-system, sans-serif; display: flex; align-items: center; min-height: 100vh; }
        .card { background-color: #1e293b; border: 1px solid #334155; border-radius: 1rem; color: #f8fafc; }
        .btn-stayvia { background-color: #0d9488; color: #ffffff; font-weight: 600; }
        .btn-stayvia:hover { background-color: #0f766e; color: #ffffff; }
      </style>
    </head>
    <body>
      <div class="container text-center py-5">
        <div class="card p-5 mx-auto" style="max-width: 520px;">
          <h1 class="display-3 fw-bold text-warning mb-3">404</h1>
          <h2 class="h4 mb-3">Page Not Found</h2>
          <p class="text-secondary mb-4">The page or resource you are looking for at <code>${req.originalUrl}</code> could not be found.</p>
          <a href="/" class="btn btn-stayvia px-4 py-2">Return to Stayvia Home</a>
        </div>
      </div>
    </body>
    </html>
  `);
}

/**
 * Global Error Handler Middleware
 * Catches unhandled errors thrown inside route handlers.
 */
function globalErrorHandler(err, req, res, next) {
  const statusCode = err.status || err.statusCode || 500;
  const isApiRequest = req.originalUrl.startsWith('/api');

  console.error(`[Stayvia Server Error] ${req.method} ${req.originalUrl} - Status: ${statusCode}`);
  console.error(err.stack || err);

  if (isApiRequest) {
    return res.status(statusCode).json({
      success: false,
      error: err.name || 'InternalServerError',
      message: err.message || 'An unexpected server error occurred.',
      ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {})
    });
  }

  res.status(statusCode).send(`
    <div style="font-family: sans-serif; padding: 2rem; max-width: 600px; margin: 40px auto; border: 1px solid #f87171; border-radius: 8px; background: #fff1f2;">
      <h2 style="color: #991b1b;">Server Error (${statusCode})</h2>
      <p style="color: #4b5563;">An error occurred while processing your request.</p>
      <pre style="background: #ffffff; padding: 1rem; border-radius: 4px; overflow-x: auto;">${err.message}</pre>
      <a href="/" style="display: inline-block; margin-top: 1rem; color: #0d9488; font-weight: 600;">Go Back to Stayvia Home</a>
    </div>
  `);
}

module.exports = {
  notFoundHandler,
  globalErrorHandler
};
