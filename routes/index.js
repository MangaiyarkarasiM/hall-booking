var express = require('express');
var router = express.Router();

let rooms = [{
  roomID : 1,
  roomName : 101,
  numberOfSeatsAvailable : 50,
  amenitiesInRoom : ['AC', 'Wi-Fi'],
  pricePerHour : 100
}]

let bookingdata = [
  {
    roomID : 1,
    roomName : 101,
    customerName : "AAAA",
    date : "03/16/2022",
    startTime : "08:00:00",
    endTime : "13:00:00"
  }
]

//creating a new room
router.post('/create-room',(req,res)=>{
  if(req.body.numberOfSeatsAvailable && req.body.amenitiesInRoom && req.body.pricePerHour)
  {
    let room = {...req.body};
    room.roomID = rooms.length + 1;
    room.roomName = rooms[rooms.length-1].roomName + 1;
    //console.log(room);
    rooms.push(room);
    res.send({
      statusCode : 200,
      message : "Room created successfully"
    })
  }
  else{
    res.send({
      statusCode : 400,
      message : "Please specify all the required information(numberOfSeatsAvailable,amenitiesInRoom and pricePerHour)"
    })
  }
})

//booking a room for a customer
router.post('/book-room',(req,res)=>{
  if(req.body.roomID && req.body.customerName && req.body.date && req.body.startTime && req.body.endTime){
    let room = rooms.filter((ele)=>ele.roomID === req.body.roomID);
    if(room.length>0)
    {
      let roomavailable = true;
      let reqDateStartTime = new Date(`${req.body.date} ${req.body.startTime}`).getTime();
      let reqEndDateTime = new Date(`${req.body.date} ${req.body.endTime}`).getTime();
      let bookings = bookingdata.filter((b)=> (b.roomID === req.body.roomID && b.date === req.body.date))
      if(bookings.length>0)
      {
        bookings.forEach(book => {
            let bookStartDateTime = new Date(`${book.date} ${book.startTime}`).getTime();
            let bookEndDateTime = new Date(`${book.date} ${book.endTime}`).getTime();
            //checking whether the requested start time and end time is not in the range of the already booked time range
            if((bookStartDateTime<=reqDateStartTime && bookEndDateTime>reqDateStartTime) || (bookStartDateTime>reqEndDateTime && bookEndDateTime<=reqEndDateTime) || (bookStartDateTime===reqDateStartTime && bookEndDateTime===reqEndDateTime))
            {
              roomavailable = false;
            }
        })
      }
      if(roomavailable){
        let booking = {...req.body};
        booking.roomName = room[0].roomName;
        bookingdata.push(booking);
        res.send({
          statusCode : 200,
          message : "Room booked successfully"
        })
      }
      else{
        res.send({
          statusCode : 400,
          message : "Room already booked for the specified date and time"
        })
      }
    }
    else
    {
      res.send({
        statusCode : 400,
        message : "Invalid Room ID"
      })
    }
  }
  else{
    res.send({
      statusCode : 400,
      message : "Please specify all the required information(roomID, customerName, date, startTime, endTime)"
    })
  }
})

//get all the rooms with booking data
router.get('/allrooms',(req,res)=>{
  let roomdata=[];
  rooms.forEach((room)=>{
    let bookings = bookingdata.filter((booking)=>booking.roomID===room.roomID);
    if(bookings.length>0)
    {
      bookings.forEach((book)=>{
        let roombooking = {};
        roombooking.roomName = book.roomName;
        roombooking.bookedStatus = true;
        roombooking.customerName = book.customerName;
        roombooking.date = book.date;
        roombooking.startTime = book.startTime;
        roombooking.endTime = book.endTime;
        roomdata.push(roombooking);
      })
    }
    else
    {
      let roombooking = {};
      roombooking.roomName = room.roomName;
      roombooking.bookedStatus = false;
      roombooking.customerName = '';
      roombooking.date = '';
      roombooking.startTime = '';
      roombooking.endTime = '';
      roomdata.push(roombooking);
    }
  })
     res.send({
      statusCode : 200,
      roomdata
     })
})

//get all the customers with booking data
router.get('/allcustomers',(req,res)=>{
  let bookings = [];
  bookingdata.forEach((booking)=>{
    let book = {};
    book.customerName = booking.customerName;
    book.roomName = booking.roomName;
    book.date = booking.date;
    book.startTime = booking.startTime;
    book.endTime = booking.endTime;
    bookings.push(book);
  })
  res.send({
    statusCode : 200,
    bookings
  })
})

module.exports = router;
