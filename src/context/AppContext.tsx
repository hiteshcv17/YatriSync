import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  Train,
  BusRoute,
  PoolGroup,
  BusVehicle,
  Booking,
  WalletTransaction,
  NotificationItem,
  AlternativeTransportOption,
  AuthSession,
} from '../types';
import {
  MYSURU_TRAINS,
  MYSURU_BUS_ROUTES,
  INITIAL_BUS_FLEET,
  INITIAL_POOL_GROUPS,
} from '../data/mysuruData';

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  authSession: AuthSession | null;
  loginPassenger: (params: { name: string; phone: string; pnr?: string }) => void;
  loginStaff: (params: { name: string; staffRole: 'operator' | 'admin' | 'conductor'; badgeNumber: string }) => void;
  logout: () => void;
  trains: Train[];
  routes: BusRoute[];
  poolGroups: PoolGroup[];
  buses: BusVehicle[];
  bookings: Booking[];
  walletBalance: number;
  reservedAmount: number;
  transactions: WalletTransaction[];
  notifications: NotificationItem[];
  activeTicket: Booking | null;
  setActiveTicket: (ticket: Booking | null) => void;
  
  // Passenger actions
  createTrainPoolBooking: (params: {
    trainNumber: string;
    routeId: string;
    destination: string;
    seatCount: number;
    passengerName: string;
    phone: string;
    pnr: string;
    isWomenSafetyPriority?: boolean;
  }) => { success: boolean; bookingId?: string; message: string };

  bookDirectBus: (params: {
    busId: string;
    seatCount: number;
    passengerName: string;
    phone: string;
  }) => { success: boolean; bookingId?: string; message: string };

  bookEnRoutePickup: (params: {
    busId: string;
    stopId: string;
    seatCount: number;
    passengerName: string;
    phone: string;
  }) => { success: boolean; bookingId?: string; message: string };

  cancelBooking: (bookingId: string) => void;

  // Wallet actions
  topUpWallet: (amount: number) => void;

  // Operator actions
  approveAllocation: (poolId: string, busId: string, departureTime: string, pickupGate: string) => void;
  rejectAllocation: (poolId: string, reason: string) => void;
  addEmergencyAllocationReview: (poolId: string) => void;
  departBus: (busId: string) => void;
  addBusToFleet: (regNumber?: string, busType?: string) => void;

  // AI Multimodal, Delays & Safety
  updateTrainDelay: (trainNumber: string, delayMinutes: number) => void;
  rescheduleBusForDelay: (poolId: string, newDepartureTime: string) => void;
  mergePoolGroups: (primaryPoolId: string, secondaryPoolId: string) => void;
  triggerEmergencySOS: (passengerName: string, bookingId: string, location: string) => string;
  resetDataToSeed: () => void;

  // Conductor actions
  verifyAndBoardTicket: (ticketCode: string) => {
    success: boolean;
    duplicate?: boolean;
    booking?: Booking;
    message: string;
  };

  // Journey Recovery
  getRecoveryOptionsForBooking: (bookingId: string) => AlternativeTransportOption[];
  executeRecoveryOption: (bookingId: string, option: AlternativeTransportOption) => void;

  // Helpers / Simulation for demo
  simulateAddPassengersToPool: (poolId: string, seatsToAdd: number) => void;
  addNotification: (title: string, message: string, type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ALERT') => void;
  markNotificationRead: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authSession, setAuthSession] = useState<AuthSession | null>(() => {
    const saved = localStorage.getItem('yatrisync_auth_session');
    return saved ? JSON.parse(saved) : null;
  });

  const [role, setRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem('yatrisync_auth_session');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.portal === 'passenger') return 'passenger';
        if (parsed.staffRole === 'conductor') return 'conductor';
        if (parsed.staffRole === 'admin') return 'admin';
        return 'operator';
      } catch (e) {
        return 'passenger';
      }
    }
    return 'passenger';
  });
  const [trains, setTrains] = useState<Train[]>(() => {
    const saved = localStorage.getItem('yatrisync_trains');
    return saved ? JSON.parse(saved) : MYSURU_TRAINS;
  });
  const [routes] = useState<BusRoute[]>(MYSURU_BUS_ROUTES);
  const [poolGroups, setPoolGroups] = useState<PoolGroup[]>(() => {
    const saved = localStorage.getItem('yatrisync_pools');
    return saved ? JSON.parse(saved) : INITIAL_POOL_GROUPS;
  });
  const [buses, setBuses] = useState<BusVehicle[]>(() => {
    const saved = localStorage.getItem('yatrisync_buses');
    return saved ? JSON.parse(saved) : INITIAL_BUS_FLEET;
  });
  const [walletBalance, setWalletBalance] = useState<number>(() => {
    const saved = localStorage.getItem('yatrisync_wallet');
    return saved ? Number(saved) : 480;
  });
  const [reservedAmount, setReservedAmount] = useState<number>(() => {
    const saved = localStorage.getItem('yatrisync_reserved');
    return saved ? Number(saved) : 0;
  });
  const [transactions, setTransactions] = useState<WalletTransaction[]>(() => {
    const saved = localStorage.getItem('yatrisync_txns');
    return saved ? JSON.parse(saved) : [
      {
        id: 'TXN-9001',
        timestamp: '10:30 AM',
        amount: 500,
        type: 'TOPUP',
        description: 'Simulated Wallet Welcome Credit',
        balanceAfter: 500,
      },
    ];
  });
  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('yatrisync_bookings');
    if (saved) return JSON.parse(saved);
    // Seed initial active confirmed booking for instant testing
    return [
      {
        id: 'BK-1001',
        type: 'TRAIN_POOL',
        passengerId: 'user-001',
        passengerName: 'Kavitha Hegde',
        passengerPhone: '+91 98860 11223',
        trainNumber: '20607',
        trainName: 'Vande Bharat Express',
        pnr: '4231889021',
        routeId: '119',
        destination: 'Infosys Campus / Hebbal Electronic City',
        pickupStop: 'Mysuru Junction (MYS) - Main Concourse Bay 2 (PF 1 Exit)',
        seatCount: 2,
        farePerSeat: 35,
        totalFare: 70,
        fareStatus: 'CAPTURED',
        bookingStatus: 'CONFIRMED',
        poolGroupId: 'pool-active-20',
        busId: 'bus-01',
        busRegNumber: 'KA-09-F-2144',
        departureTime: '12:45 PM',
        pickupGate: 'Platform 1 Exit - Bay 2',
        qrTicketCode: 'YS-MYS-BK1001-KA09F2144',
        createdAt: '11:40 AM',
      },
    ];
  });
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('yatrisync_notifs');
    return saved ? JSON.parse(saved) : [
      {
        id: 'notif-1',
        timestamp: '12:15 PM',
        title: 'Pooling Target Reached!',
        message: 'Chamundi Hill Corridor reached 20 seats! Operator allocation requested.',
        type: 'SUCCESS',
        read: false,
      },
      {
        id: 'notif-2',
        timestamp: '12:20 PM',
        title: 'Bus Allocated (KA-09-F-2144)',
        message: 'Electric Midi AC assigned for Infosys IT corridor. Boarding starts at Bay 2.',
        type: 'INFO',
        read: false,
      },
    ];
  });
  const [activeTicket, setActiveTicket] = useState<Booking | null>(null);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('yatrisync_pools', JSON.stringify(poolGroups));
  }, [poolGroups]);

  useEffect(() => {
    localStorage.setItem('yatrisync_buses', JSON.stringify(buses));
  }, [buses]);

  useEffect(() => {
    localStorage.setItem('yatrisync_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('yatrisync_wallet', walletBalance.toString());
  }, [walletBalance]);

  useEffect(() => {
    localStorage.setItem('yatrisync_reserved', reservedAmount.toString());
  }, [reservedAmount]);

  useEffect(() => {
    localStorage.setItem('yatrisync_txns', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('yatrisync_notifs', JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = (title: string, message: string, type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ALERT') => {
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      title,
      message,
      type,
      read: false,
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const topUpWallet = (amount: number) => {
    const newBal = walletBalance + amount;
    setWalletBalance(newBal);
    const txn: WalletTransaction = {
      id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      amount,
      type: 'TOPUP',
      description: 'Simulated UPI / Net Banking Top-Up',
      balanceAfter: newBal,
    };
    setTransactions(prev => [txn, ...prev]);
    addNotification('Wallet Topped Up', `₹${amount} added successfully. Available balance: ₹${newBal}`, 'SUCCESS');
  };

  const loginPassenger = (params: { name: string; phone: string; pnr?: string }) => {
    const session: AuthSession = {
      userId: `pax-${Date.now().toString().slice(-4)}`,
      name: params.name || 'Kavitha Hegde',
      emailOrPhone: params.phone || '+91 98860 11223',
      portal: 'passenger',
      pnr: params.pnr || '4231889021',
      loginTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setAuthSession(session);
    setRole('passenger');
    localStorage.setItem('yatrisync_auth_session', JSON.stringify(session));
    addNotification('Passenger Login Successful', `Welcome aboard, ${session.name}! Connect train to bus seamlessly.`, 'SUCCESS');
  };

  const loginStaff = (params: { name: string; staffRole: 'operator' | 'admin' | 'conductor'; badgeNumber: string }) => {
    const session: AuthSession = {
      userId: `staff-${Date.now().toString().slice(-4)}`,
      name: params.name || (params.staffRole === 'operator' ? 'Rajesh Rao (KSRTC Ops)' : params.staffRole === 'admin' ? 'Deepak Kumar (Transit Admin)' : 'Suresh Babu (Conductor)'),
      emailOrPhone: `${params.badgeNumber}@ksrtc.karnataka.gov.in`,
      portal: 'admin_operator',
      staffRole: params.staffRole,
      badgeNumber: params.badgeNumber,
      loginTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setAuthSession(session);
    setRole(params.staffRole);
    localStorage.setItem('yatrisync_auth_session', JSON.stringify(session));
    addNotification('Staff Operations Portal Access', `Authenticated with badge ${params.badgeNumber} as ${params.staffRole.toUpperCase()}.`, 'SUCCESS');
  };

  const logout = () => {
    setAuthSession(null);
    localStorage.removeItem('yatrisync_auth_session');
    addNotification('Signed Out', 'You have been securely signed out. Select a portal to log in again.', 'INFO');
  };

  // FR-02, FR-03, FR-07: Train Search and Passenger Booking with Escrow / Fare Reservation
  const createTrainPoolBooking = (params: {
    trainNumber: string;
    routeId: string;
    destination: string;
    seatCount: number;
    passengerName: string;
    phone: string;
    pnr: string;
    isWomenSafetyPriority?: boolean;
  }) => {
    const route = routes.find(r => r.routeId === params.routeId);
    const train = trains.find(t => t.trainNumber === params.trainNumber);
    const farePerSeat = route ? route.standardFare : 35;
    const totalFare = farePerSeat * params.seatCount;

    if (walletBalance < totalFare) {
      return {
        success: false,
        message: `Insufficient wallet balance (₹${walletBalance}). Required: ₹${totalFare}. Please top up wallet.`,
      };
    }

    // Deduct available balance and earmark in reservedAmount
    setWalletBalance(prev => prev - totalFare);
    setReservedAmount(prev => prev + totalFare);

    const bookingId = `BK-${Math.floor(5000 + Math.random() * 4999)}`;
    const qrTicketCode = `YS-MYS-${bookingId}-${params.trainNumber}`;

    // Wallet transaction: FARE_RESERVE
    const reserveTxn: WalletTransaction = {
      id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      amount: totalFare,
      type: 'FARE_RESERVE',
      description: `Fare Reserved for ${params.seatCount} seats to ${params.destination} (Pending Allocation)`,
      bookingId,
      balanceAfter: walletBalance - totalFare,
    };
    setTransactions(prev => [reserveTxn, ...prev]);

    // Find or create pool group
    const isLateNightTrain = params.trainNumber === '16228' || params.trainNumber === '06256';
    let targetPool = poolGroups.find(
      p => p.routeId === params.routeId && p.status !== 'DISPATCHED' && p.status !== 'CANCELLED'
    );

    let updatedPoolId = '';

    if (targetPool) {
      updatedPoolId = targetPool.id;
      const newBookedSeats = targetPool.bookedSeats + params.seatCount;
      const reached = newBookedSeats >= targetPool.targetThreshold;
      const isAlreadyAllocated = targetPool.status === 'BUS_ASSIGNED';

      const updatedPool: PoolGroup = {
        ...targetPool,
        bookedSeats: newBookedSeats,
        status: isAlreadyAllocated 
          ? 'BUS_ASSIGNED' 
          : reached 
            ? 'THRESHOLD_REACHED' 
            : targetPool.status,
        passengers: [
          ...targetPool.passengers,
          {
            bookingId,
            passengerName: params.passengerName,
            phone: params.phone,
            seatCount: params.seatCount,
            trainNumber: params.trainNumber,
            pnr: params.pnr,
            bookedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isWomenSafetyPriority: params.isWomenSafetyPriority,
          },
        ],
      };

      setPoolGroups(prev => prev.map(p => p.id === targetPool!.id ? updatedPool : p));

      if (reached && !isAlreadyAllocated) {
        addNotification(
          'Pooling Target Reached!',
          `Pool group for ${targetPool.targetDestination} hit the 20-seat threshold (${newBookedSeats} seats). Ready for operator dispatch!`,
          'SUCCESS'
        );
      }
    } else {
      const newPoolId = `pool-${Date.now()}`;
      updatedPoolId = newPoolId;
      const newPool: PoolGroup = {
        id: newPoolId,
        targetDestination: params.destination,
        corridorName: route?.corridorName || params.destination,
        routeId: params.routeId,
        arrivalWindowStart: train?.arrivalTime || '11:00 AM',
        arrivalWindowEnd: '12:30 PM',
        trainNumbers: [params.trainNumber],
        bookedSeats: params.seatCount,
        targetThreshold: 20,
        status: params.seatCount >= 20 ? 'THRESHOLD_REACHED' : 'COLLECTING',
        deadlineMinutesLeft: 30,
        isLateNight: isLateNightTrain,
        isPriorityFlagged: isLateNightTrain,
        priorityReason: isLateNightTrain ? 'Late night arrival corridor safety monitoring' : undefined,
        passengers: [
          {
            bookingId,
            passengerName: params.passengerName,
            phone: params.phone,
            seatCount: params.seatCount,
            trainNumber: params.trainNumber,
            pnr: params.pnr,
            bookedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isWomenSafetyPriority: params.isWomenSafetyPriority,
          },
        ],
      };
      setPoolGroups(prev => [...prev, newPool]);
    }

    const newBooking: Booking = {
      id: bookingId,
      type: 'TRAIN_POOL',
      passengerId: 'user-001',
      passengerName: params.passengerName,
      passengerPhone: params.phone,
      trainNumber: params.trainNumber,
      trainName: train?.trainName,
      pnr: params.pnr,
      routeId: params.routeId,
      destination: params.destination,
      pickupStop: 'Mysuru Junction (MYS) - Main Concourse Bay (PF 1 Exit)',
      seatCount: params.seatCount,
      farePerSeat,
      totalFare,
      fareStatus: 'RESERVED',
      bookingStatus: 'PENDING_POOL',
      poolGroupId: updatedPoolId,
      qrTicketCode,
      isWomenSafetyPriority: params.isWomenSafetyPriority,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setBookings(prev => [newBooking, ...prev]);
    addNotification(
      'Pooling Slot Reserved',
      `Reserved ${params.seatCount} seats to ${params.destination}. ₹${totalFare} earmarked in wallet escrow.`,
      'INFO'
    );

    return {
      success: true,
      bookingId,
      message: 'Seat pooling request submitted successfully!',
    };
  };

  // FR-05: Direct Bus Booking on already allocated bus
  const bookDirectBus = (params: {
    busId: string;
    seatCount: number;
    passengerName: string;
    phone: string;
  }) => {
    const bus = buses.find(b => b.id === params.busId);
    if (!bus) return { success: false, message: 'Bus not found.' };

    const pool = poolGroups.find(p => p.id === bus.currentPoolId);
    const route = routes.find(r => r.routeId === pool?.routeId);
    const farePerSeat = route ? route.standardFare : 30;
    const totalFare = farePerSeat * params.seatCount;

    const availableSeats = bus.totalCapacity - bus.reservedSeatsForTrain - bus.directBookedSeats - bus.enRouteBookedSeats;
    if (availableSeats < params.seatCount) {
      return { success: false, message: `Only ${availableSeats} direct seats available on this bus.` };
    }

    if (walletBalance < totalFare) {
      return { success: false, message: `Insufficient balance (₹${walletBalance}). Required: ₹${totalFare}.` };
    }

    // Direct booking immediately captures fare
    setWalletBalance(prev => prev - totalFare);

    const bookingId = `BK-DIR-${Math.floor(1000 + Math.random() * 9000)}`;
    const qrTicketCode = `YS-DIR-${bookingId}-${bus.regNumber}`;

    const captureTxn: WalletTransaction = {
      id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      amount: totalFare,
      type: 'FARE_CAPTURE',
      description: `Direct Bus Booking (${params.seatCount} seats on ${bus.regNumber})`,
      bookingId,
      balanceAfter: walletBalance - totalFare,
    };
    setTransactions(prev => [captureTxn, ...prev]);

    // Update bus direct seats
    setBuses(prev =>
      prev.map(b => (b.id === bus.id ? { ...b, directBookedSeats: b.directBookedSeats + params.seatCount } : b))
    );

    const newBooking: Booking = {
      id: bookingId,
      type: 'DIRECT_BUS',
      passengerId: 'user-001',
      passengerName: params.passengerName,
      passengerPhone: params.phone,
      routeId: pool?.routeId || 'DIRECT',
      destination: pool?.targetDestination || 'City Bus Route',
      pickupStop: bus.pickupLocation,
      seatCount: params.seatCount,
      farePerSeat,
      totalFare,
      fareStatus: 'CAPTURED',
      bookingStatus: 'CONFIRMED',
      busId: bus.id,
      busRegNumber: bus.regNumber,
      departureTime: bus.assignedDepartureTime || '12:45 PM',
      pickupGate: bus.pickupLocation,
      qrTicketCode,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setBookings(prev => [newBooking, ...prev]);
    setActiveTicket(newBooking);
    addNotification('Direct Bus Confirmed', `Confirmed ${params.seatCount} seats on ${bus.regNumber}. QR Ticket ready!`, 'SUCCESS');

    return { success: true, bookingId, message: 'Direct bus seat booked successfully!' };
  };

  // FR-06: En-Route Pickup Booking
  const bookEnRoutePickup = (params: {
    busId: string;
    stopId: string;
    seatCount: number;
    passengerName: string;
    phone: string;
  }) => {
    const bus = buses.find(b => b.id === params.busId);
    if (!bus) return { success: false, message: 'Bus not found.' };

    const pool = poolGroups.find(p => p.id === bus.currentPoolId);
    const route = routes.find(r => r.routeId === pool?.routeId);
    const stop = route?.approvedPickupStops.find(s => s.id === params.stopId);

    if (!stop) return { success: false, message: 'Invalid approved stop.' };

    const farePerSeat = stop.fare;
    const totalFare = farePerSeat * params.seatCount;

    const availableSeats = bus.totalCapacity - bus.reservedSeatsForTrain - bus.directBookedSeats - bus.enRouteBookedSeats;
    if (availableSeats < params.seatCount) {
      return { success: false, message: `Only ${availableSeats} seats remaining for en-route pickup.` };
    }

    if (walletBalance < totalFare) {
      return { success: false, message: `Insufficient balance (₹${walletBalance}). Required: ₹${totalFare}.` };
    }

    setWalletBalance(prev => prev - totalFare);

    const bookingId = `BK-ENR-${Math.floor(1000 + Math.random() * 9000)}`;
    const qrTicketCode = `YS-ENR-${bookingId}-${bus.regNumber}`;

    const captureTxn: WalletTransaction = {
      id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      amount: totalFare,
      type: 'FARE_CAPTURE',
      description: `En-Route Boarding at ${stop.name} (${params.seatCount} seats)`,
      bookingId,
      balanceAfter: walletBalance - totalFare,
    };
    setTransactions(prev => [captureTxn, ...prev]);

    setBuses(prev =>
      prev.map(b => (b.id === bus.id ? { ...b, enRouteBookedSeats: b.enRouteBookedSeats + params.seatCount } : b))
    );

    const newBooking: Booking = {
      id: bookingId,
      type: 'EN_ROUTE_PICKUP',
      passengerId: 'user-001',
      passengerName: params.passengerName,
      passengerPhone: params.phone,
      routeId: pool?.routeId || 'EN_ROUTE',
      destination: pool?.targetDestination || route?.destination || 'Destination',
      pickupStop: `${stop.name} (${stop.landmark})`,
      seatCount: params.seatCount,
      farePerSeat,
      totalFare,
      fareStatus: 'CAPTURED',
      bookingStatus: 'CONFIRMED',
      busId: bus.id,
      busRegNumber: bus.regNumber,
      departureTime: `ETA +${stop.etaMinutes} mins`,
      pickupGate: stop.landmark,
      qrTicketCode,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setBookings(prev => [newBooking, ...prev]);
    setActiveTicket(newBooking);
    addNotification('En-Route Pickup Confirmed', `Pickup confirmed at ${stop.name}. Bus ${bus.regNumber}.`, 'SUCCESS');

    return { success: true, bookingId, message: 'En-route pickup booked successfully!' };
  };

  // FR-04, FR-07, FR-08: Operator Allocation Approval
  const approveAllocation = (poolId: string, busId: string, departureTime: string, pickupGate: string) => {
    const pool = poolGroups.find(p => p.id === poolId);
    const bus = buses.find(b => b.id === busId);
    if (!pool || !bus) return;

    // Update pool: MUST clear isPriorityFlagged so request disappears cleanly from pending queue!
    setPoolGroups(prev =>
      prev.map(p =>
        p.id === poolId
          ? {
              ...p,
              status: 'BUS_ASSIGNED',
              isPriorityFlagged: false,
              allocatedBusId: bus.id,
              allocatedBusNumber: bus.regNumber,
              departureTime,
              pickupGate,
            }
          : p
      )
    );

    // Update bus: Set to boarding and reserve seats
    setBuses(prev =>
      prev.map(b =>
        b.id === busId
          ? {
              ...b,
              status: 'BOARDING',
              currentPoolId: poolId,
              assignedDepartureTime: departureTime,
              pickupLocation: `Mysuru Junction (MYS) - ${pickupGate}`,
              reservedSeatsForTrain: pool.bookedSeats,
            }
          : b
      )
    );

    // Capture reserved fare for all bookings in this pool!
    setBookings(prev =>
      prev.map(booking => {
        if (booking.poolGroupId === poolId && (booking.bookingStatus === 'PENDING_POOL' || booking.bookingStatus === 'AWAITING_OPERATOR')) {
          // Release reserved escrow fare and capture
          setReservedAmount(curr => Math.max(0, curr - booking.totalFare));
          const captureTxn: WalletTransaction = {
            id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            amount: booking.totalFare,
            type: 'FARE_CAPTURE',
            description: `Fare Captured: Bus ${bus.regNumber} confirmed to ${pool.targetDestination}`,
            bookingId: booking.id,
            balanceAfter: walletBalance,
          };
          setTransactions(t => [captureTxn, ...t]);

          return {
            ...booking,
            bookingStatus: 'CONFIRMED',
            fareStatus: 'CAPTURED',
            busId: bus.id,
            busRegNumber: bus.regNumber,
            departureTime,
            pickupGate,
          };
        }
        return booking;
      })
    );

    addNotification(
      'Allocation Approved & Dispatched',
      `Bus ${bus.regNumber} assigned to ${pool.targetDestination}. Departs at ${departureTime} from ${pickupGate}.`,
      'SUCCESS'
    );
  };

  // FR-04, FR-07: Operator Rejection & Fare Release
  const rejectAllocation = (poolId: string, reason: string) => {
    const pool = poolGroups.find(p => p.id === poolId);
    if (!pool) return;

    // Clear priority flag and set CANCELLED
    setPoolGroups(prev =>
      prev.map(p => (p.id === poolId ? { ...p, status: 'CANCELLED', isPriorityFlagged: false } : p))
    );

    // Refund / release reserved escrow funds for all bookings in this pool
    setBookings(prev =>
      prev.map(booking => {
        if (booking.poolGroupId === poolId) {
          if (booking.fareStatus === 'RESERVED') {
            setReservedAmount(curr => Math.max(0, curr - booking.totalFare));
            setWalletBalance(curr => curr + booking.totalFare);

            const refundTxn: WalletTransaction = {
              id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              amount: booking.totalFare,
              type: 'FARE_REFUND',
              description: `Escrow Released: Allocation declined by operator (${reason})`,
              bookingId: booking.id,
              balanceAfter: walletBalance + booking.totalFare,
            };
            setTransactions(t => [refundTxn, ...t]);
          }
          return {
            ...booking,
            bookingStatus: 'CANCELLED',
            fareStatus: 'REFUNDED',
          };
        }
        return booking;
      })
    );

    addNotification(
      'Allocation Rejected',
      `Request for ${pool.targetDestination} was declined: ${reason}. All passenger wallet funds released.`,
      'ALERT'
    );
  };

  // Fleet management: Depart bus (frees bus back to standby)
  const departBus = (busId: string) => {
    const bus = buses.find(b => b.id === busId);
    setBuses(prev =>
      prev.map(b =>
        b.id === busId
          ? {
              ...b,
              status: 'STANDBY',
              currentPoolId: undefined,
              assignedDepartureTime: undefined,
              reservedSeatsForTrain: 0,
              directBookedSeats: 0,
              enRouteBookedSeats: 0,
            }
          : b
      )
    );
    if (bus?.currentPoolId) {
      setPoolGroups(prev =>
        prev.map(p => (p.id === bus.currentPoolId ? { ...p, status: 'DISPATCHED' } : p))
      );
    }
    addNotification('Bus Departed & Fleet Ready', `Bus ${bus?.regNumber || busId} departed. Feeder vehicle returned to Standby for new allocations!`, 'INFO');
  };

  // Fleet management: Quick add standby bus to ensure operator is never blocked
  const addBusToFleet = (regNumber?: string, busType?: string) => {
    const num = Math.floor(1000 + Math.random() * 9000);
    const newBus: BusVehicle = {
      id: `bus-dyn-${num}`,
      regNumber: regNumber || `KA-09-F-${num}`,
      busType: (busType as any) || 'Electric Midi AC',
      totalCapacity: 32,
      operatorName: 'KSRTC Mysuru City Feeder Fleet',
      driverName: 'Santhosh M.',
      driverPhone: '+91 94485 22001',
      conductorName: 'Lokesh Gowda',
      conductorPhone: '+91 94485 22002',
      status: 'STANDBY',
      pickupLocation: 'Mysuru Junction (MYS) - Main Concourse Bay 1',
      reservedSeatsForTrain: 0,
      directBookedSeats: 0,
      enRouteBookedSeats: 0,
      isWheelchairAccessible: true,
    };
    setBuses(prev => [newBus, ...prev]);
    addNotification('Standby Bus Added', `Bus ${newBus.regNumber} (${newBus.busType}) added to standby fleet!`, 'SUCCESS');
  };

  // AI Multimodal: Interactive Train Delay Simulator & Auto Recalculator
  const updateTrainDelay = (trainNumber: string, delayMinutes: number) => {
    setTrains(prev =>
      prev.map(t => (t.trainNumber === trainNumber ? { ...t, delayMinutes } : t))
    );

    // Adjust arrival windows for matching pools
    setPoolGroups(prev =>
      prev.map(pool => {
        if (pool.trainNumbers.includes(trainNumber)) {
          return {
            ...pool,
            arrivalWindowEnd: delayMinutes > 0 ? `+${delayMinutes}m adjusted` : pool.arrivalWindowEnd,
          };
        }
        return pool;
      })
    );

    addNotification(
      'Train Arrival Updated',
      `Train #${trainNumber} delay set to ${delayMinutes} min. Passenger deboarding windows recalculated.`,
      delayMinutes > 20 ? 'WARNING' : 'INFO'
    );
  };

  // AI Multimodal: Bus Departure Rescheduling
  const rescheduleBusForDelay = (poolId: string, newDepartureTime: string) => {
    const pool = poolGroups.find(p => p.id === poolId);
    setPoolGroups(prev =>
      prev.map(p => (p.id === poolId ? { ...p, departureTime: newDepartureTime } : p))
    );
    if (pool?.allocatedBusId) {
      setBuses(prev =>
        prev.map(b => (b.id === pool.allocatedBusId ? { ...b, assignedDepartureTime: newDepartureTime } : b))
      );
    }
    setBookings(prev =>
      prev.map(b => (b.poolGroupId === poolId ? { ...b, departureTime: newDepartureTime } : b))
    );
    addNotification(
      'Bus Departure Rescheduled',
      `Departure for ${pool?.targetDestination || 'pool'} synchronized to ${newDepartureTime}. Passenger advisory broadcasted!`,
      'SUCCESS'
    );
  };

  // AI Multimodal: Smart Group Merging (e.g., 12 passengers + 8 passengers -> 20 seats)
  const mergePoolGroups = (primaryPoolId: string, secondaryPoolId: string) => {
    const primary = poolGroups.find(p => p.id === primaryPoolId);
    const secondary = poolGroups.find(p => p.id === secondaryPoolId);
    if (!primary || !secondary) return;

    const mergedSeats = primary.bookedSeats + secondary.bookedSeats;
    const mergedPassengers = [...primary.passengers, ...secondary.passengers];
    const mergedTrains = Array.from(new Set([...primary.trainNumbers, ...secondary.trainNumbers]));

    setPoolGroups(prev => {
      return prev
        .filter(p => p.id !== secondaryPoolId)
        .map(p => {
          if (p.id === primaryPoolId) {
            return {
              ...p,
              targetDestination: `${primary.targetDestination} & ${secondary.targetDestination}`,
              corridorName: `${primary.corridorName} (Combined Feeder Express)`,
              bookedSeats: mergedSeats,
              targetThreshold: 20,
              status: mergedSeats >= 20 ? 'THRESHOLD_REACHED' : 'COLLECTING',
              trainNumbers: mergedTrains,
              passengers: mergedPassengers,
              aiMatchScore: 99,
              predictedTimeTo20Min: 0,
              operatingCostEstimate: Math.round(((primary.operatingCostEstimate || 400) + (secondary.operatingCostEstimate || 400)) * 0.75),
              compatibleWithPoolId: undefined,
            };
          }
          return p;
        });
    });

    setBookings(prev =>
      prev.map(b => (b.poolGroupId === secondaryPoolId ? { ...b, poolGroupId: primaryPoolId } : b))
    );

    addNotification(
      'AI Smart Pool Groups Merged!',
      `Combined ${primary.bookedSeats} + ${secondary.bookedSeats} passengers into a single 20-seat threshold dispatch unit!`,
      'SUCCESS'
    );
  };

  // Safety: Emergency SOS Broadcast
  const triggerEmergencySOS = (passengerName: string, bookingId: string, location: string): string => {
    const sosRef = `SOS-MYS-${Math.floor(100000 + Math.random() * 900000)}`;
    addNotification(
      'EMERGENCY SOS BROADCASTED',
      `RPF Mysuru Jn & KSRTC Night Ops alerted for ${passengerName}. Priority security unit dispatched to ${location}. Ref: ${sosRef}`,
      'ALERT'
    );
    return sosRef;
  };

  // Demo helper: Reset everything to seed data
  const resetDataToSeed = () => {
    localStorage.removeItem('yatrisync_pools');
    localStorage.removeItem('yatrisync_buses');
    localStorage.removeItem('yatrisync_bookings');
    localStorage.removeItem('yatrisync_wallet');
    localStorage.removeItem('yatrisync_reserved');
    localStorage.removeItem('yatrisync_txns');
    localStorage.removeItem('yatrisync_trains');
    setPoolGroups(INITIAL_POOL_GROUPS);
    setBuses(INITIAL_BUS_FLEET);
    setTrains(MYSURU_TRAINS);
    setWalletBalance(480);
    setReservedAmount(0);
    setBookings([
      {
        id: 'BK-1001',
        type: 'TRAIN_POOL',
        passengerId: 'user-001',
        passengerName: 'Kavitha Hegde',
        passengerPhone: '+91 98860 11223',
        trainNumber: '20607',
        trainName: 'Vande Bharat Express',
        pnr: '4231889021',
        routeId: '119',
        destination: 'Infosys Campus / Hebbal Electronic City',
        pickupStop: 'Mysuru Junction (MYS) - Main Concourse Bay 2 (PF 1 Exit)',
        seatCount: 2,
        farePerSeat: 35,
        totalFare: 70,
        fareStatus: 'CAPTURED',
        bookingStatus: 'CONFIRMED',
        poolGroupId: 'pool-active-20',
        busId: 'bus-01',
        busRegNumber: 'KA-09-F-2144',
        departureTime: '12:45 PM',
        pickupGate: 'Platform 1 Exit - Bay 2',
        qrTicketCode: 'YS-MYS-BK1001-KA09F2144',
        createdAt: '11:40 AM',
      },
    ]);
    addNotification('Demo State Reset', 'Restored pristine initial pooling data, fleet, and train schedules.', 'INFO');
  };

  // FR-11: Late-Night Priority Exception Review
  const addEmergencyAllocationReview = (poolId: string) => {
    setPoolGroups(prev =>
      prev.map(p =>
        p.id === poolId
          ? {
              ...p,
              status: 'ALLOCATION_REQUESTED',
              isPriorityFlagged: true,
              priorityReason: 'Late-Night Safety Override: Operator initiated urgent review for onward connection.',
            }
          : p
      )
    );
    addNotification('Safety Priority Review Initiated', 'Late-night pool sent for urgent operator allocation review.', 'WARNING');
  };

  // FR-08: Conductor QR Code Scanner with Duplicate Scan Prevention
  const verifyAndBoardTicket = (ticketCode: string) => {
    const booking = bookings.find(b => b.qrTicketCode.trim() === ticketCode.trim());
    if (!booking) {
      return {
        success: false,
        message: 'Invalid Ticket! No matching reservation found for this QR code.',
      };
    }

    if (booking.bookingStatus === 'BOARDED') {
      return {
        success: false,
        duplicate: true,
        booking,
        message: `DUPLICATE QR SCAN DETECTED: Passenger ${booking.passengerName} was already marked as BOARDED at ${booking.boardedAt}. Re-entry is rejected.`,
      };
    }

    if (booking.bookingStatus !== 'CONFIRMED') {
      return {
        success: false,
        booking,
        message: `Ticket cannot be boarded: Current status is '${booking.bookingStatus}' (Must be CONFIRMED).`,
      };
    }

    const boardedAtTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setBookings(prev =>
      prev.map(b => (b.id === booking.id ? { ...b, bookingStatus: 'BOARDED', boardedAt: boardedAtTime } : b))
    );

    addNotification(
      'Passenger Boarded',
      `${booking.passengerName} (${booking.seatCount} seats) successfully boarded bus ${booking.busRegNumber || 'YatriSync'}.`,
      'SUCCESS'
    );

    return {
      success: true,
      duplicate: false,
      booking: { ...booking, bookingStatus: 'BOARDED' as const, boardedAt: boardedAtTime },
      message: `Verified! Welcome aboard ${booking.passengerName} (${booking.seatCount} seats). Marked as BOARDED.`,
    };
  };

  // FR-10: Journey Recovery Options
  const getRecoveryOptionsForBooking = (bookingId: string): AlternativeTransportOption[] => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return [];

    return [
      {
        type: 'NEXT_YATRISYNC_BUS',
        title: 'Transfer to Next Allocated YatriSync Bus',
        departureTime: '01:15 PM (Bay 1)',
        boardingPoint: 'Mysuru Junction Main Concourse - Platform 1 Bay 1',
        estimatedFare: booking.totalFare,
        travelTime: '30 mins',
        description: 'Direct transfer with your existing ticket. Validated with operator fleet KA-09-F-3301.',
        verified: true,
      },
      {
        type: 'KSRTC_REGULAR_CBS',
        title: 'KSRTC Regular City Bus (CBS Stand)',
        departureTime: 'Every 10-15 mins',
        boardingPoint: 'City Bus Stand (CBS) - Platform 4 (300m walk from Station)',
        estimatedFare: Math.round(booking.totalFare * 0.8),
        travelTime: '40 mins',
        description: 'Frequent suburban service. Route 119/201 operates continuously with smart card or cash.',
        verified: true,
      },
      {
        type: 'PREPAID_AUTO_TAXI',
        title: 'Mysuru City Police Prepaid Auto / Taxi Counter',
        departureTime: 'Immediate (24x7)',
        boardingPoint: 'Main Portico Outside Station Exit (Next to Tourist Police Booth)',
        estimatedFare: Math.round(booking.seatCount * 120),
        travelTime: '20 mins',
        description: 'Government regulated prepaid meter counter. Safe, fixed rates, computerized receipt.',
        verified: true,
      },
    ];
  };

  const executeRecoveryOption = (bookingId: string, option: AlternativeTransportOption) => {
    if (option.type === 'NEXT_YATRISYNC_BUS') {
      setBookings(prev =>
        prev.map(b =>
          b.id === bookingId
            ? {
                ...b,
                bookingStatus: 'CONFIRMED',
                busRegNumber: 'KA-09-F-3301 (Reassigned)',
                departureTime: option.departureTime,
                pickupGate: option.boardingPoint,
              }
            : b
        )
      );
      addNotification('Journey Recovered', `Transferred to alternative bus (${option.departureTime}).`, 'SUCCESS');
    } else {
      // Release funds and refund
      const booking = bookings.find(b => b.id === bookingId);
      if (booking) {
        setWalletBalance(curr => curr + booking.totalFare);
        setBookings(prev =>
          prev.map(b => (b.id === bookingId ? { ...b, bookingStatus: 'RECOVERED', fareStatus: 'REFUNDED' } : b))
        );
        const refundTxn: WalletTransaction = {
          id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          amount: booking.totalFare,
          type: 'FARE_REFUND',
          description: `Recovery Refund: ${option.title}`,
          bookingId,
          balanceAfter: walletBalance + booking.totalFare,
        };
        setTransactions(t => [refundTxn, ...t]);
      }
      addNotification('Recovery Confirmed', `Wallet refunded ₹${booking?.totalFare}. Proceed to ${option.boardingPoint}.`, 'INFO');
    }
  };

  const cancelBooking = (bookingId: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;

    if (booking.fareStatus === 'RESERVED') {
      setReservedAmount(curr => Math.max(0, curr - booking.totalFare));
      setWalletBalance(curr => curr + booking.totalFare);
    } else if (booking.fareStatus === 'CAPTURED') {
      setWalletBalance(curr => curr + booking.totalFare);
    }

    const refundTxn: WalletTransaction = {
      id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      amount: booking.totalFare,
      type: 'FARE_REFUND',
      description: `Cancelled Booking Refund for ${booking.destination}`,
      bookingId,
      balanceAfter: walletBalance + booking.totalFare,
    };
    setTransactions(t => [refundTxn, ...t]);

    setBookings(prev =>
      prev.map(b => (b.id === bookingId ? { ...b, bookingStatus: 'CANCELLED', fareStatus: 'REFUNDED' } : b))
    );

    // If pool group, subtract seats
    if (booking.poolGroupId) {
      setPoolGroups(prev =>
        prev.map(p => {
          if (p.id === booking.poolGroupId) {
            const updatedSeats = Math.max(0, p.bookedSeats - booking.seatCount);
            return {
              ...p,
              bookedSeats: updatedSeats,
              passengers: p.passengers.filter(pass => pass.bookingId !== bookingId),
              status: updatedSeats >= p.targetThreshold ? p.status : 'COLLECTING',
            };
          }
          return p;
        })
      );
    }

    addNotification('Booking Cancelled', `Refund of ₹${booking.totalFare} credited back to wallet escrow.`, 'INFO');
  };

  // Demo simulation helper: Add passengers to quickly hit 20 seats
  const simulateAddPassengersToPool = (poolId: string, seatsToAdd: number) => {
    setPoolGroups(prev =>
      prev.map(pool => {
        if (pool.id === poolId) {
          const newTotal = pool.bookedSeats + seatsToAdd;
          const reached = newTotal >= pool.targetThreshold;
          const simPassenger = {
            bookingId: `BK-SIM-${Math.floor(1000 + Math.random() * 9000)}`,
            passengerName: `Co-passenger Group (+${seatsToAdd})`,
            phone: '+91 99887 00000',
            seatCount: seatsToAdd,
            trainNumber: pool.trainNumbers[0] || '20607',
            pnr: `SIM${Date.now().toString().slice(-6)}`,
            bookedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };

          if (reached && pool.status === 'COLLECTING') {
            addNotification(
              'Pooling Threshold Reached!',
              `Pool '${pool.corridorName}' now has ${newTotal} seats! Allocation request sent to operator.`,
              'SUCCESS'
            );
          }

          return {
            ...pool,
            bookedSeats: newTotal,
            status: reached && pool.status === 'COLLECTING' ? 'THRESHOLD_REACHED' : pool.status,
            passengers: [...pool.passengers, simPassenger],
          };
        }
        return pool;
      })
    );
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        authSession,
        loginPassenger,
        loginStaff,
        logout,
        trains,
        routes,
        poolGroups,
        buses,
        bookings,
        walletBalance,
        reservedAmount,
        transactions,
        notifications,
        activeTicket,
        setActiveTicket,
        createTrainPoolBooking,
        bookDirectBus,
        bookEnRoutePickup,
        cancelBooking,
        topUpWallet,
        approveAllocation,
        rejectAllocation,
        addEmergencyAllocationReview,
        departBus,
        addBusToFleet,
        updateTrainDelay,
        rescheduleBusForDelay,
        mergePoolGroups,
        triggerEmergencySOS,
        resetDataToSeed,
        verifyAndBoardTicket,
        getRecoveryOptionsForBooking,
        executeRecoveryOption,
        simulateAddPassengersToPool,
        addNotification,
        markNotificationRead,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
