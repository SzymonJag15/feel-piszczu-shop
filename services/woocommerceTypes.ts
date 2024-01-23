interface ProductStoreAPICategories {
  id: number;
  name: string;
  slug: string;
}

interface ProductStoreAPIImage {
  id: number;
  date_created: string;
  date_created_gmt: string;
  date_modified: string;
  date_modified_gmt: string;
  src: string;
  name: string;
  alt: string;
}

interface ProductStoreAPIMetaData { 
  id: number;
  key: string;
  value: string | string[];
}

interface IReducedProductVariationPrice {
  current_price: string;
  currency_symbol: string;
}

export interface IReducedProductVariation {
  variation_id: number;
  variation_name: string;
  variation_price: IReducedProductVariationPrice,
}

export interface IReducedProductUpsell {
  upsell_id: number;
  upsell_name: string;
  upsell_slug: string;
  upsell_is_default_cat: boolean;
  upsell_price: IReducedProductVariationPrice,
}

export interface IReducedMetaData {
  technologie?: string;
  lokalizacje?: string;
  poziom_zaawansowania?: string;
  specjalizacje?: string;
  tryby_kursu?: string;
  data_najblizszego_wydarzenia?: string;
  czy_brak_miejsc?: string;
  czy_promowany?: string;
  cena?: string;
  najnizsza_cena?: string;
  obrazek?: string;
  znizka_dla_absolwentow?: string;
  zakonczony?: string;
  trenerzy?: string;
  kurs_b2b?: string;
  page_to_show?: string;
}

export interface ProductStoreAPI {
  id: number;
  name: string;
  categories: ProductStoreAPICategories[],
  price: string;
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  images: ProductStoreAPIImage[],
  date_on_sale_to: string | null;
  meta_data: ProductStoreAPIMetaData[],
  strona_do_wyswietlania: string;
}

export interface ReducedStoreProduct {
  najnizsza_cena?: string;
  trenerzy?: any;
  poziom_zaawansowania?: string;
  lokalizacje?: string[];
  data_najblizszego_wydarzenia?: string;
  obrazek?: string;
}

export interface IReducedPriceProps {
  current_price: string;
  regular_price: string;
  sale_price: string;
  currency_symbol: string;
  on_sale: boolean;
  type: string;
  sale_date: string | null;
}

export interface IReducedProductStoreAPI {
  product_id: number;
  latestPrice: string;
  price: IReducedPriceProps;
  variations?: IReducedProductVariation; 
}

export interface ICheckoutFields {
  address_1: string;
  age: string;
  city: string;
  company?: string;
  education?: string;
  email: string;
  first_name: string;
  how_you_find?: string;
  industry: boolean | string;
  last_name: string;
  nip?: string;
  phone: string;
  postcode: string;
  wantInvoice: boolean | string;
  your_experience?: string;
}

interface IShippingAddress {
  first_name: string;
  last_name: string;
  company: string;
  address_1: string;
  postcode: string;
  city: string;
  state: string;
  country: string;
}

interface IBillingAddress extends IShippingAddress {
  email: string;
  phone: string;
}

export interface ICheckoutFieldsToSend {
  billing_address: IBillingAddress,
  shipping_address: IShippingAddress,
  payment_method: string;
}

export interface ICheckoutResponse {
  data?: any;
  message?: string;
  billing_address: IBillingAddress,
  customer_id: number;
  customer_note: string;
  extensions: any;
  order_id: number;
  order_key:string;
  payment_method: string;
  payment_result: {
    payment_details: {
      key: string;
      value: string;
    }[],
    payment_status: string;
    redirect_url: string;
  },
  shipping_address: IShippingAddress,
  status: string;
}