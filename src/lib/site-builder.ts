export type IndustryId = "healthcare" | "professional" | "local" | "software";
export type SitePageId = "home" | "services" | "about" | "contact" | "privacy";

export type SiteBrief = {
  name: string;
  tagline: string;
  city: string;
  industry: IndustryId;
  pages: SitePageId[];
  compliance: "none" | "standard" | "regulated" | "hipaa";
};

export type SiteTokens = {
  bg: string;
  surface: string;
  fg: string;
  muted: string;
  accent: string;
  accentFg: string;
};

export type GeneratedPage = {
  id: SitePageId;
  title: string;
  path: string;
  headline: string;
  body: string;
  bullets: string[];
  cta: string;
};

export type GeneratedSite = {
  id: string;
  createdAt: string;
  brief: SiteBrief;
  tokens: SiteTokens;
  pages: GeneratedPage[];
  seo: { title: string; description: string };
  schema: string;
};

export const INDUSTRIES: Record<
  IndustryId,
  { label: string; blurb: string; defaultTagline: string; services: string[]; tokens: SiteTokens }
> = {
  healthcare: {
    label: "Healthcare / Medicare",
    blurb: "Clinics, MAOs, agencies, telehealth. Trust, credentials, and plain language first.",
    defaultTagline: "Care that treats people as equals.",
    services: [
      "New to Medicare walkthroughs",
      "Annual enrollment reviews",
      "Care navigation and referrals",
      "Family caregiver support",
    ],
    tokens: {
      bg: "#f6f3ee",
      surface: "#ffffff",
      fg: "#1c1916",
      muted: "#5c564e",
      accent: "#1f4d3a",
      accentFg: "#f6f3ee",
    },
  },
  professional: {
    label: "Professional services",
    blurb: "Legal, finance, insurance, advisory. Clarity, risk language, and proof.",
    defaultTagline: "Advice you can act on.",
    services: [
      "Strategy sessions",
      "Engagement letters and scoping",
      "Ongoing advisory retainers",
      "Document and filing support",
    ],
    tokens: {
      bg: "#f4f1ea",
      surface: "#fffcf7",
      fg: "#161412",
      muted: "#5a554c",
      accent: "#2c2418",
      accentFg: "#f4f1ea",
    },
  },
  local: {
    label: "Local services",
    blurb: "Home, field, and storefront businesses. Fast proof, hours, and a clear call.",
    defaultTagline: "Done right, on the first visit.",
    services: [
      "Same-week scheduling",
      "Upfront written estimates",
      "Licensed and insured crews",
      "Follow-up guarantee",
    ],
    tokens: {
      bg: "#f3f5f2",
      surface: "#ffffff",
      fg: "#1a1f1b",
      muted: "#556058",
      accent: "#2e4a38",
      accentFg: "#f3f5f2",
    },
  },
  software: {
    label: "Software / SaaS",
    blurb: "Product sites that convert. One offer, one proof, one next step.",
    defaultTagline: "Ship the system, not the slide deck.",
    services: [
      "Core product",
      "Implementation",
      "Integrations",
      "Support and success",
    ],
    tokens: {
      bg: "#f2f3f7",
      surface: "#ffffff",
      fg: "#12141a",
      muted: "#5b6170",
      accent: "#1b2436",
      accentFg: "#f2f3f7",
    },
  },
};

const ALL_PAGES: SitePageId[] = ["home", "services", "about", "contact", "privacy"];

export function defaultBrief(): SiteBrief {
  return {
    name: "",
    tagline: "",
    city: "",
    industry: "healthcare",
    pages: ["home", "services", "about", "contact"],
    compliance: "hipaa",
  };
}

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "site";
}

export function generateSite(brief: SiteBrief): GeneratedSite {
  const industry = INDUSTRIES[brief.industry];
  const name = brief.name.trim() || "Northfield Practice";
  const tagline = brief.tagline.trim() || industry.defaultTagline;
  const city = brief.city.trim() || "Prosper, Texas";
  const pagesWanted = brief.pages.length ? brief.pages : (["home", "services", "contact"] as SitePageId[]);
  const uniquePages = ALL_PAGES.filter((p) => pagesWanted.includes(p) || p === "home");

  const pages: GeneratedPage[] = uniquePages.map((id) => {
    if (id === "home") {
      return {
        id,
        title: "Home",
        path: "/",
        headline: tagline,
        body: `${name} serves ${city}. This is generated preview copy — one offer, one next step. Replace it before you publish.`,
        bullets: industry.services.slice(0, 3),
        cta: "Book a conversation",
      };
    }
    if (id === "services") {
      return {
        id,
        title: "Services",
        path: "/services",
        headline: `How ${name} works`,
        body: "Each service is written as a job to be done, not a brochure line. Search engines and people get the same story.",
        bullets: industry.services,
        cta: "See availability",
      };
    }
    if (id === "about") {
      return {
        id,
        title: "About",
        path: "/about",
        headline: "Built by people who have been in the room",
        body: `${name} is based in ${city}. Experience is shown as credentials, process, and outcomes — not slogans.`,
        bullets: ["Named practitioners", "Plain-language process", "Local and reachable"],
        cta: "Meet the team",
      };
    }
    if (id === "contact") {
      return {
        id,
        title: "Contact",
        path: "/contact",
        headline: "Start here",
        body: `Reach ${name} in ${city}. One form, one confirmation, no dark patterns.`,
        bullets: ["Replace this response-time claim", "No shared inboxes as a product", city],
        cta: "Send a message",
      };
    }
    return {
      id,
      title: "Privacy",
      path: "/privacy",
      headline: "Privacy",
      body:
        brief.compliance === "hipaa"
          ? "Placeholder Notice of Privacy Practices. Replace with the HIPAA pack after attorney review."
          : "Placeholder privacy policy. Install a compliance pack before launch.",
      bullets: ["What we collect", "How it is used", "How to request access"],
      cta: "Request a copy",
    };
  });

  const seo = {
    title: `${name} — ${tagline}`,
    description: `${name} in ${city}. ${tagline}`,
  };

  const schema = JSON.stringify(
    {
      "@context": "https://schema.org",
      "@type": brief.industry === "healthcare" ? "MedicalBusiness" : "LocalBusiness",
      name,
      description: seo.description,
      areaServed: city,
    },
    null,
    2,
  );

  return {
    id: `site_${slugify(name)}_${Date.now().toString(36)}`,
    createdAt: new Date().toISOString(),
    brief: { ...brief, name, tagline, city, pages: uniquePages },
    tokens: industry.tokens,
    pages,
    seo,
    schema,
  };
}

export const BUILD_STEPS = [
  "Lock industry and voice",
  "Compose information architecture",
  "Write page copy from the brief",
  "Assign brand tokens and type",
  "Emit schema and compliance stubs",
] as const;
