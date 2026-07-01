export function parseBrowser(userAgent = "") {
  if (/Edg\//.test(userAgent)) return "Microsoft Edge";
  if (/Chrome\//.test(userAgent) && !/Chromium/.test(userAgent)) return "Chrome";
  if (/Safari\//.test(userAgent) && !/Chrome\//.test(userAgent)) return "Safari";
  if (/Firefox\//.test(userAgent)) return "Firefox";
  if (/OPR\//.test(userAgent)) return "Opera";
  return userAgent ? "Unknown Browser" : "Unavailable";
}

export function parseOperatingSystem(userAgent = "") {
  if (/Windows NT/.test(userAgent)) return "Windows";
  if (/Mac OS X/.test(userAgent)) return "macOS";
  if (/Android/.test(userAgent)) return "Android";
  if (/iPhone|iPad|iPod/.test(userAgent)) return "iOS";
  if (/Linux/.test(userAgent)) return "Linux";
  return userAgent ? "Unknown OS" : "Unavailable";
}

export function getClientIp(headersList: Headers) {
  const forwardedFor = headersList.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0]?.trim();

  return (
    headersList.get("x-real-ip") ??
    headersList.get("cf-connecting-ip") ??
    headersList.get("x-vercel-forwarded-for") ??
    undefined
  );
}
