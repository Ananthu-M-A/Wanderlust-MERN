import { Link } from 'react-router-dom';
import '../index.css';
import { useAppContext } from '../contexts/AppContext';
import LogoutButton from '../components/LogoutButton';
import { useAdminContext } from '../contexts/AdminContext';

const Header = () => {
  const { isLoggedIn } = useAppContext();
  const { isAdminLoggedIn } = useAdminContext();

  return (
    <div className="bg-black py-6">
      <div className="container mx-auto flex justify-between">
        <span className="text-3xl text-white font-bold tracking-tight">
          <Link to="/">WANDERLUST</Link>
          {isAdminLoggedIn && <p className='text-xl'>ADMIN</p>}
          {/* <image src='/logo.png' width={'200px'}/> */}
        </span>
        {!isAdminLoggedIn && <>
          <span className='flex space-x-2'>
            <Link to="/login"
              className='flex items-center text-blue-300 hover:text-white px-3 font-bold'>Hotels</Link>
          </span>
          <span className='flex space-x-2'>
            <Link to="/login"
              className='flex items-center text-blue-300 hover:text-white px-3 font-bold'>Restaurants</Link>
          </span>
          <span className='flex space-x-2'>
            <Link to="/login"
              className='flex items-center text-blue-300 hover:text-white px-3 font-bold'>Transits</Link>
          </span>
        </>}
        < span className='flex space-x-2'>
          {isAdminLoggedIn ? (<>
            <Link to="/admin/dashboard"
              className='flex items-center text-blue-300 px-3 font-bold hover:text-white'>Dashboard</Link>
            <Link to="/admin/hotels"
              className='flex items-center text-blue-300 px-3 font-bold hover:text-white'>Hotels</Link>
            <Link to="/admin/users"
              className='flex items-center text-blue-300 px-3 font-bold hover:text-white'>Users</Link>
            <LogoutButton isAdmin={true} />
          </>) : (<>
            {!isLoggedIn ? (
              <Link to="/login"
                className='flex items-center text-blue-300 px-3 font-bold hover:text-white'>Login</Link>
            ) : (<>
              <span className='flex space-x-2'>
                <Link to="/login"
                  className='flex items-center text-blue-300 hover:text-white px-3 font-bold'>Account</Link>
              </span>
              <span className='flex space-x-2'>
                <LogoutButton isAdmin={false} />
              </span></>)}
          </>)}
        </span>
      </div>
    </div >
  )
}

export default Header;
