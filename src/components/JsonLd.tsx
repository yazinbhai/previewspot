import React from 'react';

export default function JsonLd() {
  const baseUrl = 'https://previewspot.com';

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'ProfessionalService'],
    '@id': `${baseUrl}/#organization`,
    name: 'Previewspot',
    alternateName: 'Previewspot AI Creative Agency',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    image: `${baseUrl}/logo.png`,
    description:
      'AI-powered performance creatives and video ads built for Indian DTC and SaaS brands. Scripting, AI video, and UGC-style ads that stop the scroll.',
    email: 'hello@previewspotfilms.com',
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IN',
    },
    areaServed: [
      {
        '@type': 'Country',
        name: 'India',
      },
      {
        '@type': 'Country',
        name: 'Worldwide',
      },
    ],
    knowsAbout: [
      'AI Video Ads',
      'Performance Ad Creatives',
      'UGC Video Production',
      'Direct-to-Consumer (DTC) Marketing',
      'SaaS Creative Strategy',
      'Meta Ads Optimization',
      'YouTube Shorts & Instagram Reels Ads',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'hello@previewspotfilms.com',
      contactType: 'customer support',
      availableLanguage: ['English', 'Hindi'],
    },
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${baseUrl}/#website`,
    url: baseUrl,
    name: 'Previewspot',
    description:
      'Ads that stop the scroll. AI-powered performance creatives built for Indian DTC and SaaS brands.',
    inLanguage: 'en-US',
    publisher: {
      '@id': `${baseUrl}/#organization`,
    },
  };

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${baseUrl}/#service`,
    name: 'AI Performance Video Ad Creation',
    serviceType: 'Performance Creative Agency',
    provider: {
      '@id': `${baseUrl}/#organization`,
    },
    description:
      'High-converting performance video ads, UGC-style creative variations, kinetic typography, and AI-powered scripting for digital advertising campaigns.',
    areaServed: 'Worldwide',
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Previewspot Creative Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Performance Ad Scripting',
            description:
              'Data-backed 3-second hooks and psychological trigger scripting to elevate CTR and watch time.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'UGC-Style Video Ads',
            description:
              'Authentic native-feeling video ad creatives for Instagram Reels, Meta Ads, and YouTube Shorts.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'AI Visual B-Roll & Editing',
            description:
              'Cinematic synthetic video layers, fluid motion graphics, and hyper-realistic AI avatars.',
          },
        },
      ],
    },
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${baseUrl}/#faq`,
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is Previewspot?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Previewspot is an AI-powered performance creative agency that builds high-converting video ads, UGC-style content, and data-backed scripts for Indian DTC and SaaS brands.',
        },
      },
      {
        '@type': 'Question',
        name: 'How does AI video ad creation work at Previewspot?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We combine psychological hook scripting with generative AI video models, kinetic visual editing, and native UGC pacing to produce high-performing ad variations fast and affordably.',
        },
      },
      {
        '@type': 'Question',
        name: 'What ad platforms are Previewspot video ads built for?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Previewspot video ads are optimized for Meta Ads (Instagram Reels, Facebook Feed), YouTube Shorts, TikTok Ads, and LinkedIn Video Ads in 9:16, 1:1, and 16:9 aspect ratios.',
        },
      },
      {
        '@type': 'Question',
        name: 'Why choose Previewspot over traditional video agencies?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Traditional agencies require physical film sets, expensive talent, and weeks of editing. Previewspot delivers agency-quality ads at startup-friendly prices with rapid turnaround and unlimited revisions.',
        },
      },
      {
        '@type': 'Question',
        name: 'Who owns the final video ad files and scripts?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'You get 100% full creative ownership of all rendered video files, scripts, and source materials with no hidden licensing fees.',
        },
      },
      {
        '@type': 'Question',
        name: 'How do I get started with Previewspot?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'You can book a free 30-minute strategy call on our website or email us at hello@previewspotfilms.com to discuss your brand and creative goals.',
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}
