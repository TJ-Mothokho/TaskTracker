export type ToastType = "success" | "error" | "info" | "warning";

interface ToastOptions {
  type: ToastType;
  message: string;
  duration?: number;
}

class ToastManager {
  private toasts: Map<string, HTMLElement> = new Map();

  show({ type, message, duration = 4000 }: ToastOptions) {
    const id = Date.now().toString();
    const toast = this.createToastElement(type, message, id);

    document.body.appendChild(toast);
    this.toasts.set(id, toast);

    // Auto-hide after duration
    setTimeout(() => {
      this.hide(id);
    }, duration);

    return id;
  }

  private createToastElement(
    type: ToastType,
    message: string,
    id: string
  ): HTMLElement {
    const toast = document.createElement("div");
    toast.id = `toast-${id}`;
    toast.className = `toast toast-end toast-top z-50`;

    const alertClass = {
      success: "alert-success",
      error: "alert-error",
      info: "alert-info",
      warning: "alert-warning",
    }[type];

    toast.innerHTML = `
      <div class="alert ${alertClass}">
        <span>${message}</span>
        <button class="btn btn-sm btn-circle btn-ghost" onclick="window.toastManager.hide('${id}')">✕</button>
      </div>
    `;

    return toast;
  }

  hide(id: string) {
    const toast = this.toasts.get(id);
    if (toast) {
      toast.remove();
      this.toasts.delete(id);
    }
  }

  hideAll() {
    this.toasts.forEach((toast) => toast.remove());
    this.toasts.clear();
  }
}

// Create global instance
export const toastManager = new ToastManager();

// Make it available globally for onclick handlers
declare global {
  interface Window {
    toastManager: ToastManager;
  }
}

window.toastManager = toastManager;

// Helper functions
export const showToast = (
  message: string,
  type: ToastType = "info",
  duration?: number
) => {
  return toastManager.show({ type, message, duration });
};

export const showSuccess = (message: string, duration?: number) => {
  return showToast(message, "success", duration);
};

export const showError = (message: string, duration?: number) => {
  return showToast(message, "error", duration);
};

export const showInfo = (message: string, duration?: number) => {
  return showToast(message, "info", duration);
};

export const showWarning = (message: string, duration?: number) => {
  return showToast(message, "warning", duration);
};
