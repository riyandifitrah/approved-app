import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import { useHistory } from "react-router-dom";

export default function Notifikasi() {
  const role = localStorage.getItem("userRole");
  const history = useHistory();
  const [data, setData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  // Fetch data notifikasi
  const fetchData = async () => {
    try {
      const res = await axios.get("/api/transactions/masuk/notif", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (res.data.success) setData(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Hapus notifikasi
  const handleDelete = async () => {
    if (selectedRows.length === 0) return;

    const result = await Swal.fire({
      title: `Yakin ingin menghapus ${selectedRows.length} notifikasi?`,
      text: "Notifikasi yang dihapus tidak bisa dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete("/api/transactions/masuk/notif/delete", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          data: { ids: selectedRows.map((r) => r.id) },
        });
        Swal.fire(
          "Terhapus!",
          `${selectedRows.length} notifikasi berhasil dihapus.`,
          "success"
        );
        setSelectedRows([]);
        fetchData();
      } catch (err) {
        Swal.fire(
          "Gagal",
          "Terjadi kesalahan saat menghapus notifikasi",
          "error"
        );
      }
    }
  };

  const columns = [
    { name: "Judul", selector: (row) => row.judul, sortable: true },
    { name: "Pesan", selector: (row) => row.pesan },
    {
      name: "Tanggal",
      selector: (row) => dayjs(row.created_at).format("DD/MM/YYYY HH:mm"),
      sortable: true,
    },
    { name: "Status", selector: (row) => (row.is_send ? "Terkirim" : "Pending") },
    {
      name: "#",
      cell: (row) => (
        <div className="d-flex gap-1">
          {row.is_send ? (
            <span className="text-success">
              <i className="bi bi-check-circle-fill"></i> Terkirim
            </span>
          ) : (
            <span className="text-warning">
              <i className="bi bi-clock-fill"></i> Pending
            </span>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="container mt-5">
      <div className="card text-white mb-4 gradient-card">
        <div className="card-body text-center py-4">
          <h1 className="card-title mb-0">
            <i className="bi bi-bell-fill"></i>&nbsp;Notifikasi Barang Masuk
          </h1>
        </div>
      </div>

      <div className="card custom-card mb-5">
        <div className="card-header gradient-header text-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            <i className="bi bi-list-check"></i>&nbsp;List Notifikasi
          </h5>
          {role === "admin" && (
            <button
              className="btn btn-sm btn-danger"
              onClick={handleDelete}
              disabled={selectedRows.length === 0}
            >
              <i className="bi bi-trash"></i>&nbsp;Hapus ({selectedRows.length})
            </button>
          )}
        </div>

        <div className="card-body p-4">
          <DataTable
            columns={columns}
            data={data}
            selectableRows={role === "admin"}
            onSelectedRowsChange={({ selectedRows }) =>
              setSelectedRows(selectedRows)
            }
            pagination
            highlightOnHover
            pointerOnHover
            responsive
          />
        </div>
      </div>
    </div>
  );
}
