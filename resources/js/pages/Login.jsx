import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:8000/api/login", {
        username,
        password,
      });

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: res.data.message || "Login berhasil!",
        showConfirmButton: false,
        timer: 1500,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userRole", res.data.user.role);
      localStorage.setItem("username", res.data.user.username);


      setTimeout(() => (window.location.href = "/app/dashboard"), 1500);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Login gagal!",
        text: err.response?.data?.message || "Username atau password salah.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-primary d-flex align-items-center justify-content-center min-vh-100">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-10 col-lg-12 col-md-9">
            <div className="card o-hidden border-0 shadow-lg my-5">
              <div className="card-body p-0">
                <div className="row">
                  {/* Gambar samping */}
                  <div className="col-lg-6 d-none d-lg-block bg-login-image" />

                  {/* Form login */}
                  <div className="col-lg-6">
                    <div className="p-5">
                      <div className="text-center">
                        <h1 className="h4 text-gray-900 mb-4">
                          <i className="bi bi-door-open-fill"></i>&nbsp;Login
                        </h1>
                      </div>

                      <form onSubmit={handleSubmit}>
                        <div className="form-group">
                          <input
                            type="text"
                            className="form-control form-control-user"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                          />
                        </div>

                        <div className="form-group mt-3">
                          <input
                            type="password"
                            className="form-control form-control-user"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                          />
                        </div>

                        <hr />
                        <button
                          type="submit"
                          className="btn btn-primary btn-user btn-block"
                          disabled={loading}
                        >
                          {loading ? "Loading..." : "Login"}
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> 
    </div>
  );
}
