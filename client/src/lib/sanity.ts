import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

// NOTE: Replace 'YOUR_PROJECT_ID' with your actual Sanity Project ID.
// You can find this in your Sanity Studio Dashboard or sanity.json/sanity.config.ts if you have one.
export const client = createClient({
    projectId: 'e5j0xnxe',
    dataset: 'production',
    useCdn: true, // set to `false` to bypass the edge cache
    apiVersion: '2023-05-03', // use current date (YYYY-MM-DD) to target the latest API version
});

const builder = imageUrlBuilder(client);

export function urlFor(source: any) {
    return builder.image(source);
}
