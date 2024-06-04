import React from "react";
import { Route, Routes } from "react-router-dom";
import DashboardOverview from "../pages/DashboardOverview";
import MyRaffles from "../pages/MyRaffles";
import Earnings from "../pages/Earnings";
import Settings from "../pages/Settings";
import MisRifas from "./MisRifas";

const DashboardRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<DashboardOverview />} />
      <Route path="/:user_id/my-raffles" element={<MisRifas />} />
      <Route path="earnings" element={<Earnings />} />
      <Route path="settings" element={<Settings />} />
    </Routes>
  );
};

export default DashboardRoutes;
