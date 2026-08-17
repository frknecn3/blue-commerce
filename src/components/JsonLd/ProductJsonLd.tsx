import React from 'react';

interface ProductJsonLdProps {
  product: {
    id: string;
    name: string;
    description?: string;
    imageUrl?: string;
    price: number;
    stock: number;
    seller?: {
      storeName?: string;
    } | null;
  };
}

export default function ProductJsonLd({ product }: ProductJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description || product.name,
    image: product.imageUrl ? [product.imageUrl] : [],
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'USD',
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: product.seller?.storeName || 'BluE-Commerce',
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
