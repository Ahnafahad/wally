const T = (id,d,m,a,t,c,acc) => ({id,date:d,merchant:m,amount:a,type:t,category:c,account:acc});

const transactions = [
  // ─── February 2026 (current month) ───────────────────────────────────────
  T('rf01','2026-02-04','Coffee World',380,'expense','Food & Dining','rafiq-cash'),
  T('rf02','2026-02-03','Pathao Ride',220,'expense','Transportation','rafiq-bkash'),
  T('rf03','2026-02-02','Shwapno Supermarket',2800,'expense','Food & Dining','rafiq-brac'),
  T('rf04','2026-02-01','Grameenphone Recharge',500,'expense','Bills & Utilities','rafiq-bkash'),

  // ─── January 2026 ─────────────────────────────────────────────────────────
  T('rj01','2026-01-31','KFC Banani',1200,'expense','Food & Dining','rafiq-cash'),
  T('rj02','2026-01-30','Matrix Gym Monthly',1000,'expense','Personal Care','rafiq-brac'),
  T('rj03','2026-01-29','Udemy Course',1000,'expense','Education','rafiq-city-cc'),
  T('rj04','2026-01-28','Ibn Sina Pharmacy',900,'expense','Healthcare','rafiq-cash'),
  T('rj05','2026-01-27','BTCL Internet',1500,'expense','Bills & Utilities','rafiq-brac'),
  T('rj06','2026-01-25','Daraz - Headphones',3200,'expense','Shopping','rafiq-city-cc'),
  T('rj07','2026-01-24','Star Cineplex',800,'expense','Entertainment','rafiq-brac'),
  T('rj08','2026-01-23','Persona Salon',900,'expense','Personal Care','rafiq-cash'),
  T('rj09','2026-01-22','Uber Ride',350,'expense','Transportation','rafiq-bkash'),
  T('rj10','2026-01-20','Titas Gas Bill',200,'expense','Bills & Utilities','rafiq-bkash'),
  T('rj11','2026-01-20','Transfer - Emergency Fund',5000,'transfer','Savings','rafiq-brac'),
  T('rj12','2026-01-18','Aarong - Shirt',1400,'expense','Shopping','rafiq-city-cc'),
  T('rj13','2026-01-17','Foodpanda Order',950,'expense','Food & Dining','rafiq-bkash'),
  T('rj14','2026-01-15','Spotify Premium',300,'expense','Entertainment','rafiq-brac'),
  T('rj15','2026-01-15','Meghna Petroleum',900,'expense','Transportation','rafiq-cash'),
  T('rj16','2026-01-14','Meena Bazar',1800,'expense','Food & Dining','rafiq-brac'),
  T('rj17','2026-01-12','Salary Deposit',70000,'income','Salary','rafiq-brac'),
  T('rj18','2026-01-10','DESCO Electricity',1800,'expense','Bills & Utilities','rafiq-bkash'),
  T('rj19','2026-01-08','Netflix Subscription',1200,'expense','Entertainment','rafiq-brac'),
  T('rj20','2026-01-06','Pathao Ride',180,'expense','Transportation','rafiq-bkash'),
  T('rj21','2026-01-06','Transfer - Laptop Fund',4000,'transfer','Savings','rafiq-brac'),
  T('rj22','2026-01-05','Star Kabab',900,'expense','Food & Dining','rafiq-cash'),
  T('rj23','2026-01-04','Pickaboo - Cable',500,'expense','Shopping','rafiq-city-cc'),
  T('rj24','2026-01-03','Pathao Ride',250,'expense','Transportation','rafiq-bkash'),
  T('rj25','2026-01-02','North End Coffee',420,'expense','Food & Dining','rafiq-cash'),
  T('rj26','2026-01-01','Pizza Hut Gulshan',750,'expense','Food & Dining','rafiq-city-cc'),

  // ─── December 2025 ────────────────────────────────────────────────────────
  T('rd01','2025-12-31','Star Kabab',850,'expense','Food & Dining','rafiq-city-cc'),
  T('rd02','2025-12-30','Aarong - Punjabi',4500,'expense','Shopping','rafiq-city-cc'),
  T('rd03','2025-12-29','Matrix Gym',3000,'expense','Personal Care','rafiq-brac'),
  T('rd04','2025-12-28','BTCL Internet',1500,'expense','Bills & Utilities','rafiq-brac'),
  T('rd05','2025-12-27','Foodpanda Order',950,'expense','Food & Dining','rafiq-bkash'),
  T('rd06','2025-12-26','Star Cineplex',1200,'expense','Entertainment','rafiq-brac'),
  T('rd07','2025-12-25','Meena Bazar',1200,'expense','Food & Dining','rafiq-cash'),
  T('rd08','2025-12-23','Ryans Computers - SSD',5500,'expense','Shopping','rafiq-city-cc'),
  T('rd09','2025-12-22','Uber Ride',320,'expense','Transportation','rafiq-bkash'),
  T('rd10','2025-12-20','DESCO Bill',1850,'expense','Bills & Utilities','rafiq-bkash'),
  T('rd11','2025-12-18','Pizza Hut Gulshan',1850,'expense','Food & Dining','rafiq-brac'),
  T('rd12','2025-12-16','Daraz - PS5 Controller',8500,'expense','Shopping','rafiq-city-cc'),
  T('rd13','2025-12-14','North End Coffee',450,'expense','Food & Dining','rafiq-cash'),
  T('rd14','2025-12-13','ATM Withdrawal',10000,'transfer','Cash','rafiq-brac'),
  T('rd15','2025-12-12','Salary Deposit',70000,'income','Salary','rafiq-brac'),
  T('rd16','2025-12-10','Uber Ride',320,'expense','Transportation','rafiq-bkash'),
  T('rd17','2025-12-08','Star Tech - Mouse',3500,'expense','Shopping','rafiq-city-cc'),
  T('rd18','2025-12-07','Netflix',1200,'expense','Entertainment','rafiq-brac'),
  T('rd19','2025-12-05','Shwapno Supermarket',2450,'expense','Food & Dining','rafiq-brac'),
  T('rd20','2025-12-03','Pathao Ride',180,'expense','Transportation','rafiq-bkash'),
  T('rd21','2025-12-01','Grameenphone',500,'expense','Bills & Utilities','rafiq-bkash'),

  // ─── November 2025 ────────────────────────────────────────────────────────
  T('rn01','2025-11-12','Salary Deposit',70000,'income','Salary','rafiq-brac'),
  T('rn02','2025-11-28','Shwapno Supermarket',2100,'expense','Food & Dining','rafiq-brac'),
  T('rn03','2025-11-25','Pathao Ride',210,'expense','Transportation','rafiq-bkash'),
  T('rn04','2025-11-22','Daraz - Jacket',2800,'expense','Shopping','rafiq-city-cc'),
  T('rn05','2025-11-18','BTCL Internet',1500,'expense','Bills & Utilities','rafiq-brac'),
  T('rn06','2025-11-15','Star Cineplex',750,'expense','Entertainment','rafiq-brac'),
  T('rn07','2025-11-10','Ibn Sina Pharmacy',650,'expense','Healthcare','rafiq-cash'),
  T('rn08','2025-11-05','Transfer - Emergency Fund',3000,'transfer','Savings','rafiq-brac'),

  // ─── October 2025 ─────────────────────────────────────────────────────────
  T('ro01','2025-10-12','Salary Deposit',70000,'income','Salary','rafiq-brac'),
  T('ro02','2025-10-30','Meena Bazar',1950,'expense','Food & Dining','rafiq-brac'),
  T('ro03','2025-10-27','Uber Ride',300,'expense','Transportation','rafiq-bkash'),
  T('ro04','2025-10-24','DESCO Electricity',1700,'expense','Bills & Utilities','rafiq-bkash'),
  T('ro05','2025-10-20','Aarong - Kurta',1800,'expense','Shopping','rafiq-city-cc'),
  T('ro06','2025-10-15','Netflix',1200,'expense','Entertainment','rafiq-brac'),
  T('ro07','2025-10-08','Transfer - Laptop Fund',4000,'transfer','Savings','rafiq-brac'),

  // ─── September 2025 ───────────────────────────────────────────────────────
  T('rs01','2025-09-12','Salary Deposit',70000,'income','Salary','rafiq-brac'),
  T('rs02','2025-09-29','KFC Gulshan',1100,'expense','Food & Dining','rafiq-cash'),
  T('rs03','2025-09-26','Pathao Ride',195,'expense','Transportation','rafiq-bkash'),
  T('rs04','2025-09-22','Titas Gas Bill',180,'expense','Bills & Utilities','rafiq-bkash'),
  T('rs05','2025-09-18','Pickaboo - Charger',750,'expense','Shopping','rafiq-city-cc'),
  T('rs06','2025-09-14','Matrix Gym Monthly',1000,'expense','Personal Care','rafiq-brac'),
  T('rs07','2025-09-08','Persona Salon',850,'expense','Personal Care','rafiq-cash'),
  T('rs08','2025-09-03','Transfer - Emergency Fund',2500,'transfer','Savings','rafiq-brac'),

  // ─── August 2025 ──────────────────────────────────────────────────────────
  T('ra01','2025-08-12','Salary Deposit',70000,'income','Salary','rafiq-brac'),
  T('ra02','2025-08-28','Shwapno Supermarket',2300,'expense','Food & Dining','rafiq-brac'),
  T('ra03','2025-08-25','Uber Ride',280,'expense','Transportation','rafiq-bkash'),
  T('ra04','2025-08-20','DESCO Electricity',1650,'expense','Bills & Utilities','rafiq-bkash'),
  T('ra05','2025-08-16','Daraz - Sunglasses',1200,'expense','Shopping','rafiq-city-cc'),
  T('ra06','2025-08-10','Star Cineplex',800,'expense','Entertainment','rafiq-brac'),
  T('ra07','2025-08-06','Ibn Sina Pharmacy',480,'expense','Healthcare','rafiq-cash'),

  // ─── July 2025 ────────────────────────────────────────────────────────────
  T('rj701','2025-07-12','Salary Deposit',70000,'income','Salary','rafiq-brac'),
  T('rj702','2025-07-30','Meena Bazar',1850,'expense','Food & Dining','rafiq-brac'),
  T('rj703','2025-07-27','Pathao Ride',215,'expense','Transportation','rafiq-bkash'),
  T('rj704','2025-07-22','BTCL Internet',1500,'expense','Bills & Utilities','rafiq-brac'),
  T('rj705','2025-07-18','Aarong - Panjabi',2200,'expense','Shopping','rafiq-city-cc'),
  T('rj706','2025-07-14','Netflix',1200,'expense','Entertainment','rafiq-brac'),
  T('rj707','2025-07-09','Transfer - Laptop Fund',3500,'transfer','Savings','rafiq-brac'),
  T('rj708','2025-07-04','North End Coffee',390,'expense','Food & Dining','rafiq-cash'),

  // ─── June 2025 ────────────────────────────────────────────────────────────
  T('rjn01','2025-06-12','Salary Deposit',70000,'income','Salary','rafiq-brac'),
  T('rjn02','2025-06-28','Shwapno Supermarket',2050,'expense','Food & Dining','rafiq-brac'),
  T('rjn03','2025-06-25','Uber Ride',260,'expense','Transportation','rafiq-bkash'),
  T('rjn04','2025-06-20','DESCO Electricity',1780,'expense','Bills & Utilities','rafiq-bkash'),
  T('rjn05','2025-06-16','Pickaboo - Keyboard',1900,'expense','Shopping','rafiq-city-cc'),
  T('rjn06','2025-06-10','Matrix Gym Monthly',1000,'expense','Personal Care','rafiq-brac'),

  // ─── May 2025 ─────────────────────────────────────────────────────────────
  T('rm01','2025-05-12','Salary Deposit',70000,'income','Salary','rafiq-brac'),
  T('rm02','2025-05-28','Meena Bazar',1700,'expense','Food & Dining','rafiq-brac'),
  T('rm03','2025-05-24','Pathao Ride',200,'expense','Transportation','rafiq-bkash'),
  T('rm04','2025-05-20','Titas Gas Bill',190,'expense','Bills & Utilities','rafiq-bkash'),
  T('rm05','2025-05-15','Star Cineplex',850,'expense','Entertainment','rafiq-brac'),
  T('rm06','2025-05-08','Transfer - Emergency Fund',2000,'transfer','Savings','rafiq-brac'),

  // ─── April 2025 ───────────────────────────────────────────────────────────
  T('rap01','2025-04-12','Salary Deposit',70000,'income','Salary','rafiq-brac'),
  T('rap02','2025-04-27','KFC Banani',1050,'expense','Food & Dining','rafiq-cash'),
  T('rap03','2025-04-24','Uber Ride',290,'expense','Transportation','rafiq-bkash'),
  T('rap04','2025-04-20','DESCO Electricity',1600,'expense','Bills & Utilities','rafiq-bkash'),
  T('rap05','2025-04-15','Daraz - Watch',4500,'expense','Shopping','rafiq-city-cc'),
  T('rap06','2025-04-10','Ibn Sina Pharmacy',520,'expense','Healthcare','rafiq-cash'),
  T('rap07','2025-04-06','Netflix',1200,'expense','Entertainment','rafiq-brac'),

  // ─── March 2025 ───────────────────────────────────────────────────────────
  T('rmr01','2025-03-12','Salary Deposit',70000,'income','Salary','rafiq-brac'),
  T('rmr02','2025-03-29','Shwapno Supermarket',2400,'expense','Food & Dining','rafiq-brac'),
  T('rmr03','2025-03-26','Pathao Ride',230,'expense','Transportation','rafiq-bkash'),
  T('rmr04','2025-03-22','BTCL Internet',1500,'expense','Bills & Utilities','rafiq-brac'),
  T('rmr05','2025-03-18','Aarong - Shirt',1300,'expense','Shopping','rafiq-city-cc'),
  T('rmr06','2025-03-14','Persona Salon',800,'expense','Personal Care','rafiq-cash'),
  T('rmr07','2025-03-08','Transfer - Laptop Fund',5000,'transfer','Savings','rafiq-brac'),
  T('rmr08','2025-03-04','Star Cineplex',750,'expense','Entertainment','rafiq-brac'),

  // ─── February 2025 ────────────────────────────────────────────────────────
  T('rfb01','2025-02-12','Salary Deposit',70000,'income','Salary','rafiq-brac'),
  T('rfb02','2025-02-27','Meena Bazar',1600,'expense','Food & Dining','rafiq-brac'),
  T('rfb03','2025-02-24','Uber Ride',270,'expense','Transportation','rafiq-bkash'),
  T('rfb04','2025-02-18','DESCO Electricity',1550,'expense','Bills & Utilities','rafiq-bkash'),
  T('rfb05','2025-02-12','Pickaboo - USB Hub',850,'expense','Shopping','rafiq-city-cc'),
  T('rfb06','2025-02-07','Matrix Gym Monthly',1000,'expense','Personal Care','rafiq-brac'),
];

export default transactions;
