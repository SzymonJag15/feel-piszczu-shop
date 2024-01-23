import { CookieValueTypes, getCookie } from "cookies-next";
import { reduceProductMetaData, reduceProductTrainer } from "./helpers";
import {
  ICheckoutFieldsToSend,
  IReducedMetaData,
  IReducedProductStoreAPI,
  IReducedProductUpsell,
  ProductStoreAPI,
  ReducedStoreProduct,
} from "./woocommerceTypes";
import { cacheIt } from "./wordpressApi";

export const API_URL_NONCE = "https://shop.codeme.pl/wp-json/wp/v2/wc-nonce";
export const API_STORE_URL_WC = "https://shop.codeme.pl/wp-json/wc/store/v1";
export const API_URL_WC = "https://shop.codeme.pl/wp-json/wc/v3";
export const API_URL_PODS = "https://shop.codeme.pl/wp-json/wp/v2";

// const CLINET_KEY = "ck_4991c01eeeabdfef2de1a0b08fc4eccbd526b0e5";
// const SECRET_KEY = "cs_109dc818f3a027bbeb4b1fb4551460ce2dd036a3";

const CLINET_KEY = "ck_02c46630cacf4faa1eb7bc3cd352e86c3454b980";
const SECRET_KEY = "cs_92bcf58f342d42fa61c5f3db41883b9bd52ece9f";

export const EVENT_CATEGORY_ID = 60;
export const COURSE_CATEGORY_ID = 59;
export const DEFAULT_CATEGORY_ID = 58;

export const ADDITIONAL_FIELDS_WC = [
  "technologie",
  "lokalizacje",
  "poziom_zaawansowania",
  "specjalizacje",
  "tryby_kursu",
  "data_najblizszego_wydarzenia",
  "czy_brak_miejsc",
  "czy_promowany",
  "cena",
  "najnizsza_cena",
  "obrazek",
  "znizka_dla_absolwentow",
  "zakonczony",
  "trenerzy",
  "kurs_b2b",
  "trenerzy",
  "poziom_zaawansowania",
];

let headers = new Headers();

headers.set(
  "Authorization",
  "Basic " + Buffer.from(CLINET_KEY + ":" + SECRET_KEY).toString("base64")
);
headers.set("Content-Type", "application/json");

class WoocomerceWordpressApi {
  constructor() {}

  async getNonce() {
    const data: string = await fetch(`${API_URL_NONCE}`).then((respond) =>
      respond.json()
    );
    return data;
  }

  async getAdditionalProductsFields(fields: string[], id?: number | string) {
    const data = await fetch(
      `${API_URL_WC}/products${id ? `/${id}` : ""}?_fields=${fields
        .map((field) => `${field}`)
        .join(",")}`,
      { headers }
    ).then((respond) => {
      return respond.json();
    });

    return data;
  }

  async getCourseTrainer(id: number | string) {
    const data = await fetch(`${API_URL_PODS}/trener/${id}`).then((respond) =>
      respond.json()
    );

    return reduceProductTrainer(data);
  }

  async getProducts(category?: number | boolean) {
    const FIELDS = [
      "id",
      "name",
      "categories",
      "price",
      "regular_price",
      "sale_price",
      "on_sale",
      "images",
      "strona_do_wyswietlania",
      "date_on_sale_to",
      "meta_data",
    ];

    const data = await fetch(
      `${API_URL_WC}/products?_fields=${FIELDS.map((field) => `${field}`).join(
        ","
      )}${category ? `&category=${category}` : ""}`,
      { headers }
    ).then((respond) => {
      return respond.json();
    });

    const reducedProducts = data.map((product: ProductStoreAPI) => {
      const reducedMetaData: IReducedMetaData = reduceProductMetaData(
        product.meta_data
      );
      return {
        id: product.id,
        slug: product.strona_do_wyswietlania || "",
        title: product.name,
        eventType: product.categories[0]?.name || null,
        specialization: reducedMetaData?.specjalizacje || "",
        level: reducedMetaData?.poziom_zaawansowania || "",
        technology: reducedMetaData?.technologie || "",
        localizations: reducedMetaData?.lokalizacje || [],
        closestDate: reducedMetaData?.data_najblizszego_wydarzenia || "",
        price: {
          current_price: product.price,
          regular_price:
            product.regular_price.length > 0
              ? product.regular_price
              : product.price,
          sale_price: product.sale_price,
          currency_symbol: " zł",
          on_sale: product.on_sale,
          type: !product.on_sale ? "Cena regularna" : "Early Birds",
          sale_date:
            product?.date_on_sale_to &&
            product?.date_on_sale_to
              .split("T")[0]
              .split("-")
              .reverse()
              .join("."),
        },
        latestPrice: reducedMetaData?.najnizsza_cena || "",
        image: product?.images?.[0]?.src || null,
        typeOfCourse: reducedMetaData?.tryby_kursu?.[0] || "",
        isHighlight: reducedMetaData?.czy_promowany === "1",
        isFull: reducedMetaData?.czy_brak_miejsc === "1",
        isB2b: reducedMetaData?.kurs_b2b === "1",
        isDiscountForAbsolvents:
          reducedMetaData?.znizka_dla_absolwentow === "1",
        ended: reducedMetaData?.zakonczony === "1" || false,
      };
    });

    return reducedProducts;
  }

