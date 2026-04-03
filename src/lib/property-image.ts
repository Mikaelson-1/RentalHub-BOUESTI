const APARTMENT_IMAGES = [
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=400&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&h=400&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=400&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=400&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=400&fit=crop&auto=format",
];

/**
 * Returns a consistent placeholder image for a property based on its ID.
 * Used when the property has no uploaded images.
 */
export function getPropertyImage(propertyId: string): string {
  const hash = propertyId.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return APARTMENT_IMAGES[hash % APARTMENT_IMAGES.length];
}
