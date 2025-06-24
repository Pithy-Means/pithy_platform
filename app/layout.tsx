import localFont from "next/font/local";
import "./globals.css";
import ConditionalLayout from "@/components/ConditionalLayout";
import { UserProvider } from "@/context/UserContext";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from '@vercel/speed-insights/next';
import PWAInstallPromotion from "@/components/PWAInstallPromotion";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// Define constants for reuse across the application
const SITE_NAME = 'Pithy Means';
const SITE_URL = 'https://pithymeansplus.com';
const DEFAULT_TITLE = 'Pithy Means | Expert Personal Development Resources & Coaching';
const DEFAULT_DESCRIPTION = 'Transform your life with Pithy Means - the premiere platform for evidence-based personal growth strategies, productivity systems, and expert coaching to achieve meaningful goals faster.';

// Define primary and secondary keyword clusters for better semantic SEO
const PRIMARY_KEYWORDS = [
  'personal development platform',
  'self-improvement resources',
  'professional growth tools',
  'life transformation coaching',
  'productivity systems'
];

const SECONDARY_KEYWORDS = [
  'goal achievement framework',
  'mindfulness practices',
  'career advancement strategies',
  'skill building methodology',
  'personal effectiveness coaching'
];

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#ffffff',
};

// Enhanced function to generate page-specific metadata with schema.org structured data
export const generateMetadata = ({
} = {}) => {
  // Default metadata for the root layout
  const metadataBase = new URL(SITE_URL);
  const title = DEFAULT_TITLE;
  const description = DEFAULT_DESCRIPTION;
  const path = '/';
  const ogImage = '/opengraph-image.png';
  const pageType = 'WebPage';
  const datePublished = new Date().toISOString();
  const dateModified = new Date().toISOString();
  const pageUrl = `${SITE_URL}${path}`;
  const allKeywords = [...new Set([...PRIMARY_KEYWORDS, ...SECONDARY_KEYWORDS,
    'Pithy Means Plus',
    'executive coaching',
    'habit formation',
    'personal transformation',
    'productivity enhancement',
    'professional development',
    'mental wellness strategies',
    'goal setting framework'
  ])];

  // Generate JSON-LD structured data based on page type
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': pageType,
    name: title,
    description: description,
    datePublished: datePublished,
    dateModified: dateModified,
    url: pageUrl,
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/images/logo.png`,
      },
    },
    image: `${SITE_URL}${ogImage}`,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': pageUrl,
    },
    keywords: allKeywords.join(', '),
  };

  return {
    metadataBase,

    // Enhanced title with primary keyword focus
    title: {
      default: title,
      template: '%s | Pithy Means Plus - Personal Development Experts',
    },

    // Expanded description with clear value proposition and call-to-action
    description,

    // Canonical and alternate URLs with hreflang implementation
    alternates: {
      canonical: '/',
      languages: {
        'en-US': '/en-US',
        'es-ES': '/es-ES',
      },
    },

    // Strategic keyword selection based on search intent and competition analysis
    keywords: allKeywords,

    // Optimized icons for various platforms with consistent branding
    icons: {
      icon: [
        { url: '/favicon.ico' },
        { url: '/icons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
        { url: '/icons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      ],
      apple: [
        { url: '/icons/apple-touch-icon.png', sizes: '180x180' },
      ],
      other: [
        { rel: 'mask-icon', url: '/safari-pinned-tab.svg', color: '#5bbad5' },
      ],
    },

    // Web app manifest for PWA
    manifest: '/site.webmanifest',

    // Enhanced Open Graph metadata for improved social sharing
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: SITE_URL,
      siteName: SITE_NAME,
      title: title,
      description: description,
      images: [
        {
          url: `${SITE_URL}/opengraph-image.png`,
          width: 1200,
          height: 630,
          alt: 'Pithy Means Plus - Expert Personal Development Platform',
          type: 'image/png',
        },
        {
          url: `${SITE_URL}/opengraph-image.png`,
          width: 600,
          height: 600,
          alt: 'Pithy Means Plus - Expert Personal Development Platform',
          type: 'image/png',
        },
      ],
    },

    // Optimized Twitter Card metadata
    twitter: {
      card: 'summary_large_image',
      site: '@pithymeans',
      creator: '@pithymeans',
      title: title,
      description: description,
      images: "opengraph-image.png",
    },

    // Advanced robots directives
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    // Verification for search engines
    verification: {
      google: '4841994003', // Replace with your actual verification code
      yandex: '45218ce81a99efd4', // Replace with your actual verification code if needed
    },

    // Enhanced additional metadata
    category: 'personal development',
    creator: 'Pithy Means Expert Team',
    publisher: 'Pithy Means',

    // App links (for mobile)
    appleWebApp: {
      title: SITE_NAME,
      statusBarStyle: 'black-translucent',
      capable: true,
      startupImage: [
        {
          url: '/icons/favicon-32x32.png',
          media: '(orientation: portrait)'
        },
        {
          url: '/icons/favicon-32x32.png',
          media: '(orientation: landscape)'
        }
      ]
    },

    // Format detection for mobile
    formatDetection: {
      telephone: true,
      email: true,
      address: true,
    },

    // Additional tags for enhanced indexing and user experience
    other: {
      'revisit-after': '7 days',
      'rating': 'General',
      'referrer': 'no-referrer-when-downgrade',
      structuredData: JSON.stringify(structuredData),
    },
  };
};

// Utility function for creating page-specific metadata in other files
export const createPageMetadata = ({
  title,
  description,
  path = '',
  ogImage = '/opengraph-image.png',
  pageType = 'WebPage',
  pageKeywords = [],
  datePublished = new Date().toISOString(),
  dateModified = new Date().toISOString()
}: {
  title: string;
  description: string;
  path?: string;
  ogImage?: string;
  pageType?: string;
  pageKeywords?: string[];
  datePublished?: string;
  dateModified?: string;
}) => {
  const pageUrl = `${SITE_URL}${path}`;
  const allKeywords = [...new Set([...pageKeywords, ...PRIMARY_KEYWORDS.slice(0, 3)])];

  // Generate JSON-LD structured data based on page type
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': pageType,
    name: title,
    description: description,
    datePublished: datePublished,
    dateModified: dateModified,
    url: pageUrl,
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/images/logo.png`,
      },
    },
    image: `${SITE_URL}${ogImage}`,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': pageUrl,
    },
    keywords: allKeywords.join(', '),
    ...(pageType === 'Article' ? {
      author: {
        '@type': 'Person',
        name: 'Pithy Means Plus Expert',
      }
    } : {})
  };

  return {
    title,
    description,
    keywords: allKeywords,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title,
      description,
      url: pageUrl,
      type: pageType === 'Article' ? 'article' : 'website',
      images: [
        {
          url: `${SITE_URL}${ogImage}`,
          width: 1200,
          height: 630,
          alt: `${title} - Pithy Means Plus`,
        },
      ],
      ...(pageType === 'Article' ? {
        article: {
          publishedTime: datePublished,
          modifiedTime: dateModified,
          section: 'Personal Development',
          tags: allKeywords,
        }
      } : {})
    },
    twitter: {
      title,
      description,
      images: [`${SITE_URL}${ogImage}`],
    },
    // Add the structured data to the page
    other: {
      structuredData: JSON.stringify(structuredData),
    },
  };
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Favicon for all devices */}
        <link rel="icon" href="/favicon.ico" />
        {/** Manifest */}
        <link rel="manifest" href="/manifest.json" />

        {/* Optionally, add more sizes for better support */}
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/icons/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden`}
      >
        <UserProvider>
          <ConditionalLayout>{children}</ConditionalLayout>
        </UserProvider>
        <PWAInstallPromotion />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
