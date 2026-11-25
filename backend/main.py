import os
import random
from datetime import datetime
from typing import List
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from database import engine, Base, get_db, SessionLocal
import models
import schemas

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="YatriSync API – Train-to-Bus Connectivity Platform",
    description="Intelligent transportation coordination platform connecting railway arrivals at Mysuru Junction with onward bus transportation.",
    version="1.0.0"
)

# CORS Middleware for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Seed Database with Mysuru Datasets
def seed_initial_data(db: Session):
    if db.query(models.Train).count() == 0:
        sample_trains = [
            models.Train(train_number="20607", train_name="Vande Bharat Express", arrival_time="12:20 PM", origin_station="MGR Chennai Central (MAS)", destination_station="Mysuru Junction (MYS)", service_type="High-Speed", platform="PF 1", delay_minutes=0),
            models.Train(train_number="12007", train_name="Shatabdi Express", arrival_time="01:00 PM", origin_station="MGR Chennai Central (MAS)", destination_station="Mysuru Junction (MYS)", service_type="Premium Express", platform="PF 1", delay_minutes=0),
            models.Train(train_number="17308", train_name="Basava Express", arrival_time="11:15 AM", origin_station="Bagalkot (BGK)", destination_station="Mysuru Junction (MYS)", service_type="Express", platform="PF 2", delay_minutes=10),
            models.Train(train_number="12613", train_name="Wodeyar SF Express", arrival_time="10:45 AM", origin_station="KSR Bengaluru (SBC)", destination_station="Mysuru Junction (MYS)", service_type="Express", platform="PF 3", delay_minutes=0),
            models.Train(train_number="16216", train_name="Chamundi Express", arrival_time="09:35 AM", origin_station="KSR Bengaluru (SBC)", destination_station="Mysuru Junction (MYS)", service_type="Regional / Commuter", platform="PF 4", delay_minutes=5),
            models.Train(train_number="06559", train_name="KSR Bengaluru - Mysuru MEMU", arrival_time="02:30 PM", origin_station="KSR Bengaluru (SBC)", destination_station="Mysuru Junction (MYS)", service_type="Regional / Commuter", platform="PF 5", delay_minutes=0),
            models.Train(train_number="16228", train_name="Talguppa - Mysuru Express (Late Night)", arrival_time="10:45 PM", origin_station="Talguppa (TLGP)", destination_station="Mysuru Junction (MYS)", service_type="Express", platform="PF 1", delay_minutes=15),
            models.Train(train_number="06256", train_name="KSR Bengaluru - Mysuru Night MEMU", arrival_time="11:35 PM", origin_station="KSR Bengaluru (SBC)", destination_station="Mysuru Junction (MYS)", service_type="Regional / Commuter", platform="PF 6", delay_minutes=0),
        ]
        db.add_all(sample_trains)
        db.commit()

    if db.query(models.BusRoute).count() == 0:
        sample_routes = [
            models.BusRoute(
                route_id="119",
                route_type="Institutional / Tech Park",
                source="City Bus Stand (CBS)",
                destination="Infosys Campus / Hebbal Electronic City",
                corridor_name="Hebbal IT Corridor",
                major_stops=["Metaghalli", "Hebbal Ring Road", "Infosys Gate 1", "Infosys Gate 2", "L&T Technology"],
                approved_pickup_stops=[
                    {"id": "119-s1", "name": "Metaghalli Signal", "landmark": "Near Metaghalli Police Station", "kmFromStation": 4.2, "etaMinutes": 10, "fare": 25},
                    {"id": "119-s2", "name": "Hebbal Ring Road Junction", "landmark": "Under Hebbal Flyover", "kmFromStation": 7.5, "etaMinutes": 16, "fare": 30},
                    {"id": "119-s3", "name": "Infosys Main Gate", "landmark": "Hebbal Electronic City Phase 2", "kmFromStation": 11.0, "etaMinutes": 24, "fare": 35},
                ],
                standard_fare=35.0,
                frequency_type="Regular"
            ),
            models.BusRoute(
                route_id="201",
                route_type="Tourist / Landmark",
                source="City Bus Stand (CBS)",
                destination="Chamundi Hill Temple",
                corridor_name="Chamundi Foothills & Hilltop",
                major_stops=["Mysuru Zoo", "Karanji Lake", "Nandi Statue", "Tavarekatte", "Chamundi Hilltop"],
                approved_pickup_stops=[
                    {"id": "201-s1", "name": "Mysuru Zoo Bus Bay", "landmark": "Sri Chamarajendra Zoological Gardens", "kmFromStation": 3.5, "etaMinutes": 8, "fare": 25},
                    {"id": "201-s2", "name": "Karanji Lake Entrance", "landmark": "Opposite Butterfly Park Gate", "kmFromStation": 5.1, "etaMinutes": 12, "fare": 30},
                    {"id": "201-s3", "name": "Nandi Bull Circle", "landmark": "Monolithic Nandi Viewpoint", "kmFromStation": 9.8, "etaMinutes": 22, "fare": 40},
                ],
                standard_fare=40.0,
                frequency_type="High (Every 15 mins)"
            ),
            models.BusRoute(
                route_id="3 Series (30-39)",
                route_type="Corridor / Suburb Connection",
                source="City Bus Stand (CBS)",
                destination="Bogadi, Hinkal, Vijayanagar",
                corridor_name="West Vijayanagar Corridor",
                major_stops=["Sangam Bhandar", "Hinkal Flyover", "Aishwarya Petrol Bunk", "Bogadi 2nd Stage"],
                approved_pickup_stops=[
                    {"id": "3-s1", "name": "Sangam Bhandar Circle", "landmark": "Near Kalidasa Road", "kmFromStation": 2.8, "etaMinutes": 7, "fare": 20},
                    {"id": "3-s2", "name": "Hinkal Flyover Junction", "landmark": "Hunsur Road Junction", "kmFromStation": 5.4, "etaMinutes": 14, "fare": 25},
                ],
                standard_fare=30.0,
                frequency_type="Regular"
            ),
            models.BusRoute(
                route_id="6 to 8 Series",
                route_type="Corridor / Suburb Connection",
                source="City Bus Stand (CBS)",
                destination="Kuvempunagar, Vivekananda Circle, RTO",
                corridor_name="South Kuvempunagar Corridor",
                major_stops=["Andolana Circle", "JSS Hospital", "Agrahara", "Vivekananda Circle"],
                approved_pickup_stops=[
                    {"id": "6-s1", "name": "Agrahara Circle", "landmark": "Near Ballal Circle Junction", "kmFromStation": 2.1, "etaMinutes": 6, "fare": 20},
                    {"id": "6-s2", "name": "Vivekananda Circle", "landmark": "Kuvempunagar Complex", "kmFromStation": 6.2, "etaMinutes": 16, "fare": 30},
                ],
                standard_fare=30.0,
                frequency_type="Regular"
            ),
        ]
        db.add_all(sample_routes)
        db.commit()

    if db.query(models.BusVehicle).count() == 0:
        sample_buses = [
            models.BusVehicle(id="bus-01", reg_number="KA-09-F-2144", bus_type="Electric Midi AC", total_capacity=32, operator_name="KSRTC Mysuru City Feeder", driver_name="Ramesh Gowda", driver_phone="+91 94481 23091", conductor_name="Suresh Kumar", conductor_phone="+91 94481 23092", status="BOARDING", current_pool_id="pool-1", assigned_departure_time="12:45 PM", pickup_location="Mysuru Junction (MYS) - Bay 2", reserved_seats_for_train=20, direct_booked_seats=4, en_route_booked_seats=2),
            models.BusVehicle(id="bus-02", reg_number="KA-09-F-1892", bus_type="Ashwamedha City Liner", total_capacity=45, operator_name="KSRTC Chamundi Division", driver_name="Manjunath Swamy", driver_phone="+91 94482 11044", conductor_name="Anand Murthy", conductor_phone="+91 94482 11045", status="STANDBY", pickup_location="Mysuru Junction (MYS) - Bay 1", reserved_seats_for_train=0, direct_booked_seats=0, en_route_booked_seats=0),
            models.BusVehicle(id="bus-03", reg_number="KA-09-F-3301", bus_type="Corona Low-Floor AC", total_capacity=40, operator_name="Mysuru Urban Transport", driver_name="Basavaraju H.", driver_phone="+91 94483 55890", conductor_name="Prakash Rao", conductor_phone="+91 94483 55891", status="STANDBY", pickup_location="Mysuru Junction (MYS) - West Terminal", reserved_seats_for_train=0, direct_booked_seats=0, en_route_booked_seats=0),
        ]
        db.add_all(sample_buses)
        db.commit()

    if db.query(models.Wallet).count() == 0:
        db.add(models.Wallet(user_id="user-001", balance=500.0, reserved_amount=0.0))
        db.add(models.WalletTransaction(
            id="TXN-INIT",
            timestamp="10:00 AM",
            amount=500.0,
            type="TOPUP",
            description="Initial Prototype Wallet Welcome Balance",
            balance_after=500.0
        ))
        db.commit()

