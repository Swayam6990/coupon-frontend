import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Button, Alert, Spinner } from "react-bootstrap";

const API_URL = "https://coupon-backend-ln8x.onrender.com/"; // ✅ Use your Render backend URL

const App = () => {
  const [coupons, setCoupons] = useState([]);
  const [claimedCoupon, setClaimedCoupon] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    axios.get(`${API_URL}/coupons`).then((res) => {
      setCoupons(res.data);
    });
  }, []);

  const claimCoupon = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(`${API_URL}/claim`, {}, { withCredentials: true });
      setClaimedCoupon(res.data.coupon);
      setCoupons(coupons.filter((c) => c.id !== res.data.coupon.id));
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
    }
    setLoading(false);
  };

  return (
    <Container className="text-center mt-5">
      <h1 className="text-primary mb-3">Coupon Distribution System</h1>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      {claimedCoupon ? (
        <Alert variant="success">
          <strong>Coupon Code:</strong> {claimedCoupon.code}
        </Alert>
      ) : (
        <Button variant="success" onClick={claimCoupon} disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" /> : "Claim Coupon"}
        </Button>
      )}

      <div className="mt-4">
        <h5>Available Coupons:</h5>
        <ul className="list-group">
          {coupons.length === 0 ? (
            <p>No coupons available</p>
          ) : (
            coupons.map((coupon) => (
              <li key={coupon.id} className="list-group-item">
                {coupon.code}
              </li>
            ))
          )}
        </ul>
      </div>
    </Container>
  );
};

export default App;
