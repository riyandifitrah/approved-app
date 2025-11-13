import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";
import Swal from "sweetalert2";
import dayjs from "dayjs";

export default function ApprovalList() {
  const role = localStorage.getItem("userRole");
  const [data, setData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  const fetchData = async () => {
    try {
      const res = await axios.get("/api/transactions/approvals", {
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

  const handleDelete = async () => {
    if (selectedRows.length === 0) return;

    const result = await Swal.fire({
      title: `Yakin ingin menghapus ${selectedRows.length} approval?`,
      text: "Data yang dihapus tidak bisa dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete("/api/transactions/approvals/delete", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          data: { ids: selectedRows.map(r => r.id) },
        });
        Swal.fire(
          "Terhapus!",
          `${selectedRows.length} approval berhasil dihapus.`,
          "success"
        );
        setSelectedRows([]);
        fetchData();
      } catch (err) {
        Swal.fire("Gagal", "Terjadi kesalahan saat menghapus approval", "error");
      }
    }
  };

  const columns = [
    { name: "Transaksi", selector: row => row.transaction?.nomtrans || "-", sortable: true },
    { name: "User", selector: row => row.user?.name || "-", sortable: true },
    { name: "Tipe", selector: row => row.transaction?.tipe || "-", sortable: true },
    { name: "Catatan", selector: row => row.catatan || "-" },
    {
      name: "Tanggal Approve",
      selector: row => row.tanggal_approve ? dayjs(row.tanggal_approve).format("DD/MM/YYYY HH:mm") : "-",
      sortable: true
    },
    {
      name: "#",
      cell: row => (
        <span className={
          row.status === 'approved' ? "text-success" :
          row.status === 'rejected' ? "text-danger" : "text-warning"
        }>
          {row.status === 'approved' ? '✔ Approved' : row.status === 'rejected' ? '✖ Rejected' : '⌛ Pending'}
        </span>
      )
    }
  ];

  return (
    <div className="container mt-5">
      <div className="card text-white mb-4 gradient-card">
        <div className="card-body text-center py-4">
          <h1 className="card-title mb-0">
            <i className="bi bi-list-check"></i>&nbsp;List Approval
          </h1>
        </div>
      </div>

      <div className="card custom-card mb-5">
        <div className="card-header gradient-header text-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            <i className="bi bi-list-check"></i>&nbsp;Approval
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
            onSelectedRowsChange={({ selectedRows }) => setSelectedRows(selectedRows)}
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
