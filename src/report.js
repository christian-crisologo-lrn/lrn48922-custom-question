import { runReporting } from './reporting';
import { getQueryParam } from './util';

function showError() {
  const errorContainer = document.createElement('div');
  errorContainer.style.cssText = 'padding: 20px; color: red; font-family: Arial, sans-serif;';
  errorContainer.innerHTML = `
    <h2>Error: Missing Session ID</h2>
    <p>Please provide a sessionId in the URL query parameters.</p>
    <p>Example: <code>?sessionId=abc123&userId=user456</code></p>
  `;
  document.body.appendChild(errorContainer);
}

function createHeader(sessionId, userId, env) {
  const header = document.createElement('div');
  header.style.cssText = 'padding: 20px; background: #f5f5f5; border-bottom: 1px solid #ddd; font-family: Arial, sans-serif;';
  header.innerHTML = `
    <h1 style="margin: 0 0 10px 0;">Session Report</h1>
    <p style="margin: 0; color: #666;">
      <strong>Session ID:</strong> ${sessionId}
      ${userId ? `<br><strong>User ID:</strong> ${userId}` : ''}
      <br><strong>Environment:</strong> ${env || 'prod'}
    </p>
  `;
  return header;
}

function initReportingPage() {
  const sessionId = getQueryParam('sessionId');
  const userId = getQueryParam('userId');
  const env = getQueryParam('env');

  if (!sessionId) {
    showError();
    return;
  }

  console.log('Initializing reporting page:', { sessionId, userId, env });

  document.body.appendChild(createHeader(sessionId, userId, env));
  runReporting(sessionId, userId);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initReportingPage);
} else {
  initReportingPage();
}

