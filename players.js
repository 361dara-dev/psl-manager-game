function createPlayer({
  name,
  role,
  overseas,
  basePrice,
  batting,
  bowling,
  age,
  bowlingType = null
}) {
  return {
    name,
    role,
    bowlingType,
    overseas,
    basePrice,

    wage: Math.min(3, +(basePrice * 0.8).toFixed(1)),

    batting,
    bowling,
    age,

    retained: false,
    retentionCount: 0,

    fitness: 100,
    fatigue: 0,
    injured: false,
    injuryDays: 0,

    stats: {
      runs: 0,
      wickets: 0,
      innings: 0,
      matches: 0
    }
  };
}

/* =========================
   PAKISTANI PLAYERS (100)
========================= */

const pakistaniNames = [
  "Babar Azam","Mohammad Rizwan","Fakhar Zaman","Imam-ul-Haq","Saim Ayub",
  "Abdullah Shafique","Shan Masood","Iftikhar Ahmed","Agha Salman","Saud Shakeel",
  "Shadab Khan","Imad Wasim","Mohammad Nawaz","Usama Mir","Faheem Ashraf",
  "Shaheen Afridi","Haris Rauf","Naseem Shah","Mohammad Wasim Jr","Hasan Ali",
  "Abrar Ahmed","Zaman Khan","Ihsanullah","Mir Hamza","Arshad Iqbal",
  "Azam Khan","Sarfaraz Ahmed","Haider Ali","Asif Ali","Khushdil Shah",
  "Kamran Ghulam","Hussain Talat","Sohail Khan","Bilal Asif","Rumman Raees",
  "Mohammad Haris","Sahibzada Farhan","Umar Akmal","Ahmed Shehzad","Sharjeel Khan",
  "Aamer Jamal","Salman Irshad","Wasim Jr","Qasim Akram","Mehrank Mumtaz",
  "Sameen Gul","Zeeshan Malik","Mubasir Khan","Abbas Afridi","Arafat Minhas",
  "Rohail Nazir","Saad Baig","Haseebullah","Sufiyan Muqeem","Shahnawaz Dahani",
  "Amir Jamal","Zahid Mahmood","Sajid Khan","Nauman Ali","Fawad Alam",
  "Mohammad Abbas","Yasir Shah","Mirza Tahir Baig","Saud Khan","Umair Bin Yousuf",
  "Abdul Samad","Mohammad Akhlaq","Ali Imran","Saif Badar","Zeeshan Ashraf",
  "Mohammad Amir Khan","Rizwan Hussain","Sameer Rizvi","Adeel Malik","Musa Khan",
  "Riazullah","Akif Javed","Ubaid Shah","Zaman Akram","Arsalan Khan"
];

const pakistaniPlayers = pakistaniNames.map(name =>
  createPlayer({
    name,
    role: Math.random() < 0.4 ? "Bowler" : Math.random() < 0.5 ? "All-Rounder" : "Batsman",
    overseas: false,
    basePrice: +(0.5 + Math.random() * 2).toFixed(1),
    batting: Math.floor(40 + Math.random() * 50),
    bowling: Math.floor(30 + Math.random() * 60),
    age: Math.floor(19 + Math.random() * 15),
    bowlingType: Math.random() < 0.5 ? "Pace" : "Spin"
  })
);

/* =========================
   OVERSEAS PLAYERS (50)
========================= */

const overseasNames = [
  "David Warner","Glenn Maxwell","Marcus Stoinis","Mitchell Marsh","Josh Inglis",
  "Kane Williamson","Trent Boult","Tim Southee","Devon Conway","Mitchell Santner",
  "Jos Buttler","Ben Stokes","Sam Curran","Moeen Ali","Jofra Archer",
  "Rashid Khan","Mohammad Nabi","Mujeeb Ur Rahman","Fazalhaq Farooqi","Naveen-ul-Haq",
  "Kieron Pollard","Andre Russell","Nicholas Pooran","Jason Holder","Shimron Hetmyer",
  "Quinton de Kock","Anrich Nortje","Kagiso Rabada","Aiden Markram","David Miller",
  "Shakib Al Hasan","Mustafizur Rahman","Litton Das","Taskin Ahmed","Mehidy Hasan",
  "Wanindu Hasaranga","Maheesh Theekshana","Pathum Nissanka","Dushmantha Chameera",
  "Sikandar Raza","Blessing Muzarabani","Sean Williams","Paul Stirling",
  "Harry Brook","Adil Rashid","Alex Hales","Dawid Malan","Tom Curran","Chris Woakes"
];

const overseasPlayers = overseasNames.map(name =>
  createPlayer({
    name,
    role: Math.random() < 0.35 ? "Bowler" : Math.random() < 0.5 ? "All-Rounder" : "Batsman",
    overseas: true,
    basePrice: +(1.2 + Math.random() * 2.3).toFixed(1),
    batting: Math.floor(55 + Math.random() * 40),
    bowling: Math.floor(45 + Math.random() * 45),
    age: Math.floor(22 + Math.random() * 12),
    bowlingType: Math.random() < 0.5 ? "Pace" : "Spin"
  })
);

/* =========================
   FINAL PLAYER POOL (150)
========================= */

const players = [...pakistaniPlayers, ...overseasPlayers];

