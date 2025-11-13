import React from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import FormMasuk from "../pages/masuk/Form";
import RiwayatMasuk from "../pages/masuk/Riwayat";
import NotifMasuk from "../pages/masuk/Notifikasi";
import FormKeluar from "../pages/keluar/Form";
import RiwayatKeluar from "../pages/keluar/Riwayat";
import NotifKeluar from "../pages/keluar/Notifikasi";
import ApprovalList from "../pages/ApprovalList";
import StockList from "../pages/Stock";
import FormDetailMasuk from "../pages/masuk/Detail";
import FormDetailKeluar from "../pages/keluar/Detail";

export default function AppRouter() {
  return (
    <Router>
      <Switch>
        <Route exact path="/login" component={Login} />
        <Route exact path="/" render={() => <Redirect to="/login" />} />

        <Route>
          <AppLayout>
            <Switch>
              <Route exact path="/app/dashboard" component={Dashboard} />

              <Route exact path="/barang-masuk/form" component={FormMasuk} />
              <Route exact path="/barang-masuk/data" component={RiwayatMasuk} />
              <Route exact path="/barang-masuk/notifikasi" component={NotifMasuk} />
              <Route exact path="/barang-masuk/detail/:nomtrans" component={FormDetailMasuk} />

              <Route exact path="/barang-keluar/form" component={FormKeluar} />
              <Route exact path="/barang-keluar/detail/:nomtrans" component={FormDetailKeluar} />
              <Route exact path="/barang-keluar/data" component={RiwayatKeluar} />
              <Route exact path="/barang-keluar/notifikasi" component={NotifKeluar} />

              <Route exact path="/approval-list" component={ApprovalList} />
              <Route exact path="/stock-list" component={StockList} />
            </Switch>
          </AppLayout>
        </Route>
      </Switch>
    </Router>
  );
}
