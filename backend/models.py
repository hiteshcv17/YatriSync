from sqlalchemy import Column, Integer, String, Float, Boolean, JSON, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class Train(Base):
    __tablename__ = "trains"

    id = Column(Integer, primary_key=True, index=True)
    train_number = Column(String, unique=True, index=True)
    train_name = Column(String)
    arrival_time = Column(String)
    origin_station = Column(String)
    destination_station = Column(String, default="Mysuru Junction (MYS)")
    service_type = Column(String)
    platform = Column(String, default="PF 1")
    delay_minutes = Column(Integer, default=0)

class BusRoute(Base):
    __tablename__ = "bus_routes"

    id = Column(Integer, primary_key=True, index=True)
    route_id = Column(String, unique=True, index=True)
    route_type = Column(String)
    source = Column(String, default="City Bus Stand (CBS)")
    destination = Column(String)
    corridor_name = Column(String)
    major_stops = Column(JSON)  # list of strings
    approved_pickup_stops = Column(JSON)  # list of dicts with id, name, landmark, fare, eta
    standard_fare = Column(Float, default=30.0)
    frequency_type = Column(String, default="Regular")

class PoolGroup(Base):
    __tablename__ = "pool_groups"

    id = Column(String, primary_key=True, index=True)
    target_destination = Column(String, index=True)
    corridor_name = Column(String)
    route_id = Column(String, index=True)
    arrival_window_start = Column(String)
    arrival_window_end = Column(String)
    train_numbers = Column(JSON)  # list of train numbers
    booked_seats = Column(Integer, default=0)
    target_threshold = Column(Integer, default=20)  # Standard 20 seats
    status = Column(String, default="COLLECTING")  # COLLECTING, THRESHOLD_REACHED, ALLOCATION_REQUESTED, BUS_ASSIGNED, CANCELLED
    deadline_minutes_left = Column(Integer, default=30)
    is_late_night = Column(Boolean, default=False)
    is_priority_flagged = Column(Boolean, default=False)
    priority_reason = Column(String, nullable=True)
    allocated_bus_id = Column(String, nullable=True)
    allocated_bus_number = Column(String, nullable=True)
    departure_time = Column(String, nullable=True)
    pickup_gate = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    bookings = relationship("Booking", back_populates="pool_group")

class BusVehicle(Base):
    __tablename__ = "buses"

    id = Column(String, primary_key=True, index=True)
    reg_number = Column(String, unique=True, index=True)
    bus_type = Column(String)
    total_capacity = Column(Integer, default=32)
    operator_name = Column(String)
    driver_name = Column(String)
    driver_phone = Column(String)
    conductor_name = Column(String)
    conductor_phone = Column(String)
    status = Column(String, default="STANDBY")  # STANDBY, ASSIGNED, BOARDING, DEPARTED
    current_pool_id = Column(String, nullable=True)
    assigned_departure_time = Column(String, nullable=True)
    pickup_location = Column(String)
    reserved_seats_for_train = Column(Integer, default=0)
    direct_booked_seats = Column(Integer, default=0)
    en_route_booked_seats = Column(Integer, default=0)

class Booking(Base):
    __tablename__ = "bookings"

    id = Column(String, primary_key=True, index=True)
    type = Column(String, default="TRAIN_POOL")  # TRAIN_POOL, DIRECT_BUS, EN_ROUTE_PICKUP
    passenger_id = Column(String, default="user-001")
    passenger_name = Column(String)
    passenger_phone = Column(String)
    train_number = Column(String, nullable=True)
    train_name = Column(String, nullable=True)
    pnr = Column(String, nullable=True)
    route_id = Column(String)
    destination = Column(String)
    pickup_stop = Column(String)
    seat_count = Column(Integer, default=1)
    fare_per_seat = Column(Float)
    total_fare = Column(Float)
    fare_status = Column(String, default="RESERVED")  # RESERVED, CAPTURED, REFUNDED
    booking_status = Column(String, default="PENDING_POOL")  # PENDING_POOL, CONFIRMED, BOARDED, CANCELLED, RECOVERED
    pool_group_id = Column(String, ForeignKey("pool_groups.id"), nullable=True)
    bus_id = Column(String, nullable=True)
    bus_reg_number = Column(String, nullable=True)
    departure_time = Column(String, nullable=True)
    pickup_gate = Column(String, nullable=True)
    qr_ticket_code = Column(String, unique=True, index=True)
    boarded_at = Column(String, nullable=True)
    is_women_safety_priority = Column(Boolean, default=False)
    created_at = Column(String)

    pool_group = relationship("PoolGroup", back_populates="bookings")

class Wallet(Base):
    __tablename__ = "wallets"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, unique=True, index=True)
    balance = Column(Float, default=500.0)
    reserved_amount = Column(Float, default=0.0)

class WalletTransaction(Base):
    __tablename__ = "wallet_transactions"

    id = Column(String, primary_key=True, index=True)
    timestamp = Column(String)
    amount = Column(Float)
    type = Column(String)  # TOPUP, FARE_RESERVE, FARE_CAPTURE, FARE_REFUND
    description = Column(String)
    booking_id = Column(String, nullable=True)
    balance_after = Column(Float)
