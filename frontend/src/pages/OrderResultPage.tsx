import { Link } from 'react-router-dom';

const OrderResultPage = () => {

  return (
    <div className="flex items-center justify-center">
      <div className="max-w-md p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Booking Successful!</h2>
        <p className="text-gray-700 mb-4">Thank you for booking another hotel.</p>
        <p className="text-gray-700 mb-4">Your hotel booking has been successfully placed.</p>
        <p className="text-gray-700 mb-4">Booking ID: #123456</p>
        <p className="text-gray-700 mb-4"></p>
        <div className='flex items-center justify-center gap-5'>
          <Link to="/search" className="text-blue-300 bg-black h-full p-2 font-bold hover:text-white text-xl">
            <span>Go Home</span>
          </Link>
          <Link to="/orders" className="text-blue-300 bg-black h-full p-2 font-bold hover:text-white text-xl">
            <span>Orders</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderResultPage;
