// server.ts
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var app = express();
var PORT = process.env.PORT || 3e3;
var isProd = process.env.NODE_ENV === "production";
app.use(express.json());
var MYSURU_TRAINS = [
  {
    trainNumber: "20607",
    trainName: "Vande Bharat Express",
    arrivalTime: "12:20 PM",
    originStation: "MGR Chennai Central (MAS)",
    destinationStation: "Mysuru Junction (MYS)",
    serviceType: "High-Speed",
    platform: "PF 1",
    delayMinutes: 0
  },
  {
    trainNumber: "12007",
    trainName: "Shatabdi Express",
    arrivalTime: "01:00 PM",
    originStation: "MGR Chennai Central (MAS)",
    destinationStation: "Mysuru Junction (MYS)",
    serviceType: "Premium Express",
    platform: "PF 1",
    delayMinutes: 0
  },
  {
    trainNumber: "17308",
    trainName: "Basava Express",
    arrivalTime: "11:15 AM",
    originStation: "Bagalkot (BGK)",
    destinationStation: "Mysuru Junction (MYS)",
    serviceType: "Express",
    platform: "PF 2",
    delayMinutes: 10
  },
  {
    trainNumber: "12613",
    trainName: "Wodeyar SF Express",
    arrivalTime: "10:45 AM",
    originStation: "KSR Bengaluru (SBC)",
    destinationStation: "Mysuru Junction (MYS)",
    serviceType: "Express",
    platform: "PF 3",
    delayMinutes: 0
  },
  {
    trainNumber: "16216",
    trainName: "Chamundi Express",
    arrivalTime: "09:35 AM",
    originStation: "KSR Bengaluru (SBC)",
    destinationStation: "Mysuru Junction (MYS)",
    serviceType: "Regional / Commuter",
    platform: "PF 4",
    delayMinutes: 5
  },
  {
    trainNumber: "06559",
    trainName: "KSR Bengaluru - Mysuru MEMU",
    arrivalTime: "02:30 PM",
    originStation: "KSR Bengaluru (SBC)",
    destinationStation: "Mysuru Junction (MYS)",
    serviceType: "Regional / Commuter",
    platform: "PF 5",
    delayMinutes: 0
  },
  {
    trainNumber: "16228",
    trainName: "Talguppa - Mysuru Express (Late Night)",
    arrivalTime: "10:45 PM",
    originStation: "Talguppa (TLGP)",
    destinationStation: "Mysuru Junction (MYS)",
    serviceType: "Express",
    platform: "PF 1",
    delayMinutes: 15
  },
  {
    trainNumber: "06256",
    trainName: "KSR Bengaluru - Mysuru Night MEMU",
    arrivalTime: "11:35 PM",
    originStation: "KSR Bengaluru (SBC)",
    destinationStation: "Mysuru Junction (MYS)",
    serviceType: "Regional / Commuter",
    platform: "PF 6",
    delayMinutes: 0
  }
];
var MYSURU_BUS_ROUTES = [
  {
    routeId: "119",
    routeType: "Institutional / Tech Park",
    source: "City Bus Stand (CBS)",
    destination: "Infosys Campus / Hebbal Electronic City",
    corridorName: "Hebbal IT Corridor",
    majorStops: ["Metaghalli", "Hebbal Ring Road", "Infosys Gate 1", "Infosys Gate 2", "L&T Technology"],
    approvedPickupStops: [
      { id: "119-s1", name: "Metaghalli Signal", landmark: "Near Metaghalli Police Station", kmFromStation: 4.2, etaMinutes: 10, fare: 25 },
      { id: "119-s2", name: "Hebbal Ring Road Junction", landmark: "Under Hebbal Flyover", kmFromStation: 7.5, etaMinutes: 16, fare: 30 },
      { id: "119-s3", name: "Infosys Main Gate (Gate 1)", landmark: "Hebbal Electronic City Phase 2", kmFromStation: 11, etaMinutes: 24, fare: 35 }
    ],
    standardFare: 35,
    frequencyType: "Regular"
  },
  {
    routeId: "201",
    routeType: "Tourist / Landmark",
    source: "City Bus Stand (CBS)",
    destination: "Chamundi Hill Temple",
    corridorName: "Chamundi Foothills & Hilltop",
    majorStops: ["Mysuru Zoo", "Karanji Lake", "Nandi Statue", "Tavarekatte", "Chamundi Hilltop"],
    approvedPickupStops: [
      { id: "201-s1", name: "Mysuru Zoo Bus Bay", landmark: "Sri Chamarajendra Zoological Gardens", kmFromStation: 3.5, etaMinutes: 8, fare: 25 },
      { id: "201-s2", name: "Karanji Lake Entrance", landmark: "Opposite Butterfly Park Gate", kmFromStation: 5.1, etaMinutes: 12, fare: 30 },
      { id: "201-s3", name: "Nandi Bull Circle", landmark: "Monolithic Nandi Viewpoint", kmFromStation: 9.8, etaMinutes: 22, fare: 40 }
    ],
    standardFare: 40,
    frequencyType: "High (Every 15 mins)"
  },
  {
    routeId: "3 Series (30-39)",
    routeType: "Corridor / Suburb Connection",
    source: "City Bus Stand (CBS)",
    destination: "Bogadi, Hinkal, Vijayanagar",
    corridorName: "West Vijayanagar Corridor",
    majorStops: ["Sangam Bhandar", "Hinkal Flyover", "Aishwarya Petrol Bunk", "Bogadi 2nd Stage"],
    approvedPickupStops: [
      { id: "3-s1", name: "Sangam Bhandar Circle", landmark: "Near Kalidasa Road", kmFromStation: 2.8, etaMinutes: 7, fare: 20 },
      { id: "3-s2", name: "Hinkal Flyover Junction", landmark: "Hunsur Road Junction", kmFromStation: 5.4, etaMinutes: 14, fare: 25 }
    ],
    standardFare: 30,
    frequencyType: "Regular"
  },
  {
    routeId: "6 to 8 Series",
    routeType: "Corridor / Suburb Connection",
    source: "City Bus Stand (CBS)",
    destination: "Kuvempunagar, Vivekananda Circle, RTO",
    corridorName: "South Kuvempunagar Corridor",
    majorStops: ["Andolana Circle", "JSS Hospital", "Agrahara", "Vivekananda Circle"],
    approvedPickupStops: [
      { id: "6-s1", name: "Agrahara Circle", landmark: "Near Ballal Circle Junction", kmFromStation: 2.1, etaMinutes: 6, fare: 20 },
      { id: "6-s2", name: "Vivekananda Circle", landmark: "Kuvempunagar Complex", kmFromStation: 6.2, etaMinutes: 16, fare: 30 }
    ],
    standardFare: 30,
    frequencyType: "Regular"
  }
];
var BUS_FLEET = [
  {
    id: "bus-01",
    regNumber: "KA-09-F-2144",
    busType: "Electric Midi AC",
    totalCapacity: 32,
    operatorName: "KSRTC Mysuru City Urban Feeder",
    driverName: "Ramesh Gowda",
    driverPhone: "+91 94481 23091",
    conductorName: "Suresh Kumar",
    conductorPhone: "+91 94481 23092",
    status: "BOARDING",
    currentPoolId: "pool-active-20",
    assignedDepartureTime: "12:45 PM",
    pickupLocation: "Mysuru Junction (MYS) - Main Concourse Bay 2 (Platform 1 Exit)",
    reservedSeatsForTrain: 20,
    directBookedSeats: 4,
    enRouteBookedSeats: 2
  },
  {
    id: "bus-02",
    regNumber: "KA-09-F-1892",
    busType: "Ashwamedha City Liner",
    totalCapacity: 45,
    operatorName: "KSRTC Chamundi Transit Division",
    driverName: "Manjunath Swamy",
    driverPhone: "+91 94482 11044",
    conductorName: "Anand Murthy",
    conductorPhone: "+91 94482 11045",
    status: "STANDBY",
    pickupLocation: "Mysuru Junction (MYS) - West Terminal Bay 1 (Platform 6 Exit)",
    reservedSeatsForTrain: 0,
    directBookedSeats: 0,
    enRouteBookedSeats: 0
  },
  {
    id: "bus-03",
    regNumber: "KA-09-F-3301",
    busType: "Corona Low-Floor AC",
    totalCapacity: 40,
    operatorName: "Mysuru Urban Public Transport Corp",
    driverName: "Basavaraju H.",
    driverPhone: "+91 94483 55890",
    conductorName: "Prakash Rao",
    conductorPhone: "+91 94483 55891",
    status: "STANDBY",
    pickupLocation: "Mysuru Junction (MYS) - Main Concourse Bay 1",
    reservedSeatsForTrain: 0,
    directBookedSeats: 0,
    enRouteBookedSeats: 0
  }
];
var POOL_GROUPS = [
  {
    id: "pool-active-20",
    targetDestination: "Infosys Campus / Hebbal Electronic City",
    corridorName: "Hebbal IT Corridor",
    routeId: "119",
    arrivalWindowStart: "12:15 PM",
    arrivalWindowEnd: "12:45 PM",
    trainNumbers: ["20607", "12007"],
    bookedSeats: 20,
    targetThreshold: 20,
    status: "BUS_ASSIGNED",
    deadlineMinutesLeft: 18,
    isLateNight: false,
    isPriorityFlagged: false,
    allocatedBusId: "bus-01",
    allocatedBusNumber: "KA-09-F-2144",
    departureTime: "12:45 PM",
    pickupGate: "Platform 1 Exit - Bay 2",
    passengers: [
      {
        bookingId: "BK-1001",
        passengerName: "Kavitha Hegde",
        phone: "+91 98860 11223",
        seatCount: 2,
        trainNumber: "20607",
        pnr: "4231889021",
        bookedAt: "11:40 AM"
      },
      {
        bookingId: "BK-1002",
        passengerName: "Prashanth V.",
        phone: "+91 98860 44556",
        seatCount: 3,
        trainNumber: "20607",
        pnr: "4231889045",
        bookedAt: "11:42 AM"
      }
    ]
  },
  {
    id: "pool-ready-threshold",
    targetDestination: "Chamundi Hill Temple",
    corridorName: "Chamundi Foothills & Hilltop",
    routeId: "201",
    arrivalWindowStart: "11:00 AM",
    arrivalWindowEnd: "11:45 AM",
    trainNumbers: ["17308", "12613"],
    bookedSeats: 20,
    targetThreshold: 20,
    status: "THRESHOLD_REACHED",
    deadlineMinutesLeft: 22,
    isLateNight: false,
    isPriorityFlagged: false,
    passengers: []
  }
];
var BOOKINGS = [
  {
    id: "BK-1001",
    type: "TRAIN_POOL",
    passengerId: "user-001",
    passengerName: "Kavitha Hegde",
    passengerPhone: "+91 98860 11223",
    trainNumber: "20607",
    trainName: "Vande Bharat Express",
    pnr: "4231889021",
    routeId: "119",
    destination: "Infosys Campus / Hebbal Electronic City",
    pickupStop: "Mysuru Junction (MYS) - Main Concourse Bay 2 (PF 1 Exit)",
    seatCount: 2,
    farePerSeat: 35,
    totalFare: 70,
    fareStatus: "CAPTURED",
    bookingStatus: "CONFIRMED",
    poolGroupId: "pool-active-20",
    busId: "bus-01",
    busRegNumber: "KA-09-F-2144",
    departureTime: "12:45 PM",
    pickupGate: "Platform 1 Exit - Bay 2",
    qrTicketCode: "YS-MYS-BK1001-KA09F2144",
    createdAt: "11:40 AM"
  }
];
var WALLET = {
  balance: 480,
  reservedAmount: 0,
  transactions: [
    {
      id: "TXN-9001",
      timestamp: "10:30 AM",
      amount: 500,
      type: "TOPUP",
      description: "Simulated Wallet Welcome Credit",
      balanceAfter: 500
    }
  ]
};
app.get(["/health", "/api/health"], (req, res) => {
  res.json({
    status: "ok",
    service: "YatriSync Live Backend (Express REST)",
    version: "1.0.0",
    location: "Mysuru, Karnataka, India",
    mode: "Full-Stack Server-Authoritative",
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  });
});
app.get("/api/trains", (req, res) => {
  res.json(MYSURU_TRAINS);
});
app.get("/api/routes", (req, res) => {
  res.json(MYSURU_BUS_ROUTES);
});
app.get("/api/buses", (req, res) => {
  res.json(BUS_FLEET);
});
app.get("/api/pools", (req, res) => {
  res.json(POOL_GROUPS);
});
app.post("/api/pools/join", (req, res) => {
  const { trainNumber, routeId, destination, seatCount, passengerName, phone, pnr, isWomenSafetyPriority } = req.body;
  const route = MYSURU_BUS_ROUTES.find((r) => r.routeId === routeId);
  const train = MYSURU_TRAINS.find((t) => t.trainNumber === trainNumber);
  const farePerSeat = route ? route.standardFare : 35;
  const totalFare = farePerSeat * (seatCount || 1);
  if (WALLET.balance < totalFare) {
    return res.status(400).json({ success: false, message: "Insufficient wallet balance" });
  }
  WALLET.balance -= totalFare;
  WALLET.reservedAmount += totalFare;
  const bookingId = `BK-${Math.floor(5e3 + Math.random() * 4999)}`;
  const qrTicketCode = `YS-MYS-${bookingId}-${trainNumber}`;
  WALLET.transactions.unshift({
    id: `TXN-${Math.floor(1e3 + Math.random() * 9e3)}`,
    timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    amount: totalFare,
    type: "FARE_RESERVE",
    description: `Fare Reserved for ${seatCount} seats to ${destination}`,
    bookingId,
    balanceAfter: WALLET.balance
  });
  let targetPool = POOL_GROUPS.find((p) => p.routeId === routeId && p.status !== "DISPATCHED" && p.status !== "CANCELLED");
  if (targetPool) {
    targetPool.bookedSeats += seatCount;
    if (targetPool.bookedSeats >= targetPool.targetThreshold && targetPool.status === "COLLECTING") {
      targetPool.status = "THRESHOLD_REACHED";
    }
  } else {
    targetPool = {
      id: `pool-${Date.now()}`,
      targetDestination: destination,
      corridorName: route?.corridorName || destination,
      routeId,
      arrivalWindowStart: train?.arrivalTime || "11:00 AM",
      arrivalWindowEnd: "12:30 PM",
      trainNumbers: [trainNumber],
      bookedSeats: seatCount,
      targetThreshold: 20,
      status: seatCount >= 20 ? "THRESHOLD_REACHED" : "COLLECTING",
      deadlineMinutesLeft: 30,
      isLateNight: trainNumber === "16228" || trainNumber === "06256",
      isPriorityFlagged: trainNumber === "16228" || trainNumber === "06256",
      priorityReason: trainNumber === "16228" ? "Late-Night Corridor Safety Monitoring" : void 0,
      passengers: []
    };
    POOL_GROUPS.push(targetPool);
  }
  const newBooking = {
    id: bookingId,
    type: "TRAIN_POOL",
    passengerId: "user-001",
    passengerName,
    passengerPhone: phone,
    trainNumber,
    trainName: train?.trainName,
    pnr,
    routeId,
    destination,
    pickupStop: "Mysuru Junction (MYS) - Main Concourse Bay (PF 1 Exit)",
    seatCount,
    farePerSeat,
    totalFare,
    fareStatus: "RESERVED",
    bookingStatus: "PENDING_POOL",
    poolGroupId: targetPool.id,
    qrTicketCode,
    isWomenSafetyPriority,
    createdAt: (/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  };
  BOOKINGS.unshift(newBooking);
  res.json({
    success: true,
    bookingId,
    qrTicketCode,
    poolId: targetPool.id,
    status: targetPool.status,
    totalSeats: targetPool.bookedSeats
  });
});
app.post("/api/operator/allocate", (req, res) => {
  const { poolId, busId, departureTime, pickupGate } = req.body;
  const pool = POOL_GROUPS.find((p) => p.id === poolId);
  const bus = BUS_FLEET.find((b) => b.id === busId);
  if (!pool || !bus) {
    return res.status(404).json({ success: false, message: "Pool or Bus not found" });
  }
  pool.status = "BUS_ASSIGNED";
  pool.allocatedBusId = bus.id;
  pool.allocatedBusNumber = bus.regNumber;
  pool.departureTime = departureTime;
  pool.pickupGate = pickupGate;
  bus.status = "BOARDING";
  bus.currentPoolId = pool.id;
  bus.assignedDepartureTime = departureTime;
  bus.pickupLocation = `Mysuru Junction (MYS) - ${pickupGate}`;
  bus.reservedSeatsForTrain = pool.bookedSeats;
  BOOKINGS.forEach((b) => {
    if (b.poolGroupId === poolId && b.bookingStatus === "PENDING_POOL") {
      b.bookingStatus = "CONFIRMED";
      b.fareStatus = "CAPTURED";
      b.busId = bus.id;
      b.busRegNumber = bus.regNumber;
      b.departureTime = departureTime;
      b.pickupGate = pickupGate;
      WALLET.reservedAmount = Math.max(0, WALLET.reservedAmount - b.totalFare);
      WALLET.transactions.unshift({
        id: `TXN-${Math.floor(1e3 + Math.random() * 9e3)}`,
        timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        amount: b.totalFare,
        type: "FARE_CAPTURE",
        description: `Fare Captured: Bus ${bus.regNumber} allocated to ${pool.targetDestination}`,
        bookingId: b.id,
        balanceAfter: WALLET.balance
      });
    }
  });
  res.json({ success: true, message: `Bus ${bus.regNumber} approved and dispatched!` });
});
app.post("/api/conductor/verify-qr", (req, res) => {
  const { ticketCode } = req.body;
  const booking = BOOKINGS.find((b) => b.qrTicketCode === (ticketCode || "").trim());
  if (!booking) {
    return res.json({ success: false, duplicate: false, message: "Invalid Ticket! No reservation found." });
  }
  if (booking.bookingStatus === "BOARDED") {
    return res.json({
      success: false,
      duplicate: true,
      booking,
      message: `DUPLICATE QR SCAN DETECTED: Passenger ${booking.passengerName} was already boarded at ${booking.boardedAt || "earlier"}. Re-entry denied!`
    });
  }
  if (booking.bookingStatus !== "CONFIRMED") {
    return res.json({
      success: false,
      duplicate: false,
      booking,
      message: `Ticket cannot be boarded: Current status is '${booking.bookingStatus}'. Must be CONFIRMED.`
    });
  }
  const now = (/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  booking.bookingStatus = "BOARDED";
  booking.boardedAt = now;
  res.json({
    success: true,
    duplicate: false,
    booking,
    message: `Verified! Passenger ${booking.passengerName} (${booking.seatCount} seats) marked as BOARDED at ${now}.`
  });
});
app.get("/api/wallet", (req, res) => {
  res.json(WALLET);
});
app.post("/api/wallet/topup", (req, res) => {
  const { amount } = req.body;
  const amt = Number(amount) || 100;
  WALLET.balance += amt;
  WALLET.transactions.unshift({
    id: `TXN-${Math.floor(1e3 + Math.random() * 9e3)}`,
    timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    amount: amt,
    type: "TOPUP",
    description: "Simulated Instant UPI / Net Banking Top-Up",
    balanceAfter: WALLET.balance
  });
  res.json({ success: true, balance: WALLET.balance });
});
app.get("/api/bookings", (req, res) => {
  res.json(BOOKINGS);
});
async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(distPath, "index.html"));
    });
  }
  app.listen(PORT, () => {
    console.log(`[YatriSync] Server running at http://localhost:${PORT}`);
    console.log(`[YatriSync] API health check active at http://localhost:${PORT}/health`);
  });
}
startServer();
