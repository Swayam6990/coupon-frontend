import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Button, Alert, Spinner, Card, Modal } from "react-bootstrap";
import { FaGift, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import confetti from "canvas-confetti"; // 🎉 Import confetti effect
import "./styles.css"; // ✅ Custom CSS for more colors

const API_URL = "http://localhost:5000";

const App = () => {
  const [coupons, setCoupons] = useState([]);
  const [claimedCoupon, setClaimedCoupon] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    axios
      .get(`${API_URL}/coupons`, { withCredentials: true })
      .then((res) => {
        setCoupons(res.data);
      })
      .catch(() => {
        setError("Failed to load coupons.");
      });
  }, []);

  const launchConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
      colors: ["#ffcc00", "#ff6699", "#66ccff", "#33cc33"],
    });
  };

  const claimCoupon = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(`${API_URL}/claim`, {}, { withCredentials: true });

      if (res.status === 200) {
        setClaimedCoupon(res.data.coupon);
        setCoupons(coupons.filter((c) => c.id !== res.data.coupon.id));
        setShowModal(true);
        launchConfetti(); // 🎉 Trigger confetti
      } else {
        setError("Failed to claim a coupon. Please try again.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
    }
    setLoading(false);
  };

  return (
    <div className="gradient-bg"> {/* ✅ Beautiful background */}
      <Container className="text-center mt-5">
        <h1 className="title-text">
          <FaGift className="me-2" /> Welcome to the Coupon Hub!
        </h1>

        {error && <Alert variant="danger">{error}</Alert>}

        {coupons.length === 0 ? (
          <Alert variant="warning">
            <FaExclamationTriangle /> <strong>No coupons left!</strong> Stay tuned for more.
          </Alert>
        ) : claimedCoupon ? (
          <Card className="mt-4 p-3 shadow-lg claimed-card">
            <Card.Body>
              <h3 className="text-success">
                <FaCheckCircle /> Congratulations!
              </h3>
              <p className="lead">
                Your exclusive coupon: <strong className="coupon-code">{claimedCoupon.code}</strong>
              </p>
            </Card.Body>
          </Card>
        ) : (
          <Button className="claim-btn" onClick={claimCoupon} disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : "🎁 Claim Your Coupon!"}
          </Button>
        )}

        <div className="mt-4">
          <h5 className="remaining-text">🎟️ Available Coupons: <span className="count">{coupons.length}</span></h5>
          <ul className="list-group coupon-list">
            {coupons.map((coupon) => (
              <li key={coupon.id} className="list-group-item vibrant-list">
                {coupon.code}
              </li>
            ))}
          </ul>
        </div>

        {/* Success Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Body className="text-center">
            <h4 className="text-success">
              <FaCheckCircle /> Success!
            </h4>
            <p>You have successfully claimed a coupon.</p>
            <p>
              <strong>Coupon Code:</strong> <span className="modal-code">{claimedCoupon?.code}</span>
            </p>
            <Button variant="primary" onClick={() => setShowModal(false)}>
              Close
            </Button>
          </Modal.Body>
        </Modal>
      </Container>
    </div>
  );
};

export default App;
