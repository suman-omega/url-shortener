export function extractUTM(url: string) {
  try {
    const parsedUrl = new URL(url);
    const params = parsedUrl.searchParams;
    return {
      utmSource: params.get("utm_source"),
      utmMedium: params.get("utm_medium"),
      utmCampaign: params.get("utm_campaign"),
      utmContent: params.get("utm_content"),
      utmTerm: params.get("utm_term"),
    };
  } catch {
    return {
      utmSource: null,
      utmMedium: null,
      utmCampaign: null,
      utmContent: null,
      utmTerm: null,
    };
  }
}

export function validateUrl(url: string) {
  try {
    const parsedUrl = new URL(url);
    // Allow only htrcare.com and its subdomains, or any other allowed domains
    const allowedDomains = [
      "htrcare.com",
      "go.htrcare.com",
      "social.htrcare.com",
    ];
    const domain = parsedUrl.hostname;

    return allowedDomains.some((d) => domain === d || domain.endsWith("." + d));
  } catch (e) {
    return false;
  }
}
