import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
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

function App() {
  const { isLoggedIn } = useAppContext();

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

          {isLoggedIn && <>
            <Route path="/home/:hotelId/booking" element={
              <Layout>
                <Booking />
              </Layout>} />

            <Route path="/add-hotel" element={
              <Layout>
                <AddHotel />
              </Layout>} />

            <Route path="/edit-hotel/:hotelId" element={
              <Layout>
                <EditHotel />
              </Layout>} />

            <Route path="/hotels" element={
              <Layout>
                <Hotels />
              </Layout>} />
          </>}

          <Route path="*" element={<Navigate to="/" />} />

        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;
