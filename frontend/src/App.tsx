import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./layouts/Layout";
import './index.css';
import { useAppContext } from "./contexts/AppContext";
import { useAdminContext } from "./contexts/AdminContext";

const Login = lazy(() => import("./pages/user/auth/Login"));
const Search = lazy(() => import("./pages/user/home/Search"));
const Detail = lazy(() => import("./pages/user/home/Detail"));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const Bookings = lazy(() => import("./pages/user/booking/Bookings"));
const BookingResultPage = lazy(() => import("./pages/user/booking/BookingResultPage"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const AddRestaurant = lazy(() => import("./pages/admin/restaurants/AddRestaurant"));
const EditRestaurant = lazy(() => import("./pages/admin/restaurants/EditRestaurant"));
const AddHotel = lazy(() => import("./pages/admin/hotels/AddHotel"));
const EditHotel = lazy(() => import("./pages/admin/hotels/EditHotel"));
const Users = lazy(() => import("./pages/admin/users/Users"));
const Hotels = lazy(() => import("./pages/admin/hotels/Hotels"));
const Restaurants = lazy(() => import("./pages/admin/restaurants/Restaurants"));
const BookingDetails = lazy(() => import("./pages/admin/bookings/Booking Details"));
const BookingsTable = lazy(() => import("./pages/admin/bookings/BookingsTable"));
const Profile = lazy(() => import("./pages/user/home/Profile"));
const Register = lazy(() => import("./pages/user/auth/Register"));
const ResetPassword = lazy(() => import("./pages/user/auth/ResetPassword"));

function App() {
  const { isLoggedIn } = useAppContext();
  const { isAdminLoggedIn } = useAdminContext();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <Layout>
              <p>Home Page</p>
            </Layout>
          } />

          <Route path="/search" element={
            <Layout>
              <Search />
            </Layout>
          } />

          <Route path="/detail/:hotelId" element={
            <Layout>
              <Detail />
            </Layout>
          } />

          <Route path="/reset-password" element={
            <Layout>
              <ResetPassword />
            </Layout>
          } />

          <Route path="/register" element={
            <Layout>
              <Register />
            </Layout>
          } />

          <Route path="/login" element={
            <Layout>
              <Login />
            </Layout>
          } />

          <Route path="/adminLogin" element={
            <Layout>
              <AdminLogin />
            </Layout>
          } />

          {isLoggedIn && (
            <>
              <Route path="/home/account" element={
                <Layout>
                  <Profile />
                </Layout>
              } />

              <Route path="/home/bookings/*" element={
                <Layout>
                  <Bookings />
                </Layout>
              } />

              <Route path="/home/:bookingId/order-result-page" element={
                <Layout>
                  <BookingResultPage />
                </Layout>
              } />
            </>
          )}

          {isAdminLoggedIn && (
            <>
              <Route path="/admin/dashboard" element={
                <Layout>
                  <Dashboard />
                </Layout>
              } />

              <Route path="/admin/add-restaurant" element={
                <Layout>
                  <AddRestaurant />
                </Layout>
              } />

              <Route path="/admin/edit-restaurant/:restaurantId" element={
                <Layout>
                  <EditRestaurant />
                </Layout>
              } />

              <Route path="/admin/add-hotel" element={
                <Layout>
                  <AddHotel />
                </Layout>
              } />

              <Route path="/admin/edit-hotel/:hotelId" element={
                <Layout>
                  <EditHotel />
                </Layout>
              } />

              <Route path="/admin/users" element={
                <Layout>
                  <Users />
                </Layout>
              } />

              <Route path="/admin/hotels" element={
                <Layout>
                  <Hotels />
                </Layout>
              } />

              <Route path="/admin/restaurants" element={
                <Layout>
                  <Restaurants />
                </Layout>
              } />

              <Route path="/admin/booking-details/:bookingId" element={
                <Layout>
                  <BookingDetails />
                </Layout>
              } />

              <Route path="/admin/bookings" element={
                <Layout>
                  <BookingsTable />
                </Layout>
              } />
            </>
          )}

          <Route path="*" element={
            <Layout>
              <p>404 Not Found</p>
            </Layout>
          } />

        </Routes>
      </BrowserRouter>
    </Suspense>
  );
}

export default App;
