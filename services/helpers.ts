import { ADDITIONAL_FIELDS_WC } from "./woocommerceApi";
import { ICheckoutFields, ICheckoutFieldsToSend } from "./woocommerceTypes";

export const reduceProductMetaData = (meta_data: any) => {
  const additionalFields = meta_data?.filter((field: any) => {
    const searchedField = ADDITIONAL_FIELDS_WC.find((name: string) => name === field.key);
    return searchedField;
  });

  let reducedAdditionalFields = {};
  additionalFields.forEach((field: any) => {
    // @ts-expect-error
    reducedAdditionalFields[field.key] = field.value
  });

  return reducedAdditionalFields;
}

export const reduceProductTrainer = (trainer: any) => ({
  id: trainer.id,
  name: trainer.title.rendered,
  slug: trainer.slug,
  title: trainer['job-title'],
  description: trainer.content.rendered,
  image: trainer.zdjecie.guid,
  linkedinUrl: trainer['linkedin-url'],
});

export const generateOrderNote = (fields: ICheckoutFields) => {
  const note = `
    ${fields?.your_experience && `Dotychczasowe doświadczenie: ${fields?.your_experience}`}
    ${fields?.industry && `Branża: ${fields?.industry}`}
    ${fields?.how_you_find && `Skąd się dowiedziałeś: ${fields?.how_you_find}`}
    ${fields?.education && `Wykształcenie: ${fields?.education}`}
    ${fields?.age && `Wiek: ${fields?.age}`}
  `

  const reducedNote = note.split(/\r?\n/).filter(line => line.trim() !== '').join('\n');
  return reducedNote;
}

export const orderFieldsReducer = (fields: ICheckoutFields) =>
  ({
    billing_address: {
      first_name: fields.first_name,
      last_name: fields.last_name,
      email: fields.email,
      phone: fields.phone,
      company: fields?.company,
      address_1: fields?.wantInvoice ? fields?.address_1 : "",
      postcode: fields?.wantInvoice ? fields?.postcode : "",
      city: fields?.wantInvoice ? fields?.city : "",
      state: "PL",
      country: "PL",
    },
    shipping_address: {
      first_name: fields.first_name,
      last_name: fields.last_name,
      company: fields?.company,
      address_1: fields?.address_1,
      postcode: fields?.postcode,
      city: fields?.city,
      state: "PL",
      country: "PL",
    },
    payment_method: "payustandard",

    customer_note: generateOrderNote(fields),

    ...(fields?.wantInvoice && {
      _billing_company_name: fields?.company,
      _billing_tax_no: fields?.nip,
      _billing_company_address: fields?.address_1,
      _billing_company_postcode: fields?.postcode,
      _billing_company_city: fields?.city,
    }),
  } as ICheckoutFieldsToSend);