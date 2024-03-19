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
import AdminLogin from "./pages/AdminLogin";
import { useAdminContext } from "./contexts/AdminContext";
import Users from "./pages/Users";
import Account from "./pages/Profile";
import Restaurants from "./pages/Restaurants";
import AddRestaurant from "./pages/AddRestaurant";
import EditRestaurant from "./pages/EditRestaurant";
import OrderSuccessPage from "./pages/BookingResultPage";
import Orders from "./pages/Bookings";
import OrdersTable from "./pages/BookingsTable";
import Dashboard from "./pages/Dashboard";
import BookingDetails from "./pages/Booking Details";


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

            <Route path="/home/account" element={
              <Layout>
                <Account />
              </Layout>} />

            <Route path="/home/orders/*" element={
              <Layout>
                <Orders />
              </Layout>} />

            <Route path="/home/:bookingId/order-result-page" element={
              <Layout>
                <OrderSuccessPage />
              </Layout>} />
          </>}

          {isAdminLoggedIn && <>
            <Route path="/admin/dashboard" element={
              <Layout>
                <Dashboard />
              </Layout>} />

            <Route path="/admin/add-restaurant" element={
              <Layout>
                <AddRestaurant />
              </Layout>} />

            <Route path="/admin/edit-restaurant/:restaurantId" element={
              <Layout>
                <EditRestaurant />
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

            <Route path="/admin/restaurants" element={
              <Layout>
                <Restaurants />
              </Layout>} />

            <Route path="/admin/booking-details/:bookingId" element={
              <Layout>
                <BookingDetails />
              </Layout>} />

            <Route path="/admin/orders" element={
              <Layout>
                <OrdersTable />
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
