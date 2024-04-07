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
    <div className="bg-black py-6">
      <div className="container mx-auto flex justify-between items-center flex-wrap">
        <Link to="/" className="text-3xl text-white font-bold tracking-tight mb-4 md:mb-0">
          WANDERLUST
          {isAdminLoggedIn && <span className='text-xl'><Link to="/admin/dashboard" >ADMIN</Link></span>}
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
                <Link to="/login" className="text-blue-300 font-bold hover:text-white">Login</Link>
              ) : (
                <div className="relative mb-4 md:mb-0">
                  <button className="text-gray-600" onClick={handleDropdownToggle}>
                    <img className="h-10 w-10 object-cover rounded-full" src={user && user.imageUrl ? user.imageUrl : `/user.png`} alt="Profile" />
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute top-12 md:top-auto right-0 z-10 bg-white border border-gray-200 rounded shadow-md">
                      <ul onClick={() => setIsDropdownOpen(false)}>
                        <li className="px-4 py-2 hover:bg-gray-100"><Link to="/home/account">Profile</Link></li>
                        <li className="px-4 py-2 hover:bg-gray-100"><Link to="/home/bookings">Bookings</Link></li>
                        <li className="px-4 py-2 hover:bg-gray-100"><Link to="/home/help">Help</Link></li>
                      </ul>
                    </div>
                  )}
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
