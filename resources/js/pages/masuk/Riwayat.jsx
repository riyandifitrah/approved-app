import React, { useState, useEffect } from "react";
import { useHistory } from 'react-router-dom';
import DataTable from "react-data-table-component";
import axios from "axios";
import Swal from "sweetalert2";
import dayjs from "dayjs";

export default function Riwayat() {
  const role = localStorage.getItem("userRole");
  const history = useHistory();
  const [filterText, setFilterText] = useState("");
  const [data, setData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  const fetchData = async () => {
    try {
      const res = await axios.get("/api/transactions/masuk", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (res.data.success) setData(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };
  const filteredData = data.filter(
    item => item.nama && item.nama.toLowerCase().includes(filterText.toLowerCase())
      || item.nomtrans && item.nomtrans.toLowerCase().includes(filterText.toLowerCase())
  );

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async () => {
    if (selectedRows.length === 0) return;

    const result = await Swal.fire({
      title: `Yakin ingin menghapus ${selectedRows.length} data?`,
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
        await axios.delete("/api/transactions/masuk/delete", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          data: { ids: selectedRows.map(r => r.id) },
        });
        Swal.fire(
          "Terhapus!",
          `${selectedRows.length} data berhasil dihapus.`,
          "success"
        );
        setSelectedRows([]);
        fetchData();
      } catch (err) {
        Swal.fire("Gagal", "Terjadi kesalahan saat menghapus data", "error");
      }
    }
  };

  const handleTambah = () => {
    history.push("/barang-masuk/form");
  };

  const handleEdit = (nomtrans) => {
    history.push(`/barang-masuk/detail/${nomtrans}`);
  };
  const handleApprove = async (nomtrans) => {
    try {
      await axios.put(`/api/transactions/masuk/update-status/${nomtrans}`, { status: 'approved' }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      Swal.fire('Berhasil', 'Transaksi disetujui', 'success');
      fetchData();
    } catch(err) {
      Swal.fire('Gagal', 'Terjadi kesalahan', 'error');
    }
  };
  const handleReject = async (nomtrans) => {
    const { value: catatan } = await Swal.fire({
      title: 'Tolak Transaksi',
      input: 'textarea',
      inputLabel: 'Alasan Penolakan',
      inputPlaceholder: 'Masukkan catatan alasan penolakan di sini...',
      inputAttributes: {
        'aria-label': 'Alasan penolakan'
      },
      showCancelButton: true,
      confirmButtonText: 'Kirim',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      inputValidator: (value) => {
        if (!value) {
          return 'Catatan wajib diisi!'
        }
      }
    });
  
    if (catatan) {
      try {
        await axios.put(
          `/api/transactions/masuk/update-status/${nomtrans}`,
          { status: 'rejected', catatan },
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
  
        Swal.fire('Berhasil', 'Transaksi berhasil ditolak', 'success');
        fetchData();
      } catch (err) {
        Swal.fire('Gagal', 'Terjadi kesalahan saat menolak transaksi', 'error');
      }
    }
  };
  
  

  const columns = [
    { name: "Nomtrans", selector: row => row.nomtrans, sortable: true},
    { name: "Nama", selector: row => row.nama, sortable: true },
    { name: "Unit", selector: row => row.unit  },
    { name: "Lokasi", selector: row => row.lokasi },
    { name: "Tanggal", selector: row => dayjs(row.tanggal).format("DD/MM/YYYY") },
    { name: "Expired", selector: row => dayjs(row.expired).format("DD/MM/YYYY") },
    { name: "Status", selector: row => row.status, width: "10%"  },
    { name: "Keterangan", selector: row => row.keterangan },
    {
      name: "#",
      cell: row => {
        if (row.status === "approved") {
          return (
            <div className="d-flex align-items-center gap-1 text-success">
              <i className="bi bi-check-circle-fill"></i>
              <span>Approved</span>
            </div>
          );
        }
    
        if (row.status === "rejected") {
          return (
            <div className="d-flex align-items-center gap-1 text-danger">
              <i className="bi bi-x-circle-fill"></i>
              <span>Rejected</span>
            </div>
          );
        }
    
        return (
          <div className="d-flex gap-1">
            <button
              className="btn btn-sm btn-primary rounded-circle"
              onClick={() => handleEdit(row.nomtrans)}
              style={{ padding: '0.2rem 0.3rem', fontSize: '0.7rem' }}
            >
              <i className="bi bi-pencil-square"></i>
            </button>
  
            {role === "admin" && (
              <>
                <button
                  className="btn btn-sm btn-success rounded-circle"
                  onClick={() => handleApprove(row.nomtrans)}
                  style={{ padding: '0.2rem 0.3rem', fontSize: '0.7rem' }}
                >
                  <i className="bi bi-check-square-fill"></i>
                </button>
  
                <button
                  className="btn btn-sm btn-danger rounded-circle"
                  onClick={() => handleReject(row.nomtrans)}
                  style={{ padding: '0.2rem 0.3rem', fontSize: '0.7rem' }}
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              </>
            )}
          </div>
        );
      }
    }
  ];

  return (
    <div className="container mt-5">
      <div className="card text-white mb-4 gradient-card">
        <div className="card-body text-center py-4">
          <h1 className="card-title mb-0">
            <i className="bi bi-file-earmark-medical"></i>&nbsp;Data Barang Masuk
          </h1>
        </div>
      </div>

      <div className="card custom-card mb-5">
        <div className="card-header gradient-header text-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            <i className="bi bi-archive-fill"></i>&nbsp;List Transaksi Masuk
          </h5>
          <div>
            <button className="btn btn-sm btn-success me-2" onClick={handleTambah}>
              <i className="bi bi-plus"></i>&nbsp;Tambah
            </button>
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
        </div>

        <div className="card-body p-4">
          <input
            type="text"
            placeholder="Search..."
            value={filterText}
            onChange={e => setFilterText(e.target.value)}
            className="form-control form-control-sm mb-3"
            style={{ maxWidth: '300px' }}
          />
          <DataTable
            columns={columns}
            data={filteredData}
            selectableRowDisabled={row => row.status === 'approved'}
            selectableRows={role === 'admin'}
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
