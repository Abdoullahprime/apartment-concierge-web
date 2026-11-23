export enum Role {
  RESIDENT = 'resident',
  GUEST = 'guest',
  AGENT = 'agent',
  ADMIN = 'admin',
}

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  REJECTED = 'rejected',
}

export enum ServiceCategory {
  RESTAURANTS = 'restaurants',
  VEHICLE_HIRE = 'vehicle_hire',
  PRIVATE_CHEFS = 'private_chefs',
  CO_WORKING = 'co_working',
  ROOM_SERVICE = 'room_service',
  HOSPITALS = 'hospitals',
  ATTRACTIONS = 'attractions',
  EVENTS = 'events',
  GOVERNMENT_OFFICES = 'government_offices',
  EMERGENCY = 'emergency',
}
