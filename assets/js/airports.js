// Top 24 cities for flight calculator
const CITIES = [
  {c:"Marrakech",i:"RAK",o:"GMMX",la:31.60,lo:-8.03},
  {c:"New York",i:"NYC",o:"JFK",la:40.64,lo:-74.01},
  {c:"London",i:"LON",o:"LHR",la:51.47,lo:-0.45},
  {c:"Paris",i:"PAR",o:"CDG",la:49.01,lo:2.55},
  {c:"Tokyo",i:"TYO",o:"HND",la:35.55,lo:139.78},
  {c:"Dubai",i:"DXB",o:"OMDB",la:25.25,lo:55.31},
  {c:"Sydney",i:"SYD",o:"YSSY",la:-33.94,lo:151.18},
  {c:"Los Angeles",i:"LAX",o:"KLAX",la:33.94,lo:-118.41},
  {c:"Singapore",i:"SIN",o:"WSSS",la:1.36,lo:103.99},
  {c:"Hong Kong",i:"HKG",o:"VHHH",la:22.31,lo:113.92},
  {c:"Frankfurt",i:"FRA",o:"EDDF",la:50.03,lo:8.57},
  {c:"Madrid",i:"MAD",o:"LEMD",la:40.47,lo:-3.56},
  {c:"Rome",i:"ROM",o:"FCO",la:41.80,lo:12.25},
  {c:"Istanbul",i:"IST",o:"LTFM",la:41.28,lo:28.75},
  {c:"Amsterdam",i:"AMS",o:"EHAM",la:52.31,lo:4.76},
  {c:"Bangkok",i:"BKK",o:"VTBS",la:13.69,lo:100.75},
  {c:"Seoul",i:"SEL",o:"RKSS",la:37.46,lo:126.44},
  {c:"Toronto",i:"YTO",o:"YYZ",la:43.68,lo:-79.61},
  {c:"Zurich",i:"ZRH",o:"LSZH",la:47.45,lo:8.55},
  {c:"Vienna",i:"VIE",o:"LOWW",la:48.11,lo:16.57},
  {c:"Athens",i:"ATH",o:"LGAV",la:37.94,lo:23.95},
  {c:"Cairo",i:"CAI",o:"HECA",la:30.12,lo:31.41},
  {c:"Moscow",i:"MOW",o:"UUEE",la:55.97,lo:37.41},
  {c:"Johannesburg",i:"JNB",o:"FAJS",la:-26.14,lo:28.24}
];

// Jet configurations
const JETS = {
  light: {r:1200,p:"4–6",m:1.25},
  midsize: {r:2000,p:"6–9",m:1.15},
  super: {r:3000,p:"8–10",m:1.0},
  heavy: {r:5000,p:"10–16",m:0.85},
  ultra: {r:7000,p:"12–18",m:0.75}
};