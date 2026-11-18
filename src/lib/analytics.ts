// GA4 analytics + company enrichment (IP -> organization lookup).
// Only active in production builds when VITE_GA_ID is set.

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

const GA_ID = import.meta.env.VITE_GA_ID as string | undefined;
const ORG_CACHE_KEY = 'visitor_org_v1';

const isBot = () =>
  navigator.webdriver || /bot|crawl|spider|slurp|headless|lighthouse|preview/i.test(navigator.userAgent);

export const analyticsEnabled = Boolean(import.meta.env.PROD && GA_ID) && !isBot();

type OrgInfo = {
  org: string;
  asn: string;
  city: string;
  region: string;
  country: string;
};

async function lookupOrg(): Promise<OrgInfo | null> {
  try {
    const cached = sessionStorage.getItem(ORG_CACHE_KEY);
    if (cached) return JSON.parse(cached);
  } catch {}

  // Primary: ipapi.co (free, ~1k req/day). Fallback: ipwho.is.
  const sources: Array<() => Promise<OrgInfo>> = [
    async () => {
      const r = await fetch('https://ipapi.co/json/');
      if (!r.ok) throw new Error(String(r.status));
      const d = await r.json();
      if (d.error) throw new Error(d.reason);
      return { org: d.org ?? '', asn: d.asn ?? '', city: d.city ?? '', region: d.region ?? '', country: d.country_name ?? '' };
    },
    async () => {
      const r = await fetch('https://ipwho.is/');
      const d = await r.json();
      if (!d.success) throw new Error(d.message);
      return {
        org: d.connection?.org || d.connection?.isp || '',
        asn: d.connection?.asn ? `AS${d.connection.asn}` : '',
        city: d.city ?? '',
        region: d.region ?? '',
        country: d.country ?? '',
      };
    },
  ];

  for (const src of sources) {
    try {
      const info = await src();
      try { sessionStorage.setItem(ORG_CACHE_KEY, JSON.stringify(info)); } catch {}
      return info;
    } catch {}
  }
  return null;
}

export function initAnalytics() {
  if (!analyticsEnabled) return;

  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  // SPA: page views are sent manually on route change.
  window.gtag('config', GA_ID, { send_page_view: false });

  lookupOrg().then((info) => {
    if (!info) return;
    const isGoogle = /google/i.test(info.org) || info.asn === 'AS15169';
    window.gtag('set', 'user_properties', {
      visitor_org: info.org.slice(0, 36),
      visitor_asn: info.asn,
      is_google: isGoogle ? 'yes' : 'no',
    });
    window.gtag('event', 'visitor_identified', {
      visitor_org: info.org.slice(0, 100),
      visitor_asn: info.asn,
      visitor_city: info.city,
      visitor_region: info.region,
      visitor_country: info.country,
      is_google: isGoogle ? 'yes' : 'no',
      landing_page: location.pathname,
      referrer: document.referrer || '(direct)',
    });
  });
}

export function trackPageView(path: string) {
  if (!analyticsEnabled) return;
  window.gtag('event', 'page_view', {
    page_path: path,
    page_location: location.href,
    page_title: document.title,
  });
}
