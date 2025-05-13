CREATE TABLE IF NOT EXISTS room_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type_name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);



CREATE TABLE IF NOT EXISTS guests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(255) NOT NULL,
    contact_info JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_guests_timestamp
BEFORE UPDATE ON guests
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();




CREATE TABLE IF NOT EXISTS rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_number VARCHAR(50) UNIQUE NOT NULL,
    room_type_id UUID NOT NULL REFERENCES room_types(id) ON DELETE RESTRICT,
    price_per_night DECIMAL(10, 2) NOT NULL CHECK (price_per_night > 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- updated_at uchun trigger
CREATE TRIGGER update_rooms_timestamp
BEFORE UPDATE ON rooms
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();





-- btree_gist kengaytmasini yoqish (overlapping rezervatsiyalarni oldini olish uchun)
CREATE EXTENSION IF NOT EXISTS btree_gist;

CREATE TABLE IF NOT EXISTS reservations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guest_id UUID NOT NULL REFERENCES guests(id) ON DELETE CASCADE,
    room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('confirmed', 'checked_in', 'checked_out', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_date_range CHECK (check_out_date > check_in_date)
);

-- overlapping rezervatsiyalarni oldini olish uchun EXCLUDE constraint
ALTER TABLE reservations
ADD CONSTRAINT no_overlapping_reservations
EXCLUDE USING GIST (
    room_id WITH =,
    daterange(check_in_date, check_out_date, '[]') WITH &&
);

-- updated_at uchun trigger
CREATE TRIGGER update_reservations_timestamp
BEFORE UPDATE ON reservations
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE INDEX idx_guests_full_name ON guests(full_name);
CREATE INDEX idx_reservations_guest_id ON reservations(guest_id);
CREATE INDEX idx_reservations_room_id ON reservations(room_id);
CREATE INDEX idx_reservations_dates ON reservations(check_in_date, check_out_date);














