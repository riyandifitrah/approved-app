import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import '../../css/Card.css';
import '../../css/Form.css';

export default function Form() {
  const [form, setForm] = useState({
    nomtrans: '',
    kode: '',
    nama: '',
    jumlah: '',
    tipe: 'masuk',
    unit: '',
    tanggal: '',
    expired: '',
    status: 'pending',
    lokasi: '',
    keterangan: ''
  });
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    async function fetchNomtrans() {
      try {
        const type = '01'; // 01 = masuk, 02 = keluar
        const res = await axios.get(`/api/generate-nomtrans?type=${type}`);
        if(res.data.success) {
          setForm(prev => ({
            ...prev,
            nomtrans: res.data.data.nomtrans,
            kode: res.data.data.kode
          }));
        }
      } catch(err) {
        console.error(err);
      }
    }
    fetchNomtrans();
  }, []);
  
  
  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('/api/transactions/masuk/create', form, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          Accept: 'application/json'
        }
      });
  
      if(res.status === 201 && res.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: res.data.message,
          timer: 2000,
          showConfirmButton: false
        });
  
        setForm(prev => ({
          ...prev,
          unit: '',
          tanggal: '',
          expired: '',
          keterangan: ''
        }));
      }
    } catch(err) {
      console.error(err);
      if(err.response && err.response.status === 422) {
        const messages = Object.values(err.response.data.errors).flat().join('\n');
        Swal.fire({
          icon: 'error',
          title: 'Gagal Validasi',
          html: messages
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Gagal',
          text: 'Terjadi kesalahan saat menyimpan transaksi'
        });
      }
    } finally{
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card text-white mb-4 gradient-card">
        <div className="card-body text-center py-4">
          <h1 className="card-title mb-0">
            <i className="bi bi-file-earmark-medical"></i>&nbsp;Form Barang Masuk
          </h1>
        </div>
      </div>
      <hr />
      <div className="card custom-card mb-5">
        <div className="card-header gradient-header text-white">
          <h5 className="mb-0"><i className="bi bi-archive-fill"></i>&nbsp;Input Data Transaksi</h5>
        </div>
        <div className="card-body p-4">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <div className='mb-3'>
                  <label className="form-label">Nama Barang</label>
                  <input 
                    type="text" 
                    name="nama" 
                    className="form-control form-control-sm" 
                    placeholder='Masukkan Nama'
                    value={form.nama} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Nomor Transaksi</label>
                  <input 
                    type="text" 
                    name="nomtrans" 
                    className="form-control form-control-sm" 
                    value={form.nomtrans} 
                    onChange={handleChange} 
                    readOnly
                    required 
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Tanggal Masuk</label>
                  <input 
                    type="date" 
                    name="tanggal" 
                    className="form-control form-control-sm" 
                    value={form.tanggal} 
                    onChange={handleChange} 
                    required 
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Lokasi</label>
                  <input 
                    type="text" 
                    name="lokasi" 
                    className="form-control form-control-sm" 
                    placeholder='Masukkan Lokasi'
                    value={form.lokasi} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className='mb-3'>
                  <label className="form-label">Jumlah</label>
                  <input 
                    type="number" 
                    name="jumlah" 
                    className="form-control form-control-sm" 
                    placeholder='Masukkan Jumlah'
                    step="1"
                    value={form.jumlah} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Kode</label>
                  <input 
                    type="text" 
                    name="kode" 
                    className="form-control form-control-sm" 
                    value={form.kode} 
                    onChange={handleChange} 
                    readOnly
                    required 
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Expired</label>
                  <input 
                    type="date" 
                    name="expired" 
                    className="form-control form-control-sm" 
                    value={form.expired} 
                    onChange={handleChange} 
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Unit</label>
                  <input 
                    type="text" 
                    name="unit" 
                    className="form-control form-control-sm" 
                    value={form.unit} 
                    onChange={handleChange} 
                    placeholder="Masukkan unit"
                    required 
                  />
                </div>
              </div>
            </div>
            <div className="mb-3 mt-3">
              <label className="form-label">Keterangan</label>
              <textarea 
                name="keterangan" 
                className="form-control form-control-sm" 
                rows="3" 
                value={form.keterangan} 
                onChange={handleChange}
                placeholder="Masukkan keterangan tambahan"
              ></textarea>
            </div>

            <input type="hidden" name="tipe" value="masuk" />
            <input type="hidden" name="status" value="pending" />

            <div className="text-center">
              <button type="submit" className="btn btn-primary btn-sm px-4" disabled={loading}>{loading ? 'Menyimpan...' : 'Simpan'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
