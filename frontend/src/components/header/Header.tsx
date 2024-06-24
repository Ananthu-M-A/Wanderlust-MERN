import { Link, NavLink } from 'react-router-dom';
import { useQuery } from 'react-query';
import { useAppContext } from '../../contexts/AppContext';
import { useAdminContext } from '../../contexts/AdminContext';
import { useEffect, useState } from 'react';
import '../../index.css';
import LogoutButton from './LogoutButton';
import * as apiClient from '../../api-client';

const Header = () => {
  const { isLoggedIn } = useAppContext();
  const { isAdminLoggedIn } = useAdminContext();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { data: user } = useQuery("loadAccount", apiClient.loadAccount);

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => { }, [user]);
  const activeClassNameProp = { activeClassName: "active-link" };

  return (
    <div className="bg-white py-4 top-0 z-50">
      <div className="container mx-auto flex justify-between items-center flex-wrap">
        <Link to="/" className="text-3xl text-white font-bold tracking-tight mb-4 md:mb-0">
          <img src="/logonobg2.png" style={{ height: "35px" }} alt="" />
          {isAdminLoggedIn && <span className='text-sm flex'><Link to="/admin/dashboard" >ADMIN</Link></span>}
        </Link>
        <div className="flex flex-col md:flex-row md:items-center md:gap-4">
          {isAdminLoggedIn ? (
            <>
              <div className="relative mb-4 md:mb-0">
                <button className='text-blue-300 font-bold hover:text-white' onClick={handleDropdownToggle}>
                  Dashboard
                </button>
                {isDropdownOpen && (
                  <div className="absolute top-12 md:top-auto right-0 z-10 bg-white border border-gray-200 rounded shadow-md">
                    <ul onClick={() => setIsDropdownOpen(false)}>
                      <li className="px-4 py-2 hover:bg-gray-100"><NavLink to="/admin/dashboard" {...activeClassNameProp}>Dashboard</NavLink></li>
                      <li className="px-4 py-2 hover:bg-gray-100"><NavLink to="/admin/bookings" {...activeClassNameProp}>Bookings</NavLink></li>
                      <li className="px-4 py-2 hover:bg-gray-100"><NavLink to="/admin/hotels" {...activeClassNameProp}>Hotels</NavLink></li>
                      <li className="px-4 py-2 hover:bg-gray-100"><NavLink to="/admin/restaurants" {...activeClassNameProp}>Restaurants</NavLink></li>
                      <li className="px-4 py-2 hover:bg-gray-100"><NavLink to="/admin/users" {...activeClassNameProp}>Users</NavLink></li>
                    </ul>
                  </div>
                )}
              </div>
              <NavLink className='text-blue-300 font-bold hover:text-white' to="/admin/chat" {...activeClassNameProp}>Chat</NavLink>
            </>
          ) : (
            <>
              {!isLoggedIn ? (
                <Link to="/login" className="text-black hover:text-headerColor font-semibold">Login</Link>
              ) : (
                <div className="flex mb-4 md:mb-0">
                  <h5 className="px-4 py-2 hover:bg-gray-100 font-semibold"><Link to="/home/account">Profile</Link></h5>
                  <h5 className="px-4 py-2 hover:bg-gray-100 font-semibold"><Link to="/home/bookings">Bookings</Link></h5>
                  <h5 className="px-4 py-2 hover:bg-gray-100 font-semibold"><Link to="/home/help">Help</Link></h5>
                </div>
              )}
            </>
          )}
          {(isLoggedIn || isAdminLoggedIn) && <LogoutButton isAdmin={isAdminLoggedIn} />}
        </div>
      </div>
    </div>
  );
}

export default Header;
