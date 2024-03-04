import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./layouts/Layout";
import './index.css';
import Register from "./pages/Register";
import Login from "./pages/Login";
import AddHotel from "./pages/AddHotel";
import { useAppContext } from "./contexts/AppContext";
import Hotels from "./pages/Hotels";
import EditHotel from "./pages/EditHotel";
import Search from "./pages/Search";
import Detail from "./pages/Detail";
import Booking from "./pages/Booking";
import AdminLogin from "./pages/AdminLogin";
import { useAdminContext } from "./contexts/AdminContext";
import Users from "./pages/Users";
import Account from "./pages/Profile";


function App() {
  const { isLoggedIn } = useAppContext();
  const { isAdminLoggedIn } = useAdminContext();

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <Layout>
              <p>Home Page</p>
            </Layout>} />

          <Route path="/search" element={
            <Layout>
              <Search />
            </Layout>} />

          <Route path="/detail/:hotelId" element={
            <Layout>
              <Detail />
            </Layout>} />

          <Route path="/register" element={
            <Layout>
              <Register />
            </Layout>} />

          <Route path="/login" element={
            <Layout>
              <Login />
            </Layout>} />

          <Route path="/adminLogin" element={
            <Layout>
              <AdminLogin />
            </Layout>} />

          {isLoggedIn && <>
            <Route path="/home/:hotelId/booking" element={
              <Layout>
                <Booking />
              </Layout>} />

            <Route path="/home/account" element={
              <Layout>
                <Account />
              </Layout>} />
          </>}

          {isAdminLoggedIn && <>
            <Route path="/admin/dashboard" element={
              <Layout>
                <p>Admin Dashboard</p>
              </Layout>} />

            <Route path="/admin/add-hotel" element={
              <Layout>
                <AddHotel />
              </Layout>} />

            <Route path="/admin/edit-hotel/:hotelId" element={
              <Layout>
                <EditHotel />
              </Layout>} />

            <Route path="/admin/users" element={
              <Layout>
                <Users />
              </Layout>} />

            <Route path="/admin/hotels" element={
              <Layout>
                <Hotels />
              </Layout>} />
          </>}

          <Route path="*" element={
            <Layout>
              <p>404 Not Found</p>
            </Layout>} />

        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;