@app.on_event("startup")
def on_startup():
    db = SessionLocal()
    try:
        seed_initial_data(db)
    finally:
        db.close()

# --- Health & Diagnostic Endpoints ---
@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": "YatriSync Python FastAPI Backend",
        "version": "1.0.0",
        "location": "Mysuru, Karnataka, India",
        "database": os.getenv("DATABASE_URL", "sqlite:///./yatrisync.db").split(":")[0]
    }

# --- Train & Route Endpoints ---
@app.get("/api/trains")
def get_trains(db: Session = Depends(get_db)):
    return db.query(models.Train).all()

@app.get("/api/routes")
def get_routes(db: Session = Depends(get_db)):
    return db.query(models.BusRoute).all()

# --- Smart Pooling Endpoints (FR-03 & Business Rules) ---
@app.get("/api/pools")
def get_pools(db: Session = Depends(get_db)):
    pools = db.query(models.PoolGroup).all()
    result = []
    for p in pools:
        bookings = db.query(models.Booking).filter(models.Booking.pool_group_id == p.id).all()
        passengers = [
            {
                "booking_id": b.id,
                "passenger_name": b.passenger_name,
                "phone": b.passenger_phone,
                "seat_count": b.seat_count,
                "train_number": b.train_number or "",
                "pnr": b.pnr,
                "booked_at": b.created_at,
                "is_women_safety_priority": b.is_women_safety_priority
            }
            for b in bookings
        ]
        p_dict = {
            "id": p.id,
            "target_destination": p.target_destination,
            "corridor_name": p.corridor_name,
            "route_id": p.route_id,
            "arrival_window_start": p.arrival_window_start,
            "arrival_window_end": p.arrival_window_end,
            "train_numbers": p.train_numbers or [],
            "booked_seats": p.booked_seats,
            "target_threshold": p.target_threshold,
            "status": p.status,
            "deadline_minutes_left": p.deadline_minutes_left,
            "is_late_night": p.is_late_night,
            "is_priority_flagged": p.is_priority_flagged,
            "priority_reason": p.priority_reason,
            "allocated_bus_id": p.allocated_bus_id,
            "allocated_bus_number": p.allocated_bus_number,
            "departure_time": p.departure_time,
            "pickup_gate": p.pickup_gate,
            "passengers": passengers
        }
        result.append(p_dict)
    return result

