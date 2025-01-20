import { createClient } from "next-sanity";
import imageUrlBuilder from '@sanity/image-url';

export const client = createClient({
    projectId: "qslspj41",
    dataset: "production",
    apiVersion: "2024-01-01",
    token: process.env.NEXT_PUBLIC_SANITY_TOKEN,
    useCdn: false
})

const builder = imageUrlBuilder(client)

export function urlFor(source: any){
    return builder.image(source)
}