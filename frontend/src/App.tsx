import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./layouts/Layout";
import './index.css';
import Login from "./pages/user/auth/Login";
import { useAppContext } from "./contexts/AppContext";
import { useAdminContext } from "./contexts/AdminContext";
import Search from "./pages/user/home/Search";
import Detail from "./pages/user/home/Detail";
import AdminLogin from "./pages/admin/AdminLogin";
import Bookings from "./pages/user/booking/Bookings";
import BookingResultPage from "./pages/user/booking/BookingResultPage";
import Dashboard from "./pages/admin/Dashboard";
import AddRestaurant from "./pages/admin/restaurants/AddRestaurant";
import EditRestaurant from "./pages/admin/restaurants/EditRestaurant";
import AddHotel from "./pages/admin/hotels/AddHotel";
import EditHotel from "./pages/admin/hotels/EditHotel";
import Users from "./pages/admin/users/Users";
import Hotels from "./pages/admin/hotels/Hotels";
import Restaurants from "./pages/admin/restaurants/Restaurants";
import BookingDetails from "./pages/admin/bookings/Booking Details";
import BookingsTable from "./pages/admin/bookings/BookingsTable";
import Profile from "./pages/user/home/Profile";
import Register from "./pages/user/auth/Register";


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

          {/* <Route path="/search-restaurants" element={
            <Layout>
              <SearchRestaurants />
            </Layout>} /> */}

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
                <Profile />
              </Layout>} />

            <Route path="/home/bookings/*" element={
              <Layout>
                <Bookings />
              </Layout>} />

            <Route path="/home/:bookingId/order-result-page" element={
              <Layout>
                <BookingResultPage />
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

            <Route path="/admin/bookings" element={
              <Layout>
                <BookingsTable />
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
