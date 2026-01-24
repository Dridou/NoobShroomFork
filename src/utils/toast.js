/**
 * Simple toast notification system without external dependencies
 */

const toastStyles = `
  .vote-toast {
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 12px 16px;
    border-radius: 6px;
    background-color: #323232;
    color: white;
    font-size: 14px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    z-index: 9999;
    max-width: 300px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    animation: slideIn 0.3s ease-out, slideOut 0.3s ease-out 4.7s forwards;
    word-wrap: break-word;
  }

  .vote-toast.error {
    background-color: #d32f2f;
  }

  .vote-toast.success {
    background-color: #388e3c;
  }

  .vote-toast.warning {
    background-color: #f57c00;
  }

  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }

  @media (max-width: 768px) {
    .vote-toast {
      bottom: 16px;
      right: 16px;
      left: 16px;
      max-width: none;
    }
  }
`;

// Inject styles once
if (typeof document !== "undefined" && !document.getElementById("vote-toast-styles")) {
  const styleEl = document.createElement("style");
  styleEl.id = "vote-toast-styles";
  styleEl.textContent = toastStyles;
  document.head.appendChild(styleEl);
}

/**
 * Show a toast notification
 * @param {string} message - The message to display
 * @param {string} type - 'error', 'success', or 'warning'
 * @param {number} duration - Duration in milliseconds (default 5000)
 */
export function showToast(message, type = "error", duration = 5000) {
  if (typeof document === "undefined") return;

  const toastEl = document.createElement("div");
  toastEl.className = `vote-toast ${type}`;
  toastEl.textContent = message;
  toastEl.setAttribute("role", "alert");
  toastEl.setAttribute("aria-live", "polite");

  document.body.appendChild(toastEl);

  // Remove element after animation completes
  setTimeout(() => {
    toastEl.remove();
  }, duration + 300); // +300 for animation duration
}
