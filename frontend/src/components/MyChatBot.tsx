import { useState, useMemo, useEffect } from "react";
import ChatBot from "react-chatbotify";
import "react-chatbotify/dist/react-chatbotify.css";
import * as apiClient from "../api-client";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const MyChatBot = () => {
  const botName = "WanderLustBookingAssistant1.0";
  const [hotel, setHotel] = useState<any[]>([]);
  const [userName, setUserName] = useState<string>("");
  const [destination, setDestination] = useState<string>("")
  const [checkIn, setCheckIn] = useState<Date>(new Date());
  const [checkOut, setCheckOut] = useState<Date>(new Date());

  useEffect(() => {
    return () => { };
  }, [])

  const minDate = useMemo(() => new Date(), []);
  const maxDate = useMemo(() => {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 1);
    return date;
  }, []);

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

  const handleSearchHotels = async (destination: string) => {
    try {
      const searchParams = { destination };
      const response = await apiClient.searchHotels(searchParams);
      setHotel(response.data);
    } catch (error) {
      console.error("Error fetching hotels:", error);
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
        await handleSearchHotels(userInput);
        return "listHotel";
      },
    },

    listHotel: {
      message: "Find your hotel from the list",
      options: [...hotel.map((hotel) => hotel.name), "More", "Cancel Booking"],
      path: ({ userInput }: { userInput: string }) => {
        if (userInput === "Cancel Booking") {
          return "end";
        }
        if (userInput === "More") {
          return "end";
        }
        setDestination(userInput);
        return "hotelDetails";
      },
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
        </div>);
      },
      options: ["Confirm Destination", "Cancel Booking"],
      path: ({ userInput }: { userInput: string }) => {
        if (userInput === "Confirm Destination") {
          return "confirmDestination";
        }
        return "end";
      },
    },

    confirmDestination: {
      message: `You've selected ${destination}.`,
      options: ["Continue", "Cancel Booking"],
      path: ({ userInput }: { userInput: string }) => {
        if (userInput === "Continue") {
          return "checkIn";
        }
        return "end";
      },
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
        return "end";
      },
    },

    confirmCheckInDate: {
      message: `You've selected ${checkIn.toLocaleDateString()}.`,
      options: ["Continue", "Cancel Booking"],
      path: ({ userInput }: { userInput: string }) => {
        if (userInput === "Continue") {
          return "checkOut";
        }
        return "end";
      },
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
        return "end";
      },
    },

    confirmCheckOutDate: {
      message: `You've selected ${checkOut.toLocaleDateString()}.`,
      options: ["Continue", "Cancel Booking"],
      path: ({ userInput }: { userInput: string }) => {
        if (userInput === "Continue") {
          return "verifyBookingDetails";
        }
        return "end";
      },
    },

    verifyBookingDetails: {
      render: () => {
        return (<div className="bg-black text-white rounded p-4 mt-2 ml-4 mr-4">
          <h6 className="mb-1">{`Now verify details`}</h6>
          <h6 className="text-lg font-bold">{`User Name: ${userName}`}</h6>
          <h6 className="text-lg font-bold">{`Hotel: ${hotel[0].name}, ${hotel[0].city}, ${hotel[0].country}`}</h6>
          <h6 className="text-lg font-bold">{`Check-in: ${checkIn.toLocaleDateString()}`}</h6>
          <h6 className="text-lg font-bold">{`Check-in: ${checkOut.toLocaleDateString()}`}</h6>
        </div>);
      },
      options: ["Confirm Booking", "Cancel Booking"],
      path: ({ userInput }: { userInput: string }) => {
        if (userInput === "Confirm Booking") {
          return "end";
        }
        return "end";
      },
    },

    end: {
      message: `Thank you ${userName}! Visit Again`,
      options: ["Quit", "Continue"],
      path: ({ userInput }: { userInput: string }) => {
        if (userInput === "Continue") {
          return "start";
        }
        console.log(userName, destination, checkIn, checkOut);

      },
      chatDisabled: true,
    },
  };

  return <ChatBot options={options} flow={flow} />;
};

export default MyChatBot;
