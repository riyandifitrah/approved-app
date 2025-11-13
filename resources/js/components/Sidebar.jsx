import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../css/Sidebar.css";

export default function Sidebar() {
  const role = localStorage.getItem("userRole");
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleMenu = (menu) => setOpenMenu(openMenu === menu ? null : menu);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Hamburger Button (Mobile) */}
      <button className="btn btn-light d-md-none position-fixed top-0 start-0 m-3 z-3" onClick={toggleSidebar}>
        <i className="bi bi-list fs-3"></i>
      </button>

      {/* Sidebar */}
      <div className={`sidebar-container ${sidebarOpen ? "open" : ""}`}>
        <div className="text-center border-bottom py-3 sidebar-title">
          <h4 className="text-dark mb-0">
            <i className="bi bi-box-seam"></i> Approval App
          </h4>
        </div>

        <ul className="list-unstyled mt-3">
          <li>
            <Link
              to="/app/dashboard"
              className={`sidebar-link ${isActive("/app/dashboard") ? "active" : ""}`}
            >
              <i className="bi bi-speedometer2"></i> Dashboard
            </Link>
          </li>

          {role === "admin" && (
            <>
              {/* Barang Masuk */}
              <li className="sidebar-item">
                <button className="sidebar-toggle" onClick={() => toggleMenu("masuk")}>
                  <i className="bi bi-box-arrow-in-down"></i> Barang Masuk
                  <i className={`bi bi-chevron-${openMenu === "masuk" ? "up" : "down"} ms-auto`}></i>
                </button>
                <ul className={`sidebar-submenu ${openMenu === "masuk" ? "show" : ""}`}>
                  <li>
                    <Link to="/barang-masuk/form" className={isActive("/barang-masuk/form") ? "active" : ""}>
                      Form
                    </Link>
                  </li>
                  <li>
                    <Link to="/barang-masuk/data" className={isActive("/barang-masuk/data") ? "active" : ""}>
                      Data
                    </Link>
                  </li>
                  <li>
                    <Link to="/barang-masuk/notifikasi" className={isActive("/barang-masuk/notifikasi") ? "active" : ""}>
                      Notifikasi
                    </Link>
                  </li>
                </ul>
              </li>

              {/* Barang Keluar */}
              <li className="sidebar-item">
                <button className="sidebar-toggle" onClick={() => toggleMenu("keluar")}>
                  <i className="bi bi-box-arrow-up"></i> Barang Keluar
                  <i className={`bi bi-chevron-${openMenu === "keluar" ? "up" : "down"} ms-auto`}></i>
                </button>
                <ul className={`sidebar-submenu ${openMenu === "keluar" ? "show" : ""}`}>
                  <li>
                    <Link to="/barang-keluar/form" className={isActive("/barang-keluar/form") ? "active" : ""}>
                      Form
                    </Link>
                  </li>
                  <li>
                    <Link to="/barang-keluar/data" className={isActive("/barang-keluar/data") ? "active" : ""}>
                      Data
                    </Link>
                  </li>
                  <li>
                    <Link to="/barang-keluar/notifikasi" className={isActive("/barang-keluar/notifikasi") ? "active" : ""}>
                      Notifikasi
                    </Link>
                  </li>
                </ul>
              </li>

              <li>
                <Link
                  to="/approval-list"
                  className={`sidebar-link ${isActive("/approval-list") ? "active" : ""}`}
                >
                  <i className="bi bi-check2-square"></i> Daftar Approval
                </Link>
              </li>
              <li>
                <Link
                  to="/stock-list"
                  className={`sidebar-link ${isActive("/stock-list") ? "active" : ""}`}
                >
                  <i className="bi bi-box2"></i> Stock
                </Link>
              </li>
            </>
          )}
          {role === "user" && (
            <>
              {/* Barang Masuk */}
              <li className="sidebar-item">
                <button className="sidebar-toggle" onClick={() => toggleMenu("masuk")}>
                  <i className="bi bi-box-arrow-in-down"></i> Barang Masuk
                  <i className={`bi bi-chevron-${openMenu === "masuk" ? "up" : "down"} ms-auto`}></i>
                </button>
                <ul className={`sidebar-submenu ${openMenu === "masuk" ? "show" : ""}`}>
                  <li>
                    <Link to="/barang-masuk/form" className={isActive("/barang-masuk/form") ? "active" : ""}>
                      Form
                    </Link>
                  </li>
                  <li>
                    <Link to="/barang-masuk/data" className={isActive("/barang-masuk/data") ? "active" : ""}>
                      Data
                    </Link>
                  </li>
                  <li>
                    <Link to="/barang-masuk/notifikasi" className={isActive("/barang-masuk/notifikasi") ? "active" : ""}>
                      Notifikasi
                    </Link>
                  </li>
                </ul>
              </li>

              {/* Barang Keluar */}
              <li className="sidebar-item">
                <button className="sidebar-toggle" onClick={() => toggleMenu("keluar")}>
                  <i className="bi bi-box-arrow-up"></i> Barang Keluar
                  <i className={`bi bi-chevron-${openMenu === "keluar" ? "up" : "down"} ms-auto`}></i>
                </button>
                <ul className={`sidebar-submenu ${openMenu === "keluar" ? "show" : ""}`}>
                  <li>
                    <Link to="/barang-keluar/form" className={isActive("/barang-keluar/form") ? "active" : ""}>
                      Form
                    </Link>
                  </li>
                  <li>
                    <Link to="/barang-keluar/data" className={isActive("/barang-keluar/data") ? "active" : ""}>
                      Data
                    </Link>
                  </li>
                  <li>
                    <Link to="/barang-keluar/notifikasi" className={isActive("/barang-keluar/notifikasi") ? "active" : ""}>
                      Notifikasi
                    </Link>
                  </li>
                </ul>
              </li>
            </>
          )}

          {/* Logout */}
          <li>
            <button
              className="sidebar-link logout-btn"
              onClick={() => {
                localStorage.clear();
                window.location.href = "/login";
              }}
            >
              <i className="bi bi-box-arrow-right"></i> Logout
            </button>
          </li>
        </ul>
      </div>
    </>
  );
}
