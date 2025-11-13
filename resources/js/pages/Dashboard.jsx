// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { Card, Row, Col } from "react-bootstrap";
import axios from "axios";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function Dashboard() {
  const [stats, setStats] = useState({
    masuk: 0,
    keluar: 0,
    stock: 0,
    notifikasi: 0,
  });

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await axios.get("/api/transactions/dashboard", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (res.data.success) {
          setStats(res.data.data);
        }
      } catch (err) {
        console.error(err);
      }
    }

    fetchDashboard();
  }, []);

  return (
    <div className="container-fluid py-4">

      <Row className="g-4 mb-4 mt-4">
        <Col md={6} xl={3}>
          <Card className="shadow-sm border-0">
            <Card.Body className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="text-muted">Barang Masuk</h6>
                <h3 className="fw-bold text-primary mb-0">{stats.masuk}</h3>
              </div>
              <i className="bi bi-box-arrow-in-down fs-2 text-primary"></i>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} xl={3}>
          <Card className="shadow-sm border-0">
            <Card.Body className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="text-muted">Barang Keluar</h6>
                <h3 className="fw-bold text-danger mb-0">{stats.keluar}</h3>
              </div>
              <i className="bi bi-box-arrow-up fs-2 text-danger"></i>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} xl={3}>
          <Card className="shadow-sm border-0">
            <Card.Body className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="text-muted">Stok Barang</h6>
                <h3 className="fw-bold text-success mb-0">{stats.stock}</h3>
              </div>
              <i className="bi bi-stack fs-2 text-success"></i>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} xl={3}>
          <Card className="shadow-sm border-0">
            <Card.Body className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="text-muted">Notifikasi</h6>
                <h3 className="fw-bold text-info mb-0">{stats.notifikasi}</h3>
              </div>
              <i className="bi bi-bell-fill fs-2 text-info"></i>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <div className="text-center text-muted mt-5 small">
        © 2025 Sistem Approval Barang — Dibuat dengan oleh Tim IT
      </div>
    </div>
  );
}
