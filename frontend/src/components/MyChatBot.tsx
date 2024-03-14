import { useState, useMemo, useEffect } from "react";
import ChatBot from "react-chatbotify";
import "react-chatbotify/dist/react-chatbotify.css";
import * as apiClient from "../api-client";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { RoomType } from "../../../backend/src/shared/types";
import { useSearchContext } from "../contexts/SearchContext";
import { useMutation } from "react-query";
import { useAppContext } from "../contexts/AppContext";

const MyChatBot = () => {
  const botName = "WanderLustBookingAssistant1.0";
  const [hotel, setHotel] = useState<any[]>([]);
  const [userName, setUserName] = useState<string>("");
  const [destination, setDestination] = useState<string>("");
  const [checkIn, setCheckIn] = useState<Date>(new Date());
  const [checkOut, setCheckOut] = useState<Date>(new Date());
  const [adultCount, setAdultCount] = useState<number>(1);
  const [childCount, setChildCount] = useState<number>(1);
  const [roomType, setRoomType] = useState<string>("");
  const [roomCount, setRoomCount] = useState<number>(0);
  const [hotelId, setHotelId] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const search = useSearchContext();
  const { showToast } = useAppContext();
  let roomPrice = 0, total = 0;

  useEffect(() => {
    return () => { };
  }, [])

  const minDate = useMemo(() => new Date(), []);
  const maxDate = useMemo(() => {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 1);
    return date;
  }, []);

  const { mutate } = useMutation(apiClient.createCheckoutSession, {
    onMutate: (newPaymentData) => {
      return newPaymentData
    },
    onSuccess: () => {
      showToast({ message: "Booking Saved!", type: "SUCCESS" });
    },
    onError: () => {
      showToast({ message: "Error saving booking!", type: "ERROR" });
    }
  })

  const options = {
    header: {
      title: <div className="font-bold text-xl">WanderLustBookingAssistant</div>,
      showAvatar: true,
      avatar: "/chatbot.avif"
    },
    theme: { embedded: false, primaryColor: "#3B82F6", secondaryColor: "#000000", showFooter: false },
    chatHistory: { disabled: true },
    notification: { disabled: true },
    emoji: { disabled: true },
    userBubble: { showAvatar: true },
    tooltip: { mode: "START", text: "Booking Assistant😀" },
  };

  const handleSearchHotels = async (destination: string, page: number) => {
    try {
      console.log(page);
      const searchParams = { destination: destination, page: page.toString() };
      const response = await apiClient.searchHotels(searchParams);
      if (response.data) {
        setHotel(response.data);
      }
    } catch (error) {
      console.log("Error fetching hotels:", error);
    }
  };

  const flow = {
    start: {
      message: `Hi there!, I'm ${botName}, Please enter your sweet name 😊`,
      path: ({ userInput }: { userInput: string }) => {
        setUserName(userInput);
        return "welcome";
      },
    },

    welcome: {
      message: `Hello ${userName}. You can start booking now, Enter hotel name or place...`,
      path: async ({ userInput }: { userInput: string }) => {
        await handleSearchHotels(userInput, page);
        return "listHotel";
      },
    },

    listHotel: {
      message: "Find your hotel from the list",
      options: [...hotel.map((hotel) => hotel.name), "More", "Cancel Booking"],
      path: async ({ userInput }: { userInput: string }) => {
        setDestination(userInput);
        if (userInput === "Cancel Booking") {
          search.clearSearchValues("", new Date(), new Date(), 1, 0, "", 1, 0, 0)
          return "end";
        }
        if (userInput === "More") {
          setPage(page => page + 1);
          await handleSearchHotels(destination, page);
          return "listHotel";
        }
        return "hotelDetails";
      },
      chatDisabled: true,
    },

    hotelDetails: {
      render: () => {
        return (<div className="bg-black text-white rounded p-4 mt-2 ml-4 mr-4">
          <h6 className="mb-1">{`Now check details`}</h6>
          <h6 className="text-xl font-bold">{`Hotel Name: ${hotel[0].name}`}</h6>
          <h6 className="text-lg">{`Place: ${hotel[0].city}, ${hotel[0].country}`}</h6>
          <h6 className="text-lg">{`Facilities: ${hotel[0].facilities}`}</h6>
          <h6 className="text-lg">{`Rating: ${hotel[0].starRating}`}</h6>
          <h6 className="text-lg">{`Type: ${hotel[0].type}`}</h6>
          <h6 className="text-sm">{`Description: ${hotel[0].description}`}</h6>
          <div>
            {hotel[0].imageUrls.map((image: string) => (
              <div className="mt-2 p-2">
                <img src={image}
                  className="rounded-md w-full h-full object-cover object-center" />
              </div>
            ))}
          </div>
        </div>);
      },
      options: ["Confirm Destination", "Cancel Booking"],
      path: ({ userInput }: { userInput: string }) => {
        if (userInput === "Confirm Destination") {
          setHotelId(hotel[0]._id);
          return "confirmDestination";
        }
        if (userInput === "Cancel Booking") {
          search.clearSearchValues("", new Date(), new Date(), 1, 0, "", 1, 0, 0)
          return "end";
        }
      },
      chatDisabled: true,
    },

    confirmDestination: {
      message: `You've selected ${destination}.`,
      options: ["Continue", "Cancel Booking"],
      path: ({ userInput }: { userInput: string }) => {
        if (userInput === "Continue") {
          return "adultCount";
        }
        if (userInput === "Cancel Booking") {
          search.clearSearchValues("", new Date(), new Date(), 1, 0, "", 1, 0, 0)
          return "end";
        }
      },
      chatDisabled: true,
    },

    adultCount: {
      message: `Enter number of adults(15+)`,
      path: ({ userInput }: { userInput: string }) => {
        const temp = parseInt(userInput);
        if (userInput === "Cancel Booking" || isNaN(temp)) {
          search.clearSearchValues("", new Date(), new Date(), 1, 0, "", 1, 0, 0)
          return "end";
        }
        setAdultCount(temp);
        return "childCount";
      },
    },

    childCount: {
      message: `Enter number of children`,
      path: ({ userInput }: { userInput: string }) => {
        const temp = parseInt(userInput);
        if (userInput === "Cancel Booking" || isNaN(temp)) {
          search.clearSearchValues("", new Date(), new Date(), 1, 0, "", 1, 0, 0)
          return "end";
        }
        setChildCount(temp);
        return "confirmGuests";
      },
    },

    confirmGuests: {
      message: `${adultCount} adults & ${childCount} children`,
      options: ["Continue", "Cancel Booking"],
      path: ({ userInput }: { userInput: string }) => {
        if (userInput === "Continue") {
          return "roomDetails";
        }
        if (userInput === "Cancel Booking") {
          search.clearSearchValues("", new Date(), new Date(), 1, 0, "", 1, 0, 0)
          return "end";
        }
      },
      chatDisabled: true,
    },

    roomDetails: {
      message: `Next, Select Room`,
      options: ["Single", "Double", "Triple", "King", "Queen", "Cancel Booking"],
      path: ({ userInput }: { userInput: string }) => {
        if (userInput === "Cancel Booking") {
          search.clearSearchValues("", new Date(), new Date(), 1, 0, "", 1, 0, 0)
          return "end";
        }
        setRoomType(userInput)
        return "confirmRoomType";
      },
      chatDisabled: true,
    },

    confirmRoomType: {
      message: `You've selected ${roomType}-bed room.`,
      options: ["Continue", "Cancel Booking"],
      path: ({ userInput }: { userInput: string }) => {
        if (userInput === "Continue") {
          return "totalRooms";
        }
        if (userInput === "Cancel Booking") {
          search.clearSearchValues("", new Date(), new Date(), 1, 0, "", 1, 0, 0)
          return "end";
        }
      },
      chatDisabled: true,
    },

    totalRooms: {
      message: `Enter number of rooms`,
      path: ({ userInput }: { userInput: string }) => {
        const temp = parseInt(userInput);
        if (userInput === "Cancel Booking" || isNaN(temp)) {
          search.clearSearchValues("", new Date(), new Date(), 1, 0, "", 1, 0, 0)
          return "end";
        }
        setRoomCount(temp);
        return "confirmTotalRooms";
      },
    },

    confirmTotalRooms: {
      message: `You've selected ${roomCount} ${roomType}-bed rooms.`,
      options: ["Continue", "Cancel Booking"],
      path: ({ userInput }: { userInput: string }) => {
        if (userInput === "Continue") {
          return "checkIn";
        }
        if (userInput === "Cancel Booking") {
          search.clearSearchValues("", new Date(), new Date(), 1, 0, "", 1, 0, 0)
          return "end";
        }
      },
      chatDisabled: true,
    },

    checkIn: {
      message: "Please select the check-in date",
      render: () => (
        <DatePicker
          selected={checkIn} selectsStart
          minDate={minDate} startDate={checkIn}
          maxDate={maxDate} endDate={checkOut}
          placeholderText="Check-in Date"
          onChange={(date) => {
            setCheckIn(date as Date); setCheckOut(date as Date);
          }}
          wrapperClassName="min-w-full"
          className="bg-blue-900 hover:bg-blue-700 text-white items-center ml-4 mt-3 rounded p-2 focus:outline-none cursor-pointer text-center"
        />
      ),
      options: ["Confirm Check-in Date", "Cancel Booking"],
      path: ({ userInput }: { userInput: string }) => {
        if (userInput === "Confirm Check-in Date") {
          return "confirmCheckInDate";
        }
        if (userInput === "Cancel Booking") {
          search.clearSearchValues("", new Date(), new Date(), 1, 0, "", 1, 0, 0)
          return "end";
        }
      },
      chatDisabled: true,
    },

    confirmCheckInDate: {
      message: `You've selected ${checkIn.toLocaleDateString()}.`,
      options: ["Continue", "Cancel Booking"],
      path: ({ userInput }: { userInput: string }) => {
        if (userInput === "Continue") {
          return "checkOut";
        }
        if (userInput === "Cancel Booking") {
          search.clearSearchValues("", new Date(), new Date(), 1, 0, "", 1, 0, 0)
          return "end";
        }
      },
      chatDisabled: true,
    },

    checkOut: {
      message: "Now, Select check-out date",
      render: () => (
        <DatePicker
          selected={checkOut} selectsEnd
          startDate={checkOut}
          placeholderText="Check-out Date"
          minDate={checkIn} maxDate={maxDate}
          onChange={(date) => setCheckOut(date as Date)}
          wrapperClassName="min-w-full"
          className="bg-blue-900 hover:bg-blue-700 text-white items-center mt-3 rounded p-2 focus:outline-none cursor-pointer text-center"
        />
      ),
      options: ["Confirm Check-out Date", "Cancel Booking"],
      path: ({ userInput }: { userInput: string }) => {
        if (userInput === "Confirm Check-out Date") {
          return "confirmCheckOutDate";
        }
        if (userInput === "Cancel Booking") {
          search.clearSearchValues("", new Date(), new Date(), 1, 0, "", 1, 0, 0)
          return "end";
        }
      },
      chatDisabled: true,
    },

    confirmCheckOutDate: {
      message: `You've selected ${checkOut.toLocaleDateString()}.`,
      options: ["Continue", "Cancel Booking"],
      path: ({ userInput }: { userInput: string }) => {
        if (userInput === "Continue") {
          return "verifyBookingDetails";
        }
        if (userInput === "Cancel Booking") {
          search.clearSearchValues("", new Date(), new Date(), 1, 0, "", 1, 0, 0)
          return "end";
        }
      },
      chatDisabled: true,
    },

    verifyBookingDetails: {
      render: () => {
        roomPrice = hotel[0].roomTypes.find((room: RoomType) => room.type === roomType)?.price || 0;
        total = Math.floor((checkOut.getTime() - checkIn.getTime()) / (24 * 60 * 60 * 1000)) * roomCount * roomPrice;
        search.saveSearchValues(destination, checkIn, checkOut, adultCount, childCount, roomType, roomCount, roomPrice, total);
        return (
          <div className="bg-black text-white rounded p-4 mt-2 ml-4 mr-4">
            <h6 className="mb-1">Now verify details</h6>
            <h6 className="text-lg font-bold">{`User Name: ${userName}`}</h6>
            <h6 className="text-lg font-bold">{`Hotel: ${hotel[0].name}`}</h6>
            <h6 className="text-lg font-bold">{`Place: ${hotel[0].city}, ${hotel[0].country}`}</h6>
            <h6 className="text-lg font-bold">{`Rooms: ${roomType} Bed, ₹${roomPrice}, ${roomCount} Nos`}</h6>
            <h6 className="text-lg font-bold">{`Guests: ${adultCount} Adults & ${childCount} Children`}</h6>
            <h6 className="text-lg font-bold">{`Check-in: ${checkIn.toLocaleDateString()} 02:00:00 PM`}</h6>
            <h6 className="text-lg font-bold">{`Check-out: ${checkOut.toLocaleDateString()} 12:00:00 PM`}</h6>
            <h6 className="text-lg font-bold">{`Total Cost: ₹${total}/-`}</h6>
            <h6 className="mb-1">{`After clicking on "Confirm Booking", The bot will redirect you to the payment gateway page. Happy booking...`}</h6>
          </div>
        );
      },
      options: ["Confirm Booking", "Cancel Booking"],
      path: ({ userInput }: { userInput: string }) => {
        const nightsPerStay = Math.floor((checkOut.getTime() - checkIn.getTime()) / (24 * 60 * 60 * 1000));
        if (userInput === "Confirm Booking") {
          const paymentData = {
            checkIn, checkOut, adultCount, childCount, roomType, roomCount, roomPrice,
            hotelId, nightsPerStay
          }
          mutate(paymentData);
        }
        if (userInput === "Cancel Booking") {
          search.clearSearchValues("", new Date(), new Date(), 1, 0, "", 1, 0, 0)
          return "end";
        }
      },
      chatDisabled: true,
    },


    end: {
      message: `Thank you ${userName}! Visit Again`,
      options: ["Quit", "Continue"],
      path: ({ userInput }: { userInput: string }) => {
        setPage(1);
        if (userInput === "Continue") {
          return "start";
        }
      },
      chatDisabled: true,
    },
  };

  return <ChatBot options={options} flow={flow} />;
};

export default MyChatBot;
