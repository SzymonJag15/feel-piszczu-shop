import React, { useCallback, useEffect } from "react";
import { Container, Col, Row } from "react-bootstrap";

import Navigation from "../../../components/Navigation";
import Footer from "../../../components/Footer";

import WordpressApi, { Menus } from "../../../services/wordpressApi";
import styles from "../../../styles/checkout.module.css";
import { useRouter } from "next/router";
import { deleteCookie, getCookie } from "cookies-next";

interface ISummaryCheckoutProps {
  menus: Menus;
  order_id: string;
  order_mail: string;
}

const SummaryCheckout = ({
  menus,
  order_id,
  order_mail,
}: ISummaryCheckoutProps) => {
  const router = useRouter();

  const fetchNonce = useCallback(
    async () => await fetch("/api/getNonce?refresh=true"),
    []
  );
  const fetchCartToken = useCallback(
    async () => await fetch("/api/getCartToken"),
    []
  );

  useEffect(() => {
    deleteCookie("nonce");
    fetchNonce();
    fetchCartToken();
  }, []);

  return (
    <div>
      <Navigation menu={menus.primary} />
      <main className={styles.SummaryCheckout}>
        <Container>
          <Row>
            <Col>
              <div className={styles.topContent}>
                <img
                  className={styles.confirmIcon}
                  src={require("../assets/confirm-ico.svg")}
                />
                <h2 className={styles.primaryLabel}>
                  Dziękujemy za dołączenie do kursów
                </h2>
                <p className={styles.textInfo}>
                  Potwierdzenie rejestracji zostało wysłane na Twój adres e-mail{" "}
                  <span className={styles.textInfoBold}>{order_mail}</span>
                </p>
                <p className={styles.textInfo}>
                  Numer Twojego zamówienia:{" "}
                  <span className={styles.textInfoBold}>{order_id}</span>
                </p>
                <button
                  className={styles.continueShopButton}
                  onClick={(e) => {
                    e.preventDefault();
                    router.push("/kursy");
                  }}
                >
                  Kontynuuj przeglądanie
                </button>
              </div>
            </Col>
          </Row>
        </Container>
      </main>
      <Footer menu={menus.footer1} forStudent={menus.footer2} />
    </div>
  );
};

export default SummaryCheckout;

export async function getServerSideProps({
  query: { order_id, order_mail },
}: any) {
  let menus = {};

  try {
    [menus] = await Promise.all([WordpressApi.getMenus()]);
  } catch (error) {
    console.log(error);
    return {
      notFound: true,
    };
  }
  return {
    props: {
      menus: menus,
      order_id,
      order_mail,
    },
  };
}
