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
const SOURCE_CACHE_KEY = 'visitor_source_v1';

// Google's internal intern-matching tool. Recruiters/hosts clicking through from
// a candidate profile arrive with this referrer (origin-only under default policy).
const INTERNMATCH_RE = /(^|\.)internmatch\.googleplex\.com$/i;
const GOOGLEPLEX_RE = /(^|\.)googleplex\.com$/i;

type Source = { referrer: string; host: string; internmatch: boolean; googleplex: boolean };

// document.referrer only reflects the original landing, but we cache it per
// session anyway so a reload mid-session doesn't lose the attribution.
function getSource(): Source {
  try {
    const cached = sessionStorage.getItem(SOURCE_CACHE_KEY);
    if (cached) return JSON.parse(cached);
  } catch {}
  let host = '';
  try { host = document.referrer ? new URL(document.referrer).hostname : ''; } catch {}
  // Fallback for when googleplex strips the referrer: link to the site from the
  // internmatch profile as ?ref=internmatch (or utm_source=internmatch).
  const params = new URLSearchParams(location.search);
  const tagged = [params.get('ref'), params.get('utm_source')].some((v) => v?.toLowerCase() === 'internmatch');
  const src: Source = {
    referrer: document.referrer || '(direct)',
    host,
    internmatch: INTERNMATCH_RE.test(host) || tagged,
    googleplex: GOOGLEPLEX_RE.test(host),
  };
  try { sessionStorage.setItem(SOURCE_CACHE_KEY, JSON.stringify(src)); } catch {}
  return src;
}

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

  const source = getSource();
  window.gtag('set', 'user_properties', {
    from_internmatch: source.internmatch ? 'yes' : 'no',
  });
  if (source.internmatch) {
    // Dedicated event so it can be marked as a key event / alerted on in GA4.
    window.gtag('event', 'internmatch_visit', {
      referrer: source.referrer,
      landing_page: location.pathname,
    });
  }

  lookupOrg().then((info) => {
    if (!info) return;
    const source = getSource();
    const isGoogle = /google/i.test(info.org) || info.asn === 'AS15169' || source.googleplex || source.internmatch;
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
      referrer: source.referrer,
      from_internmatch: source.internmatch ? 'yes' : 'no',
    });
  });
}

export function trackPageView(path: string) {
  if (!analyticsEnabled) return;
  window.gtag('event', 'page_view', {
    page_path: path,
    page_location: location.href,
    page_title: document.title,
    from_internmatch: getSource().internmatch ? 'yes' : 'no',
  });
}
