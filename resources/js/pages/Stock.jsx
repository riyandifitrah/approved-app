import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Katalog() {
  const [barangList, setBarangList] = useState([]);

  useEffect(() => {
    async function fetchStocks() {
      try {
        const res = await axios.get("/api/transactions/stocks", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        if (res.data.success) setBarangList(res.data.data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchStocks();
  }, []);

  return (
    <div className="container mt-5"> 
      <div className="card text-white mb-4 gradient-card"> 
        <div className="card-body text-center py-4"> 
        <h1 className="card-title mb-0"> <i className="bi bi-book"></i>&nbsp;Katalog 
        </h1> 
        </div> 
      </div> 
      <hr />
      <div className="row g-4">
        {barangList.map((barang) => (
          <div key={barang.nomtrans_id} className="col-md-4">
            <div className="card h-100 shadow-sm">
              <img 
                src="/images/box.png" 
                className="card-img-top" 
                alt="Gambar Barang" 
                style={{ height: '150px', objectFit: 'contain', padding: '10px' }}
              />
              <div className="card-body">
                <h5 className="card-title">{barang.nama}</h5>
                <p className="card-text"><strong>Kode:</strong> {barang.kode}</p>
                <p className="card-text"><strong>Jumlah:</strong> {barang.stok}</p>
                <p className="card-text"><strong>Unit:</strong> {barang.unit}</p>
                <p className="card-text"><strong>Lokasi:</strong> {barang.lokasi}</p>
                <span className={`badge ${barang.stok > 0 ? "bg-success" : "bg-danger"}`}>
                  {barang.stok > 0 ? "AVAILABLE" : "OUT OF STOCK"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
