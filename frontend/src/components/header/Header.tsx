import { Link } from 'react-router-dom';
import '../../index.css';
import { useAppContext } from '../../contexts/AppContext';
import LogoutButton from './LogoutButton';
import { useAdminContext } from '../../contexts/AdminContext';
import { useQuery } from 'react-query';
import * as apiClient from '../../api-client';
import { useEffect, useState } from 'react';

const Header = () => {
  const { isLoggedIn } = useAppContext();
  const { isAdminLoggedIn } = useAdminContext();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const { data: user } = useQuery("loadAccount", apiClient.loadAccount,
    {
      onSuccess: () => { },
      onError: () => { }
    }
  );

  useEffect(() => {
  }, [user]);

  return (
    <div className="bg-black py-6">
      <div className="container mx-auto flex justify-between">
        <span className="text-3xl text-white font-bold tracking-tight">
          <Link to="/">WANDERLUST</Link>
          {isAdminLoggedIn && <p className='text-xl'>ADMIN</p>}
        </span>
        < span className='flex space-x-2'>
          {isAdminLoggedIn ? (<>
            <Link to="/admin/dashboard"
              className='flex items-center text-blue-300 px-3 font-bold hover:text-white'>Dashboard</Link>
            <Link to="/admin/bookings"
              className='flex items-center text-blue-300 px-3 font-bold hover:text-white'>Bookings</Link>
            <Link to="/admin/hotels"
              className='flex items-center text-blue-300 px-3 font-bold hover:text-white'>Hotels</Link>
            <Link to="/admin/restaurants"
              className='flex items-center text-blue-300 px-3 font-bold hover:text-white'>Restaurants</Link>
            <Link to="/admin/users"
              className='flex items-center text-blue-300 px-3 font-bold hover:text-white'>Users</Link>
            <LogoutButton isAdmin={true} />
          </>) : (<>
            {!isLoggedIn ? (
              <Link to="/login"
                className='flex items-center text-blue-300 px-3 font-bold hover:text-white'>Login</Link>
            ) : (<>
              <span className='flex space-x-2'>
                <div className="flex items-center justify-center relative">
                  <div className="h-10 w-10 overflow-hidden bg-gray-300 flex-shrink-0">
                    {user && <img className="h-full w-full object-cover"
                      src={user.imageUrl ? user.imageUrl : `/user.png`} alt="Profile Picture" />}
                  </div>
                  <button className='text-gray-600' onClick={handleDropdownToggle}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                      <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-.53 14.03a.75.75 0 0 0 1.06 0l3-3a.75.75 0 1 0-1.06-1.06l-1.72 1.72V8.25a.75.75 0 0 0-1.5 0v5.69l-1.72-1.72a.75.75 0 0 0-1.06 1.06l3 3Z" clipRule="evenodd" />
                    </svg>
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute top-12 right-0 z-10 bg-white border border-gray-200 rounded shadow-md">
                      <ul onClick={() => { setIsDropdownOpen(!isDropdownOpen) }}>
                        <li className="px-4 py-2 cursor-pointer hover:bg-gray-100">
                          <Link to="/home/account">Profile</Link></li>
                        <li className="px-4 py-2 cursor-pointer hover:bg-gray-100">
                          <Link to="/home/bookings">Bookings</Link></li>
                        <LogoutButton isAdmin={false} />
                      </ul>
                    </div>
                  )}
                </div>
              </span>
            </>)}
          </>)}
        </span>
      </div>
    </div >
  )
}

export default Header;
