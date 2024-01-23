import React, { useEffect } from "react";
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
import WordpressApi from "../../services/wordpressApi";
import { useSelector } from "react-redux";
import CartElements from "../../components/CartElements/CartElements";
import AddCoupon from "../../components/AddCoupon/AddCoupon";
import { Col, Container, Row } from "react-bootstrap";
import CartSummary from "../../components/CartSummary/CartSummary";
import CartNavigation from "../../components/CartNavigation/CartNavigation";

import styles from "../../styles/cart.module.css";
import ComplicationInfo from "../../components/ComplicationInfo/ComplicationInfo";

const Cart = ({ menus }: any) => {
  const { cart } = useSelector((state: any) => state.cart);

  return (
    <div>
      <Navigation menu={menus.primary} />
      <main className={styles.cart}>
        <Container>
          <Row>
            <Col>
              <h2 dangerouslySetInnerHTML={{ __html: "Koszyk" }} />
              <CartElements isOnCart products={cart.items} />
              <div className={styles.summaryRow}>
                <AddCoupon />
                <CartSummary />
              </div>
              <CartNavigation />
              <ComplicationInfo />
            </Col>
          </Row>
        </Container>
      </main>
      <Footer menu={menus.footer1} forStudent={menus.footer2} />
    </div>
  );
};

export default Cart;

export async function getServerSideProps({}: any) {
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
    },
  };
}