  async getProductByID(id?: number, title?: CookieValueTypes) {
    return await cacheIt("getProductById" + id, async () => {
      let nearestCourse;
      console.log(
        `${API_URL_WC}/products?product=${id}${
          title ? `&search="${title}"` : ""
        }`
      );
      nearestCourse = await fetch(
        `${API_URL_WC}/products?product=${id}${
          title ? `&search="${title}"` : ""
        }`,
        { headers }
      ).then((respond) => respond.json());

      console.log(nearestCourse);

      if (nearestCourse.length > 1) {
        nearestCourse = this.getNearestProduct(nearestCourse);
      }

      return (await this.reduceStoreProduct(
        nearestCourse[0]
      )) as IReducedProductStoreAPI;
    });
  }

  async reduceStoreProduct(product: any) {
    let trainers = [];
    let upsellProducts: IReducedProductUpsell[] = [];

    const {
      najnizsza_cena,
      trenerzy,
      poziom_zaawansowania,
      lokalizacje,
      data_najblizszego_wydarzenia,
    }: ReducedStoreProduct = reduceProductMetaData(product.meta_data);

    if (trenerzy) {
      const trainer = await this.getCourseTrainer(trenerzy);
      trainers.push(trainer);
    }

    if (product?.upsell_ids?.length > 0) {
      upsellProducts = await Promise.all(
        product?.upsell_ids.map(
          async (id: number) => await this.reduceStoreProductUpsell(id)
        )
      );
    }

    return {
      product_id: product.id,
      latestPrice: najnizsza_cena,
      level: poziom_zaawansowania,
      localizations: lokalizacje,
      closestDate: data_najblizszego_wydarzenia,
      image: product?.images ? product?.images?.[0]?.src : product?.image?.src,
      eventType: product?.categories?.[0]?.name || "Kurs",
      upsellProducts: upsellProducts,
      price: {
        current_price: product.price,
        regular_price:
          product.regular_price.length > 0
            ? product.regular_price
            : product.price,
        sale_price: product.sale_price,
        currency_symbol: " zł",
        on_sale: product.on_sale,
        type: !product.on_sale ? "Cena regularna" : "Early Birds",
        sale_date:
          product?.date_on_sale_to &&
          product?.date_on_sale_to.split("T")[0].split("-").reverse().join("."),
      },
      trainers: trainers.length > 0 ? trainers : null,
    } as IReducedProductStoreAPI;
  }

  async reduceStoreProductUpsell(id: number) {
    const FIELDS = [
      "id",
      "name",
      "strona_do_wyswietlania",
      "price",
      "categories",
    ];

    const productUpsell = await fetch(
      `${API_URL_WC}/products/${id}?_fields=${FIELDS.map(
        (field) => `${field}`
      ).join(",")}`,
      { headers }
    ).then((respond) => respond.json());

    const isDefaultCategory = productUpsell?.categories?.find(
      (cat: any) => cat.id === DEFAULT_CATEGORY_ID
    );

    return {
      upsell_id: productUpsell.id,
      upsell_name: productUpsell.name,
      upsell_slug: productUpsell.strona_do_wyswietlania,
      upsell_is_default_cat: !!isDefaultCategory,
      upsell_price: {
        current_price: productUpsell.price,
        currency_symbol: " zł",
      },
    };
  }

  getNearestProduct(products: any) {
    if (products.length === 1) return products[0];
    const currentDate = new Date().getTime();

    const closest = products
      .map((prod: any) => {
        const { data_najblizszego_wydarzenia }: IReducedMetaData =
          reduceProductMetaData(prod.meta_data);
        const startDate = data_najblizszego_wydarzenia?.split("-")[0] || "";

        return {
          ...prod,
          dateToCompare: new Date(startDate).getTime(),
        };
      })
      .filter(
        ({ dateToCompare }: { dateToCompare: number }) =>
          dateToCompare < currentDate
      )
      .reduce((a: any, b: any) =>
        a.dateToCompare - currentDate < b.dateToCompare - currentDate ? a : b
      );

    delete closest.dateToCompare;
    return [closest];
  }

  async sendOrder(fields: ICheckoutFieldsToSend) {
    const cartToken = getCookie("cart-token") as string;
    const nonce = getCookie("nonce") as string;

    const data = await fetch(`${API_STORE_URL_WC}/checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cart-Token": cartToken,
        Nonce: nonce,
      },
      body: JSON.stringify(fields),
    }).then((respond) => respond.json());

    return data;
  }

  async updateOrder(order_id: number, nip: string) {
    await fetch(`${API_URL_WC}/orders/${order_id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify({
        meta_data: [
          {
            key: `_billing_tax_no`,
            value: nip,
          },
        ],
      }),
    }).then((respond) => respond.json());
  }
}

export default new WoocomerceWordpressApi();
export { WoocomerceWordpressApi };
