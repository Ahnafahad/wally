const T = (id,d,m,a,t,c,acc) => ({id,date:d,merchant:m,amount:a,type:t,category:c,account:acc});

const transactions = [
  // ─── February 2026 (current month) ───────────────────────────────────────
  T('sf01','2026-02-04','Gloria Jeans Coffee',650,'expense','Food & Dining','sarah-cash'),
  T('sf02','2026-02-03','Uber Ride',320,'expense','Transportation','sarah-bkash'),
  T('sf03','2026-02-02','Agora Supermarket',4200,'expense','Food & Dining','sarah-brac'),
  T('sf04','2026-02-01','Robi Postpaid',1200,'expense','Bills & Utilities','sarah-bkash'),
  T('sf05','2026-02-01','Coursera Course',3200,'expense','Education','sarah-city-cc'),

  // ─── January 2026 ─────────────────────────────────────────────────────────
  T('sj01','2026-01-31','Gloria Jeans Coffee',850,'expense','Food & Dining','sarah-cash'),
  T('sj02','2026-01-30','Adobe Creative Cloud',4200,'expense','Bills & Utilities','sarah-city-cc'),
  T('sj03','2026-01-29','Fitness Station',5000,'expense','Personal Care','sarah-brac'),
  T('sj04','2026-01-28','Rokomari Books',2500,'expense','Education','sarah-brac'),
  T('sj05','2026-01-27','Carnival Internet',2500,'expense','Bills & Utilities','sarah-brac'),
  T('sj06','2026-01-25','Yellow - Formal Wear',8500,'expense','Shopping','sarah-city-cc'),
  T('sj07','2026-01-24','Star Cineplex Premium',2000,'expense','Entertainment','sarah-cash'),
  T('sj08','2026-01-23','La Belle Salon',3500,'expense','Personal Care','sarah-brac'),
  T('sj09','2026-01-22','Pathao Ride',280,'expense','Transportation','sarah-bkash'),
  T('sj10','2026-01-20','DESCO Bill',3200,'expense','Bills & Utilities','sarah-bkash'),
  T('sj11','2026-01-20','Transfer - Bali Trip',5000,'transfer','Savings','sarah-dutch-bangla'),
  T('sj12','2026-01-18','Jamuna Future Park',12000,'expense','Shopping','sarah-city-cc'),
  T('sj13','2026-01-17','Pathao Food',1250,'expense','Food & Dining','sarah-bkash'),
  T('sj14','2026-01-15','Netflix Premium',1500,'expense','Entertainment','sarah-city-cc'),
  T('sj15','2026-01-15','Uber Ride',450,'expense','Transportation','sarah-bkash'),
  T('sj16','2026-01-14','Agora Supermarket',4500,'expense','Food & Dining','sarah-brac'),
  T('sj17','2026-01-12','Salary Deposit',110000,'income','Salary','sarah-brac'),
  T('sj18','2026-01-10','Square Hospital',5000,'expense','Healthcare','sarah-city-cc'),
  T('sj19','2026-01-08','Spotify Premium',300,'expense','Entertainment','sarah-brac'),
  T('sj20','2026-01-06','Pathao Ride',200,'expense','Transportation','sarah-bkash'),
  T('sj21','2026-01-06','Transfer - Apartment Fund',15000,'transfer','Savings','sarah-dutch-bangla'),
  T('sj22','2026-01-05','Nandos Gulshan',2800,'expense','Food & Dining','sarah-city-cc'),
  T('sj23','2026-01-04','Pickaboo - Earbuds',4500,'expense','Shopping','sarah-city-cc'),
  T('sj24','2026-01-03','Uber Ride',380,'expense','Transportation','sarah-bkash'),
  T('sj25','2026-01-02','Coffee World',500,'expense','Food & Dining','sarah-cash'),
  T('sj26','2026-01-13','Freelance Payment',35000,'income','Freelance','sarah-dutch-bangla'),

  // ─── December 2025 ────────────────────────────────────────────────────────
  T('sd01','2025-12-31','Gloria Jeans Coffee',780,'expense','Food & Dining','sarah-cash'),
  T('sd02','2025-12-30','Yellow - Saree',6500,'expense','Shopping','sarah-city-cc'),
  T('sd03','2025-12-29','Fitness Station',5000,'expense','Personal Care','sarah-brac'),
  T('sd04','2025-12-28','Carnival Internet',2500,'expense','Bills & Utilities','sarah-brac'),
  T('sd05','2025-12-27','Pathao Food',1100,'expense','Food & Dining','sarah-bkash'),
  T('sd06','2025-12-26','Star Cineplex Premium',2200,'expense','Entertainment','sarah-cash'),
  T('sd07','2025-12-25','Agora Supermarket',5100,'expense','Food & Dining','sarah-brac'),
  T('sd08','2025-12-23','Pickaboo - Apple Watch',45000,'expense','Shopping','sarah-city-cc'),
  T('sd09','2025-12-22','Uber Ride',410,'expense','Transportation','sarah-bkash'),
  T('sd10','2025-12-20','DESCO Bill',3100,'expense','Bills & Utilities','sarah-bkash'),
  T('sd11','2025-12-18','Nandos Gulshan',3200,'expense','Food & Dining','sarah-city-cc'),
  T('sd12','2025-12-16','Daraz - Perfume Set',4800,'expense','Shopping','sarah-city-cc'),
  T('sd13','2025-12-14','Coffee World',520,'expense','Food & Dining','sarah-cash'),
  T('sd14','2025-12-13','Transfer - Bali Trip',8000,'transfer','Savings','sarah-dutch-bangla'),
  T('sd15','2025-12-12','Salary Deposit',110000,'income','Salary','sarah-brac'),
  T('sd16','2025-12-11','Freelance Payment',35000,'income','Freelance','sarah-dutch-bangla'),
  T('sd17','2025-12-10','Uber Ride',370,'expense','Transportation','sarah-bkash'),
  T('sd18','2025-12-08','La Belle Salon',3800,'expense','Personal Care','sarah-brac'),
  T('sd19','2025-12-07','Netflix Premium',1500,'expense','Entertainment','sarah-city-cc'),
  T('sd20','2025-12-05','Shwapno Supermarket',3400,'expense','Food & Dining','sarah-dutch-bangla'),
  T('sd21','2025-12-04','Rokomari Books',1800,'expense','Education','sarah-brac'),
  T('sd22','2025-12-03','Pathao Ride',250,'expense','Transportation','sarah-bkash'),
  T('sd23','2025-12-02','Transfer - Apartment Fund',12000,'transfer','Savings','sarah-dutch-bangla'),
  T('sd24','2025-12-01','Robi Postpaid',1200,'expense','Bills & Utilities','sarah-bkash'),
  T('sd25','2025-11-30','Square Hospital',2800,'expense','Healthcare','sarah-city-cc'),

  // ─── November 2025 ────────────────────────────────────────────────────────
  T('sn01','2025-11-12','Salary Deposit',110000,'income','Salary','sarah-brac'),
  T('sn02','2025-11-28','Agora Supermarket',4800,'expense','Food & Dining','sarah-brac'),
  T('sn03','2025-11-25','Uber Ride',340,'expense','Transportation','sarah-bkash'),
  T('sn04','2025-11-22','Yellow - Blazer',7200,'expense','Shopping','sarah-city-cc'),
  T('sn05','2025-11-18','Carnival Internet',2500,'expense','Bills & Utilities','sarah-brac'),
  T('sn06','2025-11-15','La Belle Salon',3200,'expense','Personal Care','sarah-brac'),
  T('sn07','2025-11-10','Transfer - Bali Trip',6000,'transfer','Savings','sarah-dutch-bangla'),
  T('sn08','2025-11-05','Rokomari Books',2100,'expense','Education','sarah-brac'),

  // ─── October 2025 ─────────────────────────────────────────────────────────
  T('so01','2025-10-12','Salary Deposit',110000,'income','Salary','sarah-brac'),
  T('so02','2025-10-29','Shwapno Supermarket',3600,'expense','Food & Dining','sarah-dutch-bangla'),
  T('so03','2025-10-26','Pathao Ride',290,'expense','Transportation','sarah-bkash'),
  T('so04','2025-10-22','DESCO Bill',2900,'expense','Bills & Utilities','sarah-bkash'),
  T('so05','2025-10-18','Daraz - Handbag',5800,'expense','Shopping','sarah-city-cc'),
  T('so06','2025-10-14','Fitness Station',5000,'expense','Personal Care','sarah-brac'),
  T('so07','2025-10-08','Transfer - Apartment Fund',10000,'transfer','Savings','sarah-dutch-bangla'),

  // ─── September 2025 ───────────────────────────────────────────────────────
  T('ss01','2025-09-12','Salary Deposit',110000,'income','Salary','sarah-brac'),
  T('ss02','2025-09-28','Gloria Jeans Coffee',720,'expense','Food & Dining','sarah-cash'),
  T('ss03','2025-09-25','Uber Ride',360,'expense','Transportation','sarah-bkash'),
  T('ss04','2025-09-22','Carnival Internet',2500,'expense','Bills & Utilities','sarah-brac'),
  T('ss05','2025-09-18','Yellow - Kurta Set',4200,'expense','Shopping','sarah-city-cc'),
  T('ss06','2025-09-14','La Belle Salon',3000,'expense','Personal Care','sarah-brac'),
  T('ss07','2025-09-10','Rokomari Books',1600,'expense','Education','sarah-brac'),
  T('ss08','2025-09-06','Transfer - Bali Trip',5000,'transfer','Savings','sarah-dutch-bangla'),

  // ─── August 2025 ──────────────────────────────────────────────────────────
  T('sa01','2025-08-12','Salary Deposit',110000,'income','Salary','sarah-brac'),
  T('sa02','2025-08-27','Agora Supermarket',4100,'expense','Food & Dining','sarah-brac'),
  T('sa03','2025-08-24','Uber Ride',310,'expense','Transportation','sarah-bkash'),
  T('sa04','2025-08-20','DESCO Bill',2750,'expense','Bills & Utilities','sarah-bkash'),
  T('sa05','2025-08-16','Pickaboo - Tablet Case',1900,'expense','Shopping','sarah-city-cc'),
  T('sa06','2025-08-10','Fitness Station',5000,'expense','Personal Care','sarah-brac'),
  T('sa07','2025-08-05','Square Hospital',1800,'expense','Healthcare','sarah-city-cc'),

  // ─── July 2025 ────────────────────────────────────────────────────────────
  T('sj701','2025-07-12','Salary Deposit',110000,'income','Salary','sarah-brac'),
  T('sj702','2025-07-29','Shwapno Supermarket',3200,'expense','Food & Dining','sarah-dutch-bangla'),
  T('sj703','2025-07-26','Pathao Ride',275,'expense','Transportation','sarah-bkash'),
  T('sj704','2025-07-22','Carnival Internet',2500,'expense','Bills & Utilities','sarah-brac'),
  T('sj705','2025-07-18','Daraz - Shoes',4900,'expense','Shopping','sarah-city-cc'),
  T('sj706','2025-07-14','La Belle Salon',3400,'expense','Personal Care','sarah-brac'),
  T('sj707','2025-07-09','Transfer - Apartment Fund',8000,'transfer','Savings','sarah-dutch-bangla'),
  T('sj708','2025-07-04','Coffee World',480,'expense','Food & Dining','sarah-cash'),

  // ─── June 2025 ────────────────────────────────────────────────────────────
  T('sjn01','2025-06-12','Salary Deposit',110000,'income','Salary','sarah-brac'),
  T('sjn02','2025-06-27','Agora Supermarket',4400,'expense','Food & Dining','sarah-brac'),
  T('sjn03','2025-06-24','Uber Ride',330,'expense','Transportation','sarah-bkash'),
  T('sjn04','2025-06-20','DESCO Bill',2800,'expense','Bills & Utilities','sarah-bkash'),
  T('sjn05','2025-06-16','Yellow - Dress',5600,'expense','Shopping','sarah-city-cc'),
  T('sjn06','2025-06-10','Rokomari Books',2200,'expense','Education','sarah-brac'),

  // ─── May 2025 ─────────────────────────────────────────────────────────────
  T('sm01','2025-05-12','Salary Deposit',110000,'income','Salary','sarah-brac'),
  T('sm02','2025-05-28','Shwapno Supermarket',3100,'expense','Food & Dining','sarah-dutch-bangla'),
  T('sm03','2025-05-24','Pathao Ride',260,'expense','Transportation','sarah-bkash'),
  T('sm04','2025-05-20','Carnival Internet',2500,'expense','Bills & Utilities','sarah-brac'),
  T('sm05','2025-05-15','Fitness Station',5000,'expense','Personal Care','sarah-brac'),
  T('sm06','2025-05-08','Transfer - Bali Trip',4000,'transfer','Savings','sarah-dutch-bangla'),

  // ─── April 2025 ───────────────────────────────────────────────────────────
  T('sap01','2025-04-12','Salary Deposit',110000,'income','Salary','sarah-brac'),
  T('sap02','2025-04-27','Gloria Jeans Coffee',690,'expense','Food & Dining','sarah-cash'),
  T('sap03','2025-04-24','Uber Ride',345,'expense','Transportation','sarah-bkash'),
  T('sap04','2025-04-20','DESCO Bill',2650,'expense','Bills & Utilities','sarah-bkash'),
  T('sap05','2025-04-15','Daraz - Sunglasses',2400,'expense','Shopping','sarah-city-cc'),
  T('sap06','2025-04-10','La Belle Salon',3100,'expense','Personal Care','sarah-brac'),
  T('sap07','2025-04-06','Freelance Payment',35000,'income','Freelance','sarah-dutch-bangla'),

  // ─── March 2025 ───────────────────────────────────────────────────────────
  T('smr01','2025-03-12','Salary Deposit',110000,'income','Salary','sarah-brac'),
  T('smr02','2025-03-29','Agora Supermarket',4700,'expense','Food & Dining','sarah-brac'),
  T('smr03','2025-03-26','Pathao Ride',285,'expense','Transportation','sarah-bkash'),
  T('smr04','2025-03-22','Carnival Internet',2500,'expense','Bills & Utilities','sarah-brac'),
  T('smr05','2025-03-18','Yellow - Jeans',3900,'expense','Shopping','sarah-city-cc'),
  T('smr06','2025-03-14','Rokomari Books',1950,'expense','Education','sarah-brac'),
  T('smr07','2025-03-08','Transfer - Apartment Fund',10000,'transfer','Savings','sarah-dutch-bangla'),
  T('smr08','2025-03-04','Square Hospital',2200,'expense','Healthcare','sarah-city-cc'),

  // ─── February 2025 ────────────────────────────────────────────────────────
  T('sfb01','2025-02-12','Salary Deposit',110000,'income','Salary','sarah-brac'),
  T('sfb02','2025-02-27','Shwapno Supermarket',3300,'expense','Food & Dining','sarah-dutch-bangla'),
  T('sfb03','2025-02-24','Uber Ride',300,'expense','Transportation','sarah-bkash'),
  T('sfb04','2025-02-18','DESCO Bill',2700,'expense','Bills & Utilities','sarah-bkash'),
  T('sfb05','2025-02-12','Pickaboo - Wireless Mouse',2100,'expense','Shopping','sarah-city-cc'),
  T('sfb06','2025-02-07','Fitness Station',5000,'expense','Personal Care','sarah-brac'),
];

export default transactions;
