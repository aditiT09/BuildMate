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
    return detail.map(d => {
      const field = d.loc ? d.loc[d.loc.length - 1] : "";
      return `${field ? field + ": " : ""}${d.msg || JSON.stringify(d)}`;
    }).join(", ");
  }
  if (typeof detail === "object") {
    return detail.message || detail.detail || JSON.stringify(detail);
  }
  return String(detail);
};
