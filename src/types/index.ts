export type UserRole = 'passenger' | 'operator' | 'conductor' | 'admin';
export type PortalType = 'passenger' | 'admin_operator';

export interface AuthSession {
  userId: string;
  name: string;
  emailOrPhone: string;
  portal: PortalType;
  staffRole?: 'operator' | 'admin' | 'conductor';
  badgeNumber?: string;
  pnr?: string;
  loginTime: string;
}

export type ServiceType = 'High-Speed' | 'Premium Express' | 'Express' | 'Regional / Commuter';

export interface Train {
  trainNumber: string;
  trainName: string;
  arrivalTime: string;
  originStation: string;
  destinationStation: string;
  serviceType: ServiceType;
  platform: string;
  delayMinutes: number;
}

export interface ApprovedStop {
  id: string;
  name: string;
  landmark: string;
  kmFromStation: number;
  etaMinutes: number;
  fare: number;
}

export interface BusRoute {
  routeId: string;
  routeType: string;
  source: string;
  destination: string;
  corridorName: string;
  majorStops: string[];
  approvedPickupStops: ApprovedStop[];
  standardFare: number;
  frequencyType: string;
}

export interface PooledPassenger {
  bookingId: string;
  passengerName: string;
  phone: string;
  seatCount: number;
  trainNumber: string;
  pnr: string;
  bookedAt: string;
  isWomenSafetyPriority?: boolean;
}

export type PoolStatus = 
  | 'COLLECTING' 
  | 'THRESHOLD_REACHED' 
  | 'ALLOCATION_REQUESTED' 
  | 'BUS_ASSIGNED' 
  | 'DISPATCHED' 
  | 'EXPIRED' 
  | 'CANCELLED';

export interface PoolGroup {
  id: string;
  targetDestination: string;
  corridorName: string;
  routeId: string;
  arrivalWindowStart: string;
  arrivalWindowEnd: string;
  trainNumbers: string[];
  bookedSeats: number;
  targetThreshold: number; // 20 seats standard
  status: PoolStatus;
  deadlineMinutesLeft: number;
  isLateNight: boolean;
  isPriorityFlagged: boolean; // FR-11: late-night below 20 seats
  priorityReason?: string;
  passengers: PooledPassenger[];
  allocatedBusId?: string;
  allocatedBusNumber?: string;
  departureTime?: string;
  pickupGate?: string;
  aiMatchScore?: number;
  predictedTimeTo20Min?: number;
  compatibleWithPoolId?: string;
  operatingCostEstimate?: number;
}

export type BusStatus = 'STANDBY' | 'ASSIGNED' | 'BOARDING' | 'DEPARTED';

export interface BusVehicle {
  id: string;
  regNumber: string;
  busType: 'Electric Midi AC' | 'Ashwamedha City Liner' | 'Corona Low-Floor AC' | 'Mysuru City Regular';
  totalCapacity: number;
  operatorName: string;
  driverName: string;
  driverPhone: string;
  conductorName: string;
  conductorPhone: string;
  status: BusStatus;
  currentPoolId?: string;
  assignedDepartureTime?: string;
  pickupLocation: string;
  reservedSeatsForTrain: number;
  directBookedSeats: number;
  enRouteBookedSeats: number;
  isWheelchairAccessible?: boolean;
}

export type BookingType = 'TRAIN_POOL' | 'DIRECT_BUS' | 'EN_ROUTE_PICKUP';
export type FareStatus = 'RESERVED' | 'CAPTURED' | 'REFUNDED';
export type BookingStatus = 'PENDING_POOL' | 'AWAITING_OPERATOR' | 'CONFIRMED' | 'BOARDED' | 'CANCELLED' | 'RECOVERED';

export interface Booking {
  id: string;
  type: BookingType;
  passengerId: string;
  passengerName: string;
  passengerPhone: string;
  trainNumber?: string;
  trainName?: string;
  pnr?: string;
  routeId: string;
  destination: string;
  pickupStop: string;
  seatCount: number;
  farePerSeat: number;
  totalFare: number;
  fareStatus: FareStatus;
  bookingStatus: BookingStatus;
  poolGroupId?: string;
  busId?: string;
  busRegNumber?: string;
  departureTime?: string;
  pickupGate?: string;
  qrTicketCode: string;
  boardedAt?: string;
  isWomenSafetyPriority?: boolean;
  createdAt: string;
}

export interface WalletTransaction {
  id: string;
  timestamp: string;
  amount: number;
  type: 'TOPUP' | 'FARE_RESERVE' | 'FARE_CAPTURE' | 'FARE_REFUND';
  description: string;
  bookingId?: string;
  balanceAfter: number;
}

export interface NotificationItem {
  id: string;
  timestamp: string;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ALERT';
  read: boolean;
  actionRoute?: string;
}

export interface AlternativeTransportOption {
  type: 'NEXT_YATRISYNC_BUS' | 'KSRTC_REGULAR_CBS' | 'PREPAID_AUTO_TAXI';
  title: string;
  departureTime: string;
  boardingPoint: string;
  estimatedFare: number;
  travelTime: string;
  description: string;
  verified: boolean;
}