@app.post("/api/pools/join")
def join_pool(req: schemas.BookingCreateRequest, db: Session = Depends(get_db)):
    route = db.query(models.BusRoute).filter(models.BusRoute.route_id == req.route_id).first()
    train = db.query(models.Train).filter(models.Train.train_number == req.train_number).first()
    fare_per_seat = route.standard_fare if route else 35.0
    total_fare = fare_per_seat * req.seat_count

    # Check wallet balance
    wallet = db.query(models.Wallet).filter(models.Wallet.user_id == "user-001").first()
    if not wallet or wallet.balance < total_fare:
        raise HTTPException(
            status_code=400,
            detail=f"Insufficient wallet balance. Available: ₹{wallet.balance if wallet else 0}, Required: ₹{total_fare}"
        )

    # Deduct balance and reserve in escrow
    wallet.balance -= total_fare
    wallet.reserved_amount += total_fare

    booking_id = f"BK-{random.randint(5000, 9999)}"
    qr_code = f"YS-MYS-{booking_id}-{req.train_number}"

    # Record wallet transaction (FARE_RESERVE)
    txn = models.WalletTransaction(
        id=f"TXN-{random.randint(1000, 9999)}",
        timestamp=datetime.now().strftime("%I:%M %p"),
        amount=total_fare,
        type="FARE_RESERVE",
        description=f"Fare Reserved in Escrow for {req.seat_count} seats to {req.destination}",
        booking_id=booking_id,
        balance_after=wallet.balance
    )
    db.add(txn)

    # Find or create pool
    pool = db.query(models.PoolGroup).filter(
        models.PoolGroup.route_id == req.route_id,
        models.PoolGroup.status.notin_(["DISPATCHED", "CANCELLED"])
    ).first()

    is_late_night = req.train_number in ["16228", "06256"]

    if pool:
        pool.booked_seats += req.seat_count
        if pool.booked_seats >= pool.target_threshold and pool.status == "COLLECTING":
            pool.status = "THRESHOLD_REACHED"
    else:
        pool = models.PoolGroup(
            id=f"pool-{int(datetime.utcnow().timestamp())}",
            target_destination=req.destination,
            corridor_name=route.corridor_name if route else req.destination,
            route_id=req.route_id,
            arrival_window_start=train.arrival_time if train else "11:00 AM",
            arrival_window_end="12:30 PM",
            train_numbers=[req.train_number],
            booked_seats=req.seat_count,
            target_threshold=20,
            status="THRESHOLD_REACHED" if req.seat_count >= 20 else "COLLECTING",
            is_late_night=is_late_night,
            is_priority_flagged=is_late_night,
            priority_reason="Late night arrival corridor safety review" if is_late_night else None
        )
        db.add(pool)

    # Create Booking
    booking = models.Booking(
        id=booking_id,
        type="TRAIN_POOL",
        passenger_id="user-001",
        passenger_name=req.passenger_name,
        passenger_phone=req.phone,
        train_number=req.train_number,
        train_name=train.train_name if train else "",
        pnr=req.pnr,
        route_id=req.route_id,
        destination=req.destination,
        pickup_stop="Mysuru Junction (MYS) - Main Concourse Bay (PF 1 Exit)",
        seat_count=req.seat_count,
        fare_per_seat=fare_per_seat,
        total_fare=total_fare,
        fare_status="RESERVED",
        booking_status="PENDING_POOL",
        pool_group_id=pool.id,
        qr_ticket_code=qr_code,
        is_women_safety_priority=req.is_women_safety_priority,
        created_at=datetime.now().strftime("%I:%M %p")
    )
    db.add(booking)
    db.commit()

    return {
        "success": True,
        "booking_id": booking_id,
        "qr_ticket_code": qr_code,
        "pool_id": pool.id,
        "total_seats": pool.booked_seats,
        "status": pool.status,
        "message": "Seat pooling request submitted successfully with fare in escrow."
    }

