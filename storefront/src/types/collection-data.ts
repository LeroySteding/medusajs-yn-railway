export type ImageField = {
  id: string;
  url: string;
};

export type Collection = {
  collectionName: string;
  image?: ImageField;
  description?: string;
  collection_page_image?: ImageField;
  collection_page_heading?: string;
  collection_page_content?: string;
  product_page_heading?: string;
  product_page_image?: ImageField;
  product_page_wide_image?: ImageField;
  product_page_cta_image?: ImageField;
  product_page_cta_heading?: string;
  product_page_cta_link?: string;
};