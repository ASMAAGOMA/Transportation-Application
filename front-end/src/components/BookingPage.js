import React, { useState } from "react";
import { useLocation,useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { MapPin, Sparkles } from 'lucide-react';
import '../App.css';

//for trip data from home page
const BookingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const tripDetails = location.state; 

  if (!tripDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 py-12 px-4 relative">
          {/* Existing component code */}
          <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-between mb-12">
                  <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                      Book a wonderfull trip 
                  </h1>
                  <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-md">
                      <Sparkles className="w-5 h-5 text-yellow-500" />
                      <span className="text-sm font-medium text-gray-700">
                          Upcoming Adventures
                      </span>
                  </div>
              </div>

              <div className="flex flex-col items-center justify-center bg-white rounded-xl shadow-lg p-12 text-center">
                  <MapPin className="w-24 h-24 text-gray-300 mb-6" />
                  <h2 className="text-2xl font-bold text-gray-700 mb-4">
                      No booking Trips Yet
                  </h2>
                  <p className="text-gray-500 mb-6">
                      Start exploring and add some exciting destinations to book it !
                  </p>
                  <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                          onClick={() => navigate("/")}
                  >
                      Explore Trips
                  </button>
              </div>
              
          </div>  
      </div>  
    )};
              
  

  const [formData, setFormData] = useState({
    tickets: 1,
    paymentType: "full", // full or half
    
  });

  const totalPrice = formData.paymentType === "full" 
    ? Math.round(tripDetails.price * formData.tickets ) 
    : Math.round((tripDetails.price * formData.tickets ) / 2);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log({ ...formData, tripId: tripDetails.id, totalPrice });
  };

  const makePayment = async (e) => {
    e.preventDefault(); //Stop reloading page
    
    try {
      // Stripe Public Key
      const stripe = await loadStripe("pk_test_51QW3x1HzLvE2BAXyeFXNvnWXKCevhEShDCloQgsmGCy6quNinNw8iAdmEFUzligLxlcOL4J04op5l9l3C0LDOUY000vB7o4VPC");
      
      //the data that is passed to booking api
      const apiURL = "http://localhost:3500/api/booking";
      const payload = {
        tickets: formData.tickets,
        paymentType: formData.paymentType,
        totalPrice: totalPrice,
        tripId: tripDetails.id,
        destination: tripDetails.destination
      };
  
      //Resend the data to the backend
      const response = await fetch(apiURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      //check the response
      if (!response.ok) {
        throw new Error("Failed to process payment");
      }
  
      //get the paymentURL
      const data = await response.json();
      const { paymentUrl } = data;
  
      if (paymentUrl) {
        //Forward user to stripe payment page
        window.location.href = paymentUrl;
      } else {
        console.error("Payment URL not found");
      }
    } catch (error) {
      console.error("Error during payment:", error.message);
    }
  };  

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      {/* Container */}
      <div className="w-full max-w-3xl bg-white p-6 rounded-lg shadow-lg">
        {/* Trip Details */}
        <div className="text-center mb-6">
          {/*Trip image*/}
          {/* <img
            src={tripDetails.image} 
            alt="Trip"
            className="w-full max-h-64 object-cover rounded-lg mb-4"
          /> */}
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Booking for: {tripDetails.destination}
          </h1>
          <p className="text-gray-600">Price per ticket: ${tripDetails.price}</p>
          <p className="text-gray-600">Origin: {tripDetails.origin}</p>
          <p className="text-gray-600">Start Date: {tripDetails.startDate}</p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-gray-50 p-4 rounded-lg shadow-md"
        >
          <div className="grid grid-cols-1 gap-4">
            {/* Number of Tickets */}
            <label className="block">
              <span className="text-gray-700">Number of Tickets:</span>
              <input
                type="number"
                name="tickets"
                value={formData.tickets}
                onChange={handleChange}
                min="1"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2"
              />
            </label>

            {/* Payment Type */}
            <label className="block">
              <span className="text-gray-700">Payment Type:</span>
              <select
                name="paymentType"
                value={formData.paymentType}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2"
              >
                <option value="full">Full Payment</option>
                <option value="half">Half Payment</option>
              </select>
            </label>

            {/* Total Price */}
            <label className="block">
              <span className="text-gray-700">Total Price:</span>
              <div className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 bg-gray-100">
                ${totalPrice.toFixed(2)}
              </div>
            </label>
          </div>
          
          {/* Submit Button */}
          <button
            onClick={makePayment}
            type="submit"
            className="w-full mt-6 bg-indigo-500 text-white py-3 rounded-md hover:bg-indigo-600 transition duration-300"
          >
            Pay Now
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingPage;
