from typing import List, Optional, Any
from pydantic import BaseModel

class TrainSchema(BaseModel):
    train_number: str
    train_name: str
    arrival_time: str
    origin_station: str
    destination_station: str
    service_type: str
    platform: str
    delay_minutes: int

    class Config:
        from_attributes = True

class ApprovedStopSchema(BaseModel):
    id: str
    name: str
    landmark: str
    kmFromStation: float
    etaMinutes: int
    fare: float

class BusRouteSchema(BaseModel):
    route_id: str
    route_type: str
    source: str
    destination: str
    corridor_name: str
    major_stops: List[str]
    approved_pickup_stops: List[Any]
    standard_fare: float
    frequency_type: str

    class Config:
        from_attributes = True

class PoolPassengerSchema(BaseModel):
    booking_id: str
    passenger_name: str
    phone: str
    seat_count: int
    train_number: str
    pnr: Optional[str] = None
    booked_at: str
    is_women_safety_priority: Optional[bool] = False

class PoolGroupSchema(BaseModel):
    id: str
    target_destination: str
    corridor_name: str
    route_id: str
    arrival_window_start: str
    arrival_window_end: str
    train_numbers: List[str]
    booked_seats: int
    target_threshold: int
    status: str
    deadline_minutes_left: int
    is_late_night: bool
    is_priority_flagged: bool
    priority_reason: Optional[str] = None
    allocated_bus_id: Optional[str] = None
    allocated_bus_number: Optional[str] = None
    departure_time: Optional[str] = None
    pickup_gate: Optional[str] = None
    passengers: Optional[List[PoolPassengerSchema]] = []

    class Config:
        from_attributes = True

class BookingCreateRequest(BaseModel):
    train_number: str
    route_id: str
    destination: str
    seat_count: int
    passenger_name: str
    phone: str
    pnr: str
    is_women_safety_priority: Optional[bool] = False

class DirectBookingRequest(BaseModel):
    bus_id: str
    seat_count: int
    passenger_name: str
    phone: str

class EnRouteBookingRequest(BaseModel):
    bus_id: str
    stop_id: str
    seat_count: int
    passenger_name: str
    phone: str

class AllocationApproveRequest(BaseModel):
    pool_id: str
    bus_id: str
    departure_time: str
    pickup_gate: str

class AllocationRejectRequest(BaseModel):
    pool_id: str
    reason: str

class QRScanRequest(BaseModel):
    ticket_code: str

class TopUpRequest(BaseModel):
    amount: float
