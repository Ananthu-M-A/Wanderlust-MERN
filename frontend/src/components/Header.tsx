import { Link } from 'react-router-dom';
import '../index.css';
import { useAppContext } from '../contexts/AppContext';
import LogoutButton from '../components/LogoutButton';

const Header = () => {
  const { isLoggedIn } = useAppContext();
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
          {isLoggedIn ? (<>
            <Link to="/my-bookings"
              className='flex items-center text-white px-3 font-bold hover:bg-blue-600'>My Bookings</Link>
            <Link to="/hotels"
              className='flex items-center text-white px-3 font-bold hover:bg-blue-600'>My Hotels</Link>
            <LogoutButton />
          </>) : (<>
            <Link to="/login"
              className='flex items-center text-white px-3 font-bold hover:bg-white hover:text-blue-800'>Login</Link>
          </>)}
        </span>
      </div>
    </div >
  )
}

export default Header;
