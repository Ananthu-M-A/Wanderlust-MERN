import { Link } from 'react-router-dom';
import '../index.css';
import { useAppContext } from '../contexts/AppContext';
import LogoutButton from '../components/LogoutButton';
import { useAdminContext } from '../contexts/AdminContext';

const Header = () => {
  const { isLoggedIn } = useAppContext();
  const { isAdminLoggedIn } = useAdminContext();

  return (
    <div className="bg-blue-800 py-6">
      <div className="container mx-auto flex justify-between">
        {/* <span className='flex space-x-2'>
          <Link to="/login"
            className='flex items-center text-blue-400 px-3 font-bold'>Spots</Link>
        </span>
        <span className='flex space-x-2'>
          <Link to="/login"
            className='flex items-center text-blue-400 px-3 font-bold'>Hotels</Link>
        </span>
        <span className='flex space-x-2'>
          <Link to="/login"
            className='flex items-center text-blue-400 px-3 font-bold'>Restaurants</Link>
        </span>
        <span className='flex space-x-2'>
          <Link to="/login"
            className='flex items-center text-blue-400 px-3 font-bold'>Transits</Link>
        </span> */}
        <span className="text-3xl text-white font-bold tracking-tight">
          <Link to="/">WANDERLUST</Link>
          {isAdminLoggedIn && <p className='text-xl'>ADMIN</p>}
          {/* <image src='/logo.png' width={'200px'}/> */}
        </span>
        {/* <span className='flex space-x-2'>
          <Link to="/login"
            className='flex items-center text-blue-400 px-3 font-bold'>Account</Link>
        </span>
        <span className='flex space-x-2'>
          <Link to="/login"
            className='flex items-center text-blue-400 px-3 font-bold'>ContactUs</Link>
        </span>
        <span className='flex space-x-2'>
          <Link to="/login"
            className='flex items-center text-blue-400 px-3 font-bold'>About</Link>
        </span> */}
        < span className='flex space-x-2'>
          {isAdminLoggedIn ? (<>
            <Link to="/hotels"
              className='flex items-center text-white px-3 font-bold hover:bg-blue-600'>Hotels</Link>
            <LogoutButton isAdmin={true} />
          </>) : (<>
            {!isLoggedIn ? (
              <Link to="/login"
                className='flex items-center text-white px-3 font-bold hover:bg-white hover:text-blue-800'>Login</Link>
            ) : (<>
              <Link to="/my-bookings"
                className='flex items-center text-white px-3 font-bold hover:bg-blue-600'>My Bookings</Link>
              <LogoutButton isAdmin={false} /></>)}
          </>)}
        </span>
      </div>
    </div >
  )
}

export default Header;