# --- Operator Dispatch & Bus Allocation (FR-04, FR-12) ---
@app.post("/api/operator/allocate")
def approve_allocation(req: schemas.AllocationApproveRequest, db: Session = Depends(get_db)):
    pool = db.query(models.PoolGroup).filter(models.PoolGroup.id == req.pool_id).first()
    bus = db.query(models.BusVehicle).filter(models.BusVehicle.id == req.bus_id).first()

    if not pool or not bus:
        raise HTTPException(status_code=404, detail="Pool or Bus not found")

    pool.status = "BUS_ASSIGNED"
    pool.allocated_bus_id = bus.id
    pool.allocated_bus_number = bus.reg_number
    pool.departure_time = req.departure_time
    pool.pickup_gate = req.pickup_gate

    bus.status = "BOARDING"
    bus.current_pool_id = pool.id
    bus.assigned_departure_time = req.departure_time
    bus.pickup_location = f"Mysuru Junction (MYS) - {req.pickup_gate}"
    bus.reserved_seats_for_train = pool.booked_seats

    # Capture reserved fare for all passengers in this pool!
    wallet = db.query(models.Wallet).filter(models.Wallet.user_id == "user-001").first()
    bookings = db.query(models.Booking).filter(models.Booking.pool_group_id == pool.id).all()

    for b in bookings:
        if b.booking_status == "PENDING_POOL":
            b.booking_status = "CONFIRMED"
            b.fare_status = "CAPTURED"
            b.bus_id = bus.id
            b.bus_reg_number = bus.reg_number
            b.departure_time = req.departure_time
            b.pickup_gate = req.pickup_gate

            if wallet:
                wallet.reserved_amount = max(0.0, wallet.reserved_amount - b.total_fare)
                db.add(models.WalletTransaction(
                    id=f"TXN-{random.randint(1000, 9999)}",
                    timestamp=datetime.now().strftime("%I:%M %p"),
                    amount=b.total_fare,
                    type="FARE_CAPTURE",
                    description=f"Fare Captured: Bus {bus.reg_number} allocated to {pool.target_destination}",
                    booking_id=b.id,
                    balance_after=wallet.balance
                ))

    db.commit()
    return {"success": True, "message": f"Bus {bus.reg_number} approved and dispatched!"}

