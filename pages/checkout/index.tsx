import React, { useEffect, useState } from "react";
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
import wordpressApi from "../../services/wordpressApi";
import woocommerceApi from "../../services/woocommerceApi";

import {
  EMAIL_REGEXP,
  PHONE_REGEXP,
  sendEmailToNewsletter,
} from "../../components/ModalForms/ContactForm/helpers";
import { ErrorMessage, FormikProvider, useFormik } from "formik";
import { Alert, Col, Container, Form, Row } from "react-bootstrap";
import TextError from "../../components/FreeValuationForm/TextError/TextError";

import CartModal from "../../components/CartModal/CartModal";
import { StickyContainer, Sticky } from "react-sticky";

import styles from "../../styles/checkout.module.css";
import cx from "classnames";
import * as Yup from "yup";
import CheckoutNavInfo from "../../components/CheckoutNavInfo/CheckoutNavInfo";
import { useRouter } from "next/router";
import { ICheckoutResponse } from "../../services/woocommerceTypes";
import { orderFieldsReducer } from "../../services/helpers";
import { useDispatch } from "react-redux";
import { clearCart } from "../../redux/cart.slice";
import ComplicationInfo from "../../components/ComplicationInfo/ComplicationInfo";

const Checkout = ({ menus }: any) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isStkicyBox, setIsStkicyBox] = useState(false);
  const [payButtonLoading, setPayButtonLoading] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [requestStatus, setRequestStatus] = useState<{
    status: string;
    message: string;
  } | null>(null);

  useEffect(() => {
    setIsStkicyBox(window.innerWidth >= 992 ? true : false);
  }, []);

  const formik = useFormik({
    validateOnMount: true,
    initialValues: {
      first_name: "",
      last_name: "",
      phone: "",
      email: "",

      wantInvoice: "",

      company: "",
      address_1: "",
      postcode: "",
      city: "",
      nip: "",

      your_experience: "",
      industry: "",
      how_you_find: "",
      education: "",
      age: "",

      newsletter: "",
      rules: "",
      privacy_policy: "",
    },
    enableReinitialize: true,
    validationSchema: () =>
      Yup.lazy((values) => {
        return Yup.object().shape({
          first_name: Yup.string().required("Pole jest wymagane."),
          last_name: Yup.string().required("Pole jest wymagane."),
          email: Yup.string()
            .matches(EMAIL_REGEXP, "Email jest niepoprawny.")
            .required("Pole jest wymagane."),
          rules: Yup.boolean().required().oneOf([true]),
          privacy_policy: Yup.boolean().required().oneOf([true]),
          phone: Yup.string()
            .matches(
              PHONE_REGEXP,
              "Numer telefonu jest niepoprawny. Poprawna forma: +48123456789"
            )
            .required("Pole jest wymagane."),
        });
      }),
    onSubmit: async (data, actions) => {
      try {
        actions.setSubmitting(true);
        setPayButtonLoading(true);

        const response: ICheckoutResponse = await woocommerceApi.sendOrder(
          orderFieldsReducer(data)
        );
        if (data.newsletter) {
          sendEmailToNewsletter(data.email);
        }

        if (response?.status === "on-hold") {
          if (data.nip) {
            await woocommerceApi.updateOrder(response.order_id, data.nip);
          }

          if (!response.payment_result.redirect_url) {
            router.push({
              pathname: "/checkout/summary",
              query: {
                order_id: response?.order_id,
                order_mail: response?.billing_address?.email,
              },
            });
          }
          router.push(response.payment_result.redirect_url);
          actions.resetForm();
        }

        if (response?.status === "processing") {
          if (response.payment_result.payment_status === "success") {
            router.push({
              pathname: "/checkout/summary",
              query: {
                order_id: response?.order_id,
                order_mail: response?.billing_address?.email,
              },
            });

            dispatch(clearCart());
          }
        }

        if (response?.data?.status === 400) {
          setPayButtonLoading(false);
          setPaymentError(response.message || "Błąd zamówienia.");
        }

        actions.setSubmitting(false);
      } catch (e) {
        setRequestStatus({
          status: "failed",
          message:
            "Wiadomość nie została wysłana. Wystąpił błąd, spróbuj później.",
        });
      }
    },
  });

  return (
    <div>
      <Navigation menu={menus.primary} />
      <main className={styles.main}>
        <Container>
          <Row>
            <Col>
              <CheckoutNavInfo currentStep="2" />
              <ComplicationInfo />
            </Col>
          </Row>
          <StickyContainer className="row">
            <Col lg="8">
              <FormikProvider value={formik}>
                <Form onSubmit={formik.handleSubmit}>
                  <h3
                    className={styles.primaryFormLabel}
                    dangerouslySetInnerHTML={{ __html: "Dane podstawowe" }}
                  />
                  <div className={styles.formColumnFlex}>
                    <Form.Group controlId="formName">
                      <Form.Label className={styles.formLabel}>
                        Imię <span style={{ color: "#ff0000" }}>*</span>
                      </Form.Label>
                      <Form.Control
                        className={styles.formInput}
                        type="text"
                        required
                        name="first_name"
                        placeholder="Jan"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.first_name}
                      />
                      <ErrorMessage name="first_name">
                        {(msg) => <TextError msg={msg} />}
                      </ErrorMessage>
                    </Form.Group>
                    <Form.Group controlId="formSurname">
                      <Form.Label className={styles.formLabel}>
                        Nazwisko <span style={{ color: "#ff0000" }}>*</span>
                      </Form.Label>
                      <Form.Control
                        className={styles.formInput}
                        type="text"
                        required
                        name="last_name"
                        placeholder="Kowalski"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.last_name}
                      />
                      <ErrorMessage name="last_name">
                        {(msg) => <TextError msg={msg} />}
                      </ErrorMessage>
                    </Form.Group>
                  </div>
                  <div className={styles.formColumnFlex}>
                    <Form.Group controlId="formPhone">
                      <Form.Label className={styles.formLabel}>
                        Numer telefonu{" "}
                        <span style={{ color: "#ff0000" }}>*</span>
                      </Form.Label>
                      <Form.Control
                        className={styles.formInput}
                        placeholder="+48123456789"
                        name="phone"
                        required
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.phone}
                      />
                      <ErrorMessage name="phone">
                        {(msg) => <TextError msg={msg} />}
                      </ErrorMessage>
                    </Form.Group>
                    <Form.Group controlId="formEmail">
                      <Form.Label className={styles.formLabel}>
                        Adres e-mail <span style={{ color: "#ff0000" }}>*</span>
                      </Form.Label>
                      <Form.Control
                        className={styles.formInput}
                        type="email"
                        required
                        placeholder="jankowalski@gmail.com"
                        name="email"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.email}
                      />
                      <ErrorMessage name="email">
                        {(msg) => <TextError msg={msg} />}
                      </ErrorMessage>
                    </Form.Group>
                  </div>

                  <Form.Group className={styles.checkboxSection}>
                    <h3
                      className={cx(
                        styles.primaryFormLabel,
                        styles.primaryFormSmallLabel
                      )}
                      dangerouslySetInnerHTML={{
                        __html: "Oświadczenia i zgody",
                      }}
                    />
                    <Form.Check
                      name="rules"
                      onChange={formik.handleChange}
                      value={formik.values.rules}
                      required
                      label={
                        <p className={styles.checkboxText}>
                          Oświadczam, że zapoznałem/am się i akceptuje Regulamin
                          serwisu Codeme.pl
                          <span style={{ color: "#ff0000" }}>*</span>
                        </p>
                      }
                    />
                    <Form.Check
                      name="privacy_policy"
                      onChange={formik.handleChange}
                      value={formik.values.privacy_policy}
                      required
                      label={
                        <p className={styles.checkboxText}>
                          Administratorem danych osobowych jest Fundacja CODE:ME
                          z siedzibą w Gdańsku Aleja Wojska Polskiego 41, 80-268
                          NIP 5842749072. Dane wpisane w formularzu kontaktowym
                          będą przetwarzane w celu udzielenia odpowiedzi na
                          przesłane zapytanie zgodnie z{" "}
                          <a href="#">polityką prywatności</a>.{" "}
                          <span style={{ color: "#ff0000" }}>*</span>
                        </p>
                      }
                    />
                    <Form.Check
                      name="newsletter"
                      onChange={formik.handleChange}
                      value={formik.values.newsletter}
                      label={
                        <p className={styles.checkboxText}>
                          Chcę otrzymywać informację o promocjach, ciekawych
                          wydarzeniach i kursach organizowanych przez Fundację
                          CODE:ME NIP 5842749072, a tym samym zgadzam się na
                          otrzymywanie newslettera na podany przeze mnie adres
                          e-mail. Wiem, że zgodę tę mogę w każdej chwili cofnąć.
                        </p>
                      }
                    />
                  </Form.Group>

                  <Form.Group controlId="formReason">
                    <Form.Check
                      name="wantInvoice"
                      onChange={formik.handleChange}
                      value={formik.values.wantInvoice}
                      label={
                        <p className={styles.checkboxText}>
                          Chcę otrzymać fakturę
                        </p>
                      }
                    />
                  </Form.Group>

                  {formik.values.wantInvoice && (
                    <>
                      <div className={styles.formColumnFlex}>
                        <Form.Group controlId="formCompany">
                          <Form.Label className={styles.formLabel}>
                            Nazwa firmy{" "}
                            <span style={{ color: "#ff0000" }}>*</span>
                          </Form.Label>
                          <Form.Control
                            className={styles.formInput}
                            type="text"
                            name="company"
                            required
                            placeholder="Nazwa firmy"
                            onChange={formik.handleChange}
                            value={formik.values.company}
                          />
                        </Form.Group>
                        <Form.Group controlId="formAddress">
                          <Form.Label className={styles.formLabel}>
                            Adres <span style={{ color: "#ff0000" }}>*</span>
                          </Form.Label>
                          <Form.Control
                            className={styles.formInput}
                            type="text"
                            required
                            name="address_1"
                            placeholder="Sezamkowa 3/5"
                            onChange={formik.handleChange}
                            value={formik.values.address_1}
                          />
                        </Form.Group>
                      </div>

                      <div className={styles.formColumnFlex}>
                        <Form.Group controlId="formPostcode">
                          <Form.Label className={styles.formLabel}>
                            Kod pocztowy{" "}
                            <span style={{ color: "#ff0000" }}>*</span>
                          </Form.Label>
                          <Form.Control
                            className={styles.formInput}
                            type="text"
                            required
                            name="postcode"
                            placeholder="60-123"
                            onChange={formik.handleChange}
                            value={formik.values.postcode}
                          />
                        </Form.Group>
                        <Form.Group controlId="formCity">
                          <Form.Label className={styles.formLabel}>
                            Miasto <span style={{ color: "#ff0000" }}>*</span>
                          </Form.Label>
                          <Form.Control
                            className={styles.formInput}
                            type="text"
                            required
                            name="city"
                            placeholder="Poznań"
                            onChange={formik.handleChange}
                            value={formik.values.city}
                          />
                        </Form.Group>
                      </div>

                      <div className={styles.formColumnFlex}>
                        <Form.Group controlId="formNip">
                          <Form.Label className={styles.formLabel}>
                            NIP <span style={{ color: "#ff0000" }}>*</span>
                          </Form.Label>
                          <Form.Control
                            className={styles.formInput}
                            type="text"
                            required
                            name="nip"
                            placeholder="1483459282"
                            onChange={formik.handleChange}
                            value={formik.values.nip}
                          />
                        </Form.Group>
                      </div>
                    </>
                  )}

                  <div className={styles.moreAboutYouWrapper}>
                    <h3
                      className={styles.primaryFormLabel}
                      dangerouslySetInnerHTML={{
                        __html: "Powiedz nam więcej o sobie",
                      }}
                    />
                    <p
                      className={styles.addInfoTitle}
                      dangerouslySetInnerHTML={{
                        __html:
                          "Będziemy wdzięczni za uzupełnienie poniższych pytań, chcemy poznać Cię<br>jak najlepiej, aby dostosować poziom kursu do całej grupy.",
                      }}
                    />
                  </div>
                  <Form.Group controlId="formYourExperience">
                    <Form.Label className={styles.formLabel}>
                      Twoje dotychczasowe doświadczenie z programowaniem /
                      branżą IT
                    </Form.Label>
                    <Form.Control
                      className={styles.formInput}
                      type="text"
                      name="your_experience"
                      placeholder="1483459282"
                      onChange={formik.handleChange}
                      value={formik.values.your_experience}
                    />
                  </Form.Group>

                  <Form.Group controlId="formIndustry">
                    <Form.Label className={styles.formLabel}>
                      W jakiej branży pracujesz
                    </Form.Label>
                    <div className={styles.radiosWrapper}>
                      {[
                        "IT",
                        "Obsługa klienta / Sprzedaż",
                        "Logistyka",
                        "Kadry / HR / Administracja",
                        "Finanse / Bankowość",
                        "Budownictwo / Architektura",
                        "Medycyna / Zdrowie",
                        "Inne",
                      ].map((industry, index) => (
                        <Form.Check
                          id={`industry-${index}`}
                          name="industry"
                          inline
                          onChange={formik.handleChange}
                          value={industry}
                          label={industry}
                        />
                      ))}
                    </div>
                  </Form.Group>

                  <Form.Group controlId="formHowYouFind">
                    <Form.Label className={styles.formLabel}>
                      Skąd dowiedziałeś się o kursie
                    </Form.Label>
                    <Form.Control
                      className={styles.formInput}
                      as="select"
                      name="how_you_find"
                      onChange={formik.handleChange}
                      value={formik.values.how_you_find}
                    >
                      {[
                        "Test",
                        "Test 1",
                        "Test 2",
                        "Test 3",
                        "Test 4",
                        "Test 5",
                      ].map((value) => (
                        <option>{value}</option>
                      ))}
                    </Form.Control>
                  </Form.Group>

                  <div className={styles.formColumnFlex}>
                    <Form.Group controlId="formEducation">
                      <Form.Label className={styles.formLabel}>
                        Wykształcenie
                      </Form.Label>
                      <Form.Control
                        className={styles.formInput}
                        as="select"
                        name="education"
                        onChange={formik.handleChange}
                        value={formik.values.education}
                      >
                        {[
                          "Podstawowe",
                          "Średnie",
                          "Policealne",
                          "Wyższe zawodowe",
                          "Wyższe magisterskie",
                          "Wyższe magisterskie inżynierskie",
                        ].map((value) => (
                          <option>{value}</option>
                        ))}
                      </Form.Control>
                    </Form.Group>

                    <Form.Group controlId="formAge">
                      <Form.Label className={styles.formLabel}>Wiek</Form.Label>
                      <Form.Control
                        className={styles.formInput}
                        as="select"
                        name="age"
                        onChange={formik.handleChange}
                        value={formik.values.age}
                      >
                        {[
                          "< 18",
                          "18 - 24 lat",
                          "25 - 39 lat",
                          "40 - 55 lat",
                          "> 55 lat",
                        ].map((value) => (
                          <option>{value}</option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                  </div>

                  <div className={styles.buttonWrapper}>
                    {requestStatus && (
                      <Alert
                        className={styles.alert}
                        variant={
                          requestStatus.status === "mail_sent"
                            ? "success"
                            : "danger"
                        }
                      >
                        {requestStatus.message}
                      </Alert>
                    )}
                    <button
                      className={cx("sendOrderButton", styles.sendOrderButton)}
                      type="submit"
                    />
                  </div>
                </Form>
              </FormikProvider>
            </Col>
            <Col lg="4">
              <Sticky disableCompensation={!isStkicyBox} topOffset={-70}>
                {({ style, isSticky }) => (
                  <div
                    className={styles.sidebar}
                    style={
                      isStkicyBox
                        ? { ...style, paddingTop: isSticky ? "70px" : "0px" }
                        : {}
                    }
                  >
                    <CartModal
                      isOnCheckout
                      modalShow={true}
                      payButtonLoading={payButtonLoading}
                      payButtonDisabled={
                        Object.values(formik.errors).length > 0
                      }
                      errorMessage={paymentError}
                    />
                  </div>
                )}
              </Sticky>
            </Col>
          </StickyContainer>
        </Container>
      </main>
      <Footer menu={menus.footer1} forStudent={menus.footer2} />
    </div>
  );
};

export default Checkout;

export async function getServerSideProps() {
  let menus = {};

  try {
    [menus] = await Promise.all([wordpressApi.getMenus()]);
  } catch (error) {
    console.log(error);
    return {
      notFound: true,
    };
  }
  return {
    props: {
      menus: menus,
    },
  };
}
