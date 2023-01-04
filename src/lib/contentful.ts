import contentful, { Link } from "contentful";
import type { Document } from "@contentful/rich-text-types";

export interface Product {
    sku: string;
    name: string;
    description: Document;
    imageurl: string;
    slug: string;
    category: string;
    subcategory: string;
    ingredients: Document;
    claim: any;
    displayCard: boolean;
    displayNew: boolean;
    packSize: string;
    servingSize: string;
    servingsPerPackage: string;
    energyPerServing: string;
    energyPer100g: string;
    proteinPerServing: string;
    proteinPer100g: string;
    fatTotalPerServing: string;
    fatTotalPer100g: string;
  }

export interface Claim {
  claimName: string;
  claimDescription: string;
}
export interface Category {
    name: string;
    categorySlug: string;
    description: string;
    headerNav: boolean;
    footerNav: boolean;
    imageUrl: string;
    displayCard: boolean;
    sortOrder: number;
}

export interface Subcategory {
  name: string;
  subcategorySlug: string;
  parentCategory: object;
  description: string;
  headerNav: boolean;
  footerNav: boolean;
  imageUrl: string;
  displayCard: boolean;
}

export interface AstroInstance {
    /* The file path of this file */
    file: string;
    /* The URL for this file (if it is in the pages directory) */
    url: string | undefined;
    default: AstroComponent;
  }

export const contentfulClient = contentful.createClient({
  space: import.meta.env.CONTENTFUL_SPACE_ID,
  accessToken: import.meta.env.DEV
    ? import.meta.env.CONTENTFUL_PREVIEW_TOKEN
    : import.meta.env.CONTENTFUL_DELIVERY_TOKEN,
  host: import.meta.env.DEV ? "preview.contentful.com" : "cdn.contentful.com",
});

// export const contentfulClient = contentful.createClient({
//   space: "803kc1al70mk",
//   accessToken: "CFPAT-cIVYxoYSm6cbdqudRRjD-toCWMk5vSwXdfWimjgEmlU",
//   host: "cdn.contentful.com",
// });