# --- Conductor QR Verification & Anti-Duplicate Scan (FR-08) ---
@app.post("/api/conductor/verify-qr")
def verify_qr(req: schemas.QRScanRequest, db: Session = Depends(get_db)):
    booking = db.query(models.Booking).filter(models.Booking.qr_ticket_code == req.ticket_code.strip()).first()
    if not booking:
        return {"success": False, "duplicate": False, "message": "Invalid Ticket! QR Code not found in database."}

    if booking.booking_status == "BOARDED":
        return {
            "success": False,
            "duplicate": True,
            "message": f"DUPLICATE QR SCAN DETECTED: Passenger {booking.passenger_name} was already boarded at {booking.boarded_at}. Re-entry denied!"
        }

    if booking.booking_status != "CONFIRMED":
        return {
            "success": False,
            "duplicate": False,
            "message": f"Cannot board ticket: Current status is '{booking.booking_status}'. Must be CONFIRMED."
        }

    now_str = datetime.now().strftime("%I:%M:%S %p")
    booking.booking_status = "BOARDED"
    booking.boarded_at = now_str
    db.commit()

    return {
        "success": True,
        "duplicate": False,
        "message": f"Verified! Passenger {booking.passenger_name} ({booking.seat_count} seats) marked as BOARDED at {now_str}.",
        "booking": {
            "id": booking.id,
            "passenger_name": booking.passenger_name,
            "seat_count": booking.seat_count,
            "destination": booking.destination,
            "bus_reg_number": booking.bus_reg_number
        }
    }

# --- Wallet Endpoints (FR-07) ---
@app.get("/api/wallet")
def get_wallet(db: Session = Depends(get_db)):
    wallet = db.query(models.Wallet).filter(models.Wallet.user_id == "user-001").first()
    transactions = db.query(models.WalletTransaction).order_by(models.WalletTransaction.id.desc()).all()
    return {
        "balance": wallet.balance if wallet else 500.0,
        "reserved_amount": wallet.reserved_amount if wallet else 0.0,
        "transactions": transactions
    }

@app.post("/api/wallet/topup")
def topup_wallet(req: schemas.TopUpRequest, db: Session = Depends(get_db)):
    wallet = db.query(models.Wallet).filter(models.Wallet.user_id == "user-001").first()
    if not wallet:
        wallet = models.Wallet(user_id="user-001", balance=500.0, reserved_amount=0.0)
        db.add(wallet)

    wallet.balance += req.amount
    txn = models.WalletTransaction(
        id=f"TXN-{random.randint(1000, 9999)}",
        timestamp=datetime.now().strftime("%I:%M %p"),
        amount=req.amount,
        type="TOPUP",
        description="Simulated UPI / Net Banking Top-Up",
        balance_after=wallet.balance
    )
    db.add(txn)
    db.commit()
    return {"success": True, "balance": wallet.balance}
