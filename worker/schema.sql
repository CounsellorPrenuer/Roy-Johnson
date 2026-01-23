DROP TABLE IF EXISTS transactions;
CREATE TABLE transactions (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL,
  amount REAL NOT NULL,
  status TEXT NOT NULL,
  created_at INTEGER DEFAULT (unixepoch())
);

DROP TABLE IF EXISTS coupon_redemptions;
CREATE TABLE coupon_redemptions (
  id TEXT PRIMARY KEY,
  coupon_code TEXT NOT NULL,
  order_id TEXT NOT NULL,
  redeemed_at INTEGER DEFAULT (unixepoch())
);
