export const validateExternalLink = (url) => {
  if (!url) return "";
  const trimmed = url.trim();
  
  // Block dangerous protocols (XSS prevention)
  if (/^(javascript:|data:|vbscript:)/i.test(trimmed)) {
    return "";
  }
  
  // Standard HTTP/HTTPS
  if (/^https?:\/\//i.test(trimmed)) {
    try {
      new URL(trimmed);
      return trimmed;
    } catch {
      return "";
    }
  }
  
  // Normalize simple domains/handles (e.g., github.com/user)
  if (trimmed.includes(".") && !trimmed.startsWith("/")) {
    const urlWithProtocol = `https://${trimmed}`;
    try {
      new URL(urlWithProtocol);
      return urlWithProtocol;
    } catch {
      return "";
    }
  }
  
  return "";
};

export const getErrorMessage = (detail) => {
  if (!detail) return "";
  if (typeof detail === "string") return detail;

  if (Array.isArray(detail)) {
    return detail.map((d) => {
      if (typeof d === "string") return d;

      const field = d.loc ? d.loc[d.loc.length - 1] : "";

      if (d.msg) {
        return `${field ? field + ": " : ""}${d.msg}`;
      }

      if (d.message) {
        return `${field ? field + ": " : ""}${d.message}`;
      }

      if (d.detail) {
        return `${field ? field + ": " : ""}${getErrorMessage(d.detail)}`;
      }

      return `${field ? field + ": " : ""}${JSON.stringify(d)}`;
    }).join(", ");
  }

  if (typeof detail === "object") {
    if (detail.message) return detail.message;
    if (detail.detail) return getErrorMessage(detail.detail);
    if (detail.errors) return getErrorMessage(detail.errors);
    return JSON.stringify(detail);
  }

  return String(detail);
};
