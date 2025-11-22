-- Page view tracking
CREATE TABLE page_views (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  page_url TEXT NOT NULL,
  page_title TEXT,
  category TEXT,
  referrer TEXT,
  user_agent TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_page_views_url ON page_views(page_url);
CREATE INDEX idx_page_views_date ON page_views(DATE(timestamp));

-- Calculator usage tracking
CREATE TABLE calculator_usage (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  calculator_name TEXT NOT NULL,
  input_params TEXT, -- JSON format
  result_summary TEXT, -- JSON format
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_calculator_usage_name ON calculator_usage(calculator_name);
CREATE INDEX idx_calculator_usage_date ON calculator_usage(DATE(timestamp));

-- Saved calculation results (shareable via URL)
CREATE TABLE saved_calculations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  calculator_name TEXT NOT NULL,
  share_token TEXT UNIQUE NOT NULL,
  input_data TEXT NOT NULL, -- JSON format
  result_data TEXT, -- JSON format
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME,
  view_count INTEGER DEFAULT 0
);

CREATE INDEX idx_saved_calculations_token ON saved_calculations(share_token);
CREATE INDEX idx_saved_calculations_expires ON saved_calculations(expires_at);

-- Door lock specifications (for compatibility checker)
CREATE TABLE lock_specifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  protocol TEXT NOT NULL, -- wifi, zigbee, zwave, thread, matter
  
  -- Door compatibility
  min_door_thickness_mm INTEGER,
  max_door_thickness_mm INTEGER,
  backsets TEXT, -- JSON array: [60, 70]
  hole_type TEXT, -- deadbolt, mortise, euro, rim
  
  -- Features
  has_keypad BOOLEAN DEFAULT 0,
  has_fingerprint BOOLEAN DEFAULT 0,
  has_key_card BOOLEAN DEFAULT 0,
  has_physical_key BOOLEAN DEFAULT 0,
  
  -- Battery
  battery_type TEXT, -- "4x AA", "CR123A", etc.
  estimated_battery_life_days INTEGER,
  
  -- Price
  typical_price_usd INTEGER,
  
  -- Metadata
  region TEXT, -- US, EU, CN, Global
  added_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_date DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_lock_specs_protocol ON lock_specifications(protocol);
CREATE INDEX idx_lock_specs_region ON lock_specifications(region);
CREATE INDEX idx_lock_specs_brand ON lock_specifications(brand);
