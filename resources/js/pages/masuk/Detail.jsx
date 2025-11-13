import { useParams, useHistory } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import Swal from 'sweetalert2';
import '../../css/Card.css';
import '../../css/Form.css';

export default function Detail() {
    const { nomtrans } = useParams();
    const history = useHistory();
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
const handleKembali = () => {
    history.push("/barang-masuk/data")
};

useEffect(() => {
    async function fetchData() {
        try {
        const res = await axios.get(`/api/transactions/masuk/detail/${nomtrans}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        if (res.data) setForm(res.data);
        } catch (err) {
            console.error(err);
            Swal.fire('Gagal', 'Tidak dapat mengambil data transaksi', 'error');
        }
    }
    fetchData();
}, [nomtrans]);

const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
};

const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const res = await axios.put(`/api/transactions/masuk/update/${nomtrans}`, form, {
        headers: { 
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            Accept: 'application/json'
        }
    });
    Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: res.data.message || 'Data berhasil diupdate',
        timer: 2000,
        showConfirmButton: false
    });
    } catch (err) {
        console.error(err);
        Swal.fire('Gagal', 'Terjadi kesalahan saat update data', 'error');
    }
};

if (!form) return <div>Loading...</div>;

return (
    <div className="container mt-5">
        <div className="card text-white mb-4 gradient-card">
            <div className="card-body text-center py-4">
                <h1 className="card-title mb-0"><i className="bi bi-file-earmark-medical"></i>&nbsp;Edit Barang Masuk</h1>
            </div>
        </div>
        <hr />
        <div className="card custom-card mb-5">
            <div className="card-header gradient-header text-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                    <i className="bi bi-archive-fill"></i>&nbsp;Update Data Transaksi
                </h5>
                <button className="btn btn-warning btn-sm px-4" onClick={handleKembali}><i className="bi bi-arrow-left"></i>&nbsp;Kembali</button>
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
                                readOnly/>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Tanggal Masuk</label>
                                <input 
                                type="date" 
                                name="tanggal" 
                                className="form-control form-control-sm" 
                                value={form.tanggal ? dayjs(form.tanggal).format('YYYY-MM-DD') : ''} 
                                onChange={handleChange} 
                                required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Lokasi</label>
                                <input 
                                type="text" 
                                name="lokasi" 
                                className="form-control form-control-sm" 
                                value={form.lokasi} 
                                onChange={handleChange} 
                                required />
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
                            readOnly/>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Expired</label>
                            <input 
                            type="date" 
                            name="expired" 
                            className="form-control form-control-sm" 
                            value={form.expired ? dayjs(form.expired).format('YYYY-MM-DD') : ''} 
                            onChange={handleChange} 
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
                        ></textarea>
                    </div>
                    <div className="text-center">
                        <button type="submit" className="btn btn-primary btn-sm px-4">Update</button>
                    </div>
                </form> 
            </div>
        </div>
    </div>
    );
}
