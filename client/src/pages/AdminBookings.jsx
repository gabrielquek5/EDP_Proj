import React, { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
// import { BarChart,ChartTooltip} from '@mui/x-charts';
import http from '../http';

const AdminBookings = () => {
  // const [bookingData, setBookingData] = useState([]);

  // useEffect(() => {
  //   // Fetch data from the backend API
  //   const fetchData = async () => {
  //     try {
  //       const response = await http.get('/bookings'); // Replace this with your actual API endpoint
  //       setBookingData(response.data);
  //     } catch (error) {
  //       console.error('Error fetching booking data:', error);
  //     }
  //   };

  //   fetchData();
  // }, []);

  // return (
  //   <div>
  //     <Typography variant="h6">Bookings by Date</Typography>
  //     <BarChart
  //       data={bookingData}
  //       xKey="date"
  //       width={500}
  //       height={300}
  //       xAxisOptions={{
  //         tickSize: 10,
  //       }}
  //       yAxisOptions={{
  //         tickSize: 5,
  //       }}
  //     >
  //       <xAxis label="Date" />
  //       <yAxis label="Number of Bookings" />
  //       <Tooltip />
  //       <CartesianGrid />
  //       <Bar dataKey="numBookings" />
  //     </BarChart>

  //     <Typography variant="h6">Bookings by Schedule Event Type</Typography>
  //     <BarChart
  //       data={bookingData}
  //       xKey="eventType"
  //       width={500}
  //       height={300}
  //       xAxisOptions={{
  //         tickSize: 10,
  //       }}
  //       yAxisOptions={{
  //         tickSize: 5,
  //       }}
  //     >
  //       <xAxis label="Event Type" />
  //       <yAxis label="Number of Bookings" />
  //       <Tooltip />
  //       <CartesianGrid />
  //       <Bar dataKey="numBookings" />
  //     </BarChart>
  //   </div>
  // );
};

export default AdminBookings;
