
const GAME_MODES = {
  timed:   { label:"A tempo",     timed:true,  seconds:180, startOscars:4, scoreMultiplier:1.35, oscarPts:18, speedDiv:10, hintCost:1, training:false },
  relaxed: { label:"Senza tempo", timed:false, seconds:null, startOscars:2, scoreMultiplier:1,   oscarPts:12, speedDiv:0,  hintCost:1, training:false },
  training:{ label:"Allenamento", timed:false, seconds:null, startOscars:99,scoreMultiplier:0.3, oscarPts:0,  speedDiv:0,  hintCost:0, training:true  }
};
const PROGRESSION=[
  {key:"popcorn",  label:"Pop Corn",   img:"img_popcorn",  pts:0},
  {key:"machine",  label:"Machine",    img:"img_machine",  pts:50},
  {key:"caramel",  label:"Caramellati",img:"img_caramel",  pts:150},
  {key:"chair",    label:"Sedie",      img:"img_chair",    pts:300},
  {key:"pellicola",label:"Pellicola",  img:"img_pellicola",pts:500},
  {key:"cinepresa",label:"Cinepresa",  img:"img_cinepresa",pts:750},
  {key:"cinema",   label:"Teatro",     img:"img_cinema",   pts:1000},
  {key:"oscar",    label:"Oscar",      img:"img_oscar",    pts:1500},
];
let totalPopcorn=parseInt(localStorage.getItem("sb_pc")||"0");

const challenges = [
  { start:"Tom Hanks",          target:"Kevin Bacon",        label:"Classico" },
  { start:"Meryl Streep",       target:"Kevin Bacon",        label:"Difficile" },
  { start:"Leonardo DiCaprio",  target:"Scarlett Johansson", label:"Marvel" },
  { start:"Brad Pitt",          target:"Cate Blanchett",     label:"Prestige" },
  { start:"Robert De Niro",     target:"Emma Stone",         label:"Generazioni" },
  { start:"Natalie Portman",    target:"Chris Pratt",        label:"Stelle" },
  { start:"Julia Roberts",      target:"Benedict Cumberbatch", label:"Trasversale" },
  { start:"Joaquin Phoenix",    target:"Margot Robbie",      label:"Oscars" },
];

// DATABASE 100 ATTORI
const actorList = [
  "Tom Hanks","Leonardo DiCaprio","Brad Pitt","Kevin Bacon","Gary Oldman","Christopher Walken",
  "Al Pacino","Robert De Niro","Dustin Hoffman","Antonio Banderas","Harrison Ford","George Clooney",
  "Matt Damon","Mark Wahlberg","Bruce Willis","Edward Norton","Gary Sinise","Bob Odenkirk",
  "Robin Williams","Denzel Washington","Morgan Freeman","Samuel L. Jackson","Will Smith","Nicolas Cage",
  "Johnny Depp","Jim Carrey","Tom Cruise","Russell Crowe","Hugh Jackman","Liam Neeson",
  "Keanu Reeves","Jack Nicholson","Anthony Hopkins","Joaquin Phoenix","Christian Bale","Ben Affleck",
  "Ryan Reynolds","Ryan Gosling","Chris Pratt","Chris Hemsworth","Chris Evans","Robert Downey Jr.",
  "Jeremy Renner","Mark Ruffalo","Idris Elba","Michael Fassbender","James McAvoy","Benedict Cumberbatch",
  "Tom Hiddleston","Jude Law","Ewan McGregor","Daniel Craig","Pierce Brosnan","Mel Gibson",
  "Jeff Bridges","Tommy Lee Jones","Kevin Costner","John Travolta","Billy Crystal","Eddie Murphy",
  "Adam Sandler","Ben Stiller","Owen Wilson","Paul Rudd","Jonah Hill","Seth Rogen",
  "Jamie Foxx","Forest Whitaker","Don Cheadle","Chiwetel Ejiofor","Mahershala Ali","Rami Malek",
  "Timothée Chalamet","Austin Butler","Tom Holland","Zac Efron","Channing Tatum","Dwayne Johnson",
  "Jason Statham","Vin Diesel","Viggo Mortensen","Ian McKellen","Orlando Bloom","Elijah Wood",
  "Sean Astin","Bradley Cooper","Cillian Murphy","Josh Brolin","Christoph Waltz","Javier Bardem",
  "Oscar Isaac","Jason Momoa","Michael B. Jordan","John Boyega","Taron Egerton","Dev Patel",
  "Andrew Garfield","Tobey Maguire","Willem Dafoe","Guy Pearce","Benicio del Toro","Adrien Brody"
];
const actressList = [
  "Meryl Streep","Amy Adams","Robin Wright","Margot Robbie","Natalie Portman","Julia Roberts",
  "Cate Blanchett","Angelina Jolie","Jennifer Lawrence","Sandra Bullock","Charlize Theron","Halle Berry",
  "Viola Davis","Octavia Spencer","Jennifer Aniston","Reese Witherspoon","Gwyneth Paltrow","Renée Zellweger",
  "Helen Mirren","Judi Dench","Emma Thompson","Kate Winslet","Rachel Weisz","Keira Knightley",
  "Scarlett Johansson","Mila Kunis","Emma Stone","Anne Hathaway","Kristen Wiig","Tina Fey",
  "Penélope Cruz","Salma Hayek","Cameron Diaz","Drew Barrymore","Nicole Kidman","Naomi Watts",
  "Michelle Pfeiffer","Sharon Stone","Demi Moore","Whoopi Goldberg","Sigourney Weaver","Glenn Close",
  "Jodie Foster","Susan Sarandon","Brie Larson","Saoirse Ronan","Florence Pugh","Anya Taylor-Joy",
  "Zendaya","Ana de Armas","Aubrey Plaza","Rachel McAdams","Carey Mulligan","Rooney Mara",
  "Michelle Williams","Julianne Moore","Tilda Swinton","Frances McDormand","Laura Dern","Mary Steenburgen",
  "Diane Keaton","Jane Fonda","Taraji P. Henson","Kerry Washington","Lupita Nyong'o","Danai Gurira",
  "Awkwafina","Michelle Yeoh","Zhang Ziyi","Marion Cotillard","Juliette Binoche","Monica Bellucci",
  "Sophia Loren","Uma Thurman","Patricia Arquette","Kathryn Hahn","Jessica Chastain","Emily Blunt",
  "Bryce Dallas Howard","Helena Bonham Carter","Winona Ryder","Mélanie Laurent","Amanda Seyfried",
  "Rose Byrne","Zazie Beetz","Zoe Saldana","Rebecca Ferguson","Charlotte Rampling","Laura Harring",
  "Kirsten Dunst","Helen Hunt","Jennifer Connelly","Naomi Watts","Carrie-Anne Moss","Laura Linney",
  "Kate McKinnon","America Ferrera","Olivia Colman","Cynthia Erivo","Halle Bailey","Ariana DeBose",
  "Jamie Lee Curtis","Sigourney Weaver","Alfre Woodard","Angela Bassett"
];
const allActors = [...actorList, ...actressList];

// DATABASE 100 FILM
const movies = [
  {id:"m1",title:"Forrest Gump",year:1994,rarity:1,tmdbId:13,cast:["Tom Hanks","Robin Wright","Gary Sinise","Mykelti Williamson"]},
  {id:"m2",title:"Catch Me If You Can",year:2002,rarity:1,tmdbId:640,cast:["Tom Hanks","Leonardo DiCaprio","Christopher Walken","Amy Adams"]},
  {id:"m3",title:"The Post",year:2017,rarity:2,tmdbId:400535,cast:["Tom Hanks","Meryl Streep","Bob Odenkirk","Bradley Whitford"]},
  {id:"m4",title:"Cast Away",year:2000,rarity:2,tmdbId:376,cast:["Tom Hanks","Helen Hunt"]},
  {id:"m5",title:"Philadelphia",year:1993,rarity:3,tmdbId:11778,cast:["Tom Hanks","Denzel Washington","Antonio Banderas","Jason Robards"]},
  {id:"m6",title:"Elvis",year:2022,rarity:2,tmdbId:717728,cast:["Austin Butler","Tom Hanks"]},
  {id:"m7",title:"Titanic",year:1997,rarity:1,tmdbId:597,cast:["Leonardo DiCaprio","Kate Winslet","Billy Zane","Kathy Bates"]},
  {id:"m8",title:"The Revenant",year:2015,rarity:2,tmdbId:281957,cast:["Leonardo DiCaprio","Tom Hardy","Will Poulter"]},
  {id:"m9",title:"Inception",year:2010,rarity:1,tmdbId:27205,cast:["Leonardo DiCaprio","Joseph Gordon-Levitt","Marion Cotillard","Tom Hardy","Elliot Page"]},
  {id:"m10",title:"Once Upon a Time in Hollywood",year:2019,rarity:1,tmdbId:466272,cast:["Leonardo DiCaprio","Brad Pitt","Margot Robbie","Al Pacino"]},
  {id:"m11",title:"The Departed",year:2006,rarity:2,tmdbId:1422,cast:["Leonardo DiCaprio","Matt Damon","Mark Wahlberg","Jack Nicholson","Martin Sheen"]},
  {id:"m12",title:"Sleepers",year:1996,rarity:4,tmdbId:10484,cast:["Brad Pitt","Kevin Bacon","Robert De Niro","Dustin Hoffman"]},
  {id:"m13",title:"Fight Club",year:1999,rarity:1,tmdbId:550,cast:["Brad Pitt","Edward Norton","Helena Bonham Carter"]},
  {id:"m14",title:"Se7en",year:1995,rarity:1,tmdbId:807,cast:["Brad Pitt","Morgan Freeman","Kevin Spacey","Gwyneth Paltrow"]},
  {id:"m15",title:"Twelve Monkeys",year:1995,rarity:3,tmdbId:63,cast:["Brad Pitt","Bruce Willis"]},
  {id:"m16",title:"Inglourious Basterds",year:2009,rarity:1,tmdbId:16869,cast:["Brad Pitt","Christoph Waltz","Mélanie Laurent","Michael Fassbender"]},
  {id:"m17",title:"Ocean's Eleven",year:2001,rarity:1,tmdbId:161,cast:["George Clooney","Brad Pitt","Julia Roberts","Matt Damon","Andy Garcia"]},
  {id:"m18",title:"Gravity",year:2013,rarity:1,tmdbId:177572,cast:["Sandra Bullock","George Clooney"]},
  {id:"m19",title:"JFK",year:1991,rarity:4,tmdbId:1813,cast:["Gary Oldman","Kevin Bacon","Tommy Lee Jones","Kevin Costner","Sissy Spacek"]},
  {id:"m20",title:"Air Force One",year:1997,rarity:3,tmdbId:9296,cast:["Harrison Ford","Gary Oldman","Glenn Close"]},
  {id:"m21",title:"The Laundromat",year:2019,rarity:3,tmdbId:590706,cast:["Meryl Streep","Gary Oldman","Antonio Banderas","Sharon Stone"]},
  {id:"m22",title:"The Dark Knight",year:2008,rarity:1,tmdbId:155,cast:["Christian Bale","Gary Oldman","Morgan Freeman","Michael Caine","Maggie Gyllenhaal"]},
  {id:"m23",title:"Batman Begins",year:2005,rarity:2,tmdbId:272,cast:["Christian Bale","Liam Neeson","Gary Oldman","Morgan Freeman","Cillian Murphy"]},
  {id:"m24",title:"Closer",year:2004,rarity:2,tmdbId:9563,cast:["Natalie Portman","Julia Roberts","Jude Law","Clive Owen"]},
  {id:"m25",title:"Black Swan",year:2010,rarity:2,tmdbId:45612,cast:["Natalie Portman","Mila Kunis","Vincent Cassel","Barbara Hershey"]},
  {id:"m26",title:"Good Will Hunting",year:1997,rarity:1,tmdbId:489,cast:["Matt Damon","Robin Williams","Ben Affleck","Minnie Driver"]},
  {id:"m27",title:"The Martian",year:2015,rarity:1,tmdbId:286217,cast:["Matt Damon","Jessica Chastain","Chiwetel Ejiofor","Kristen Wiig"]},
  {id:"m28",title:"Interstellar",year:2014,rarity:1,tmdbId:157336,cast:["Matthew McConaughey","Anne Hathaway","Jessica Chastain","Matt Damon"]},
  {id:"m29",title:"The Avengers",year:2012,rarity:1,tmdbId:24428,cast:["Robert Downey Jr.","Chris Evans","Chris Hemsworth","Scarlett Johansson","Mark Ruffalo","Jeremy Renner","Samuel L. Jackson"]},
  {id:"m30",title:"Iron Man",year:2008,rarity:1,tmdbId:1726,cast:["Robert Downey Jr.","Gwyneth Paltrow","Jeff Bridges","Terrence Howard"]},
  {id:"m31",title:"Captain America: Civil War",year:2016,rarity:1,tmdbId:271110,cast:["Chris Evans","Robert Downey Jr.","Scarlett Johansson","Tom Holland","Jeremy Renner","Chadwick Boseman"]},
  {id:"m32",title:"Thor: Ragnarok",year:2017,rarity:1,tmdbId:284053,cast:["Chris Hemsworth","Tom Hiddleston","Cate Blanchett","Idris Elba","Mark Ruffalo"]},
  {id:"m33",title:"Guardians of the Galaxy",year:2014,rarity:1,tmdbId:118340,cast:["Chris Pratt","Zoe Saldana","Dave Bautista","Vin Diesel","Bradley Cooper"]},
  {id:"m34",title:"Avengers: Infinity War",year:2018,rarity:1,tmdbId:299536,cast:["Robert Downey Jr.","Chris Hemsworth","Benedict Cumberbatch","Scarlett Johansson","Chris Pratt","Tom Holland","Idris Elba","Chadwick Boseman"]},
  {id:"m35",title:"Django Unchained",year:2012,rarity:1,tmdbId:68718,cast:["Jamie Foxx","Christoph Waltz","Leonardo DiCaprio","Samuel L. Jackson","Kerry Washington"]},
  {id:"m36",title:"X-Men: First Class",year:2011,rarity:2,tmdbId:49538,cast:["James McAvoy","Michael Fassbender","Jennifer Lawrence","Kevin Bacon","Rose Byrne"]},
  {id:"m37",title:"12 Years a Slave",year:2013,rarity:2,tmdbId:76203,cast:["Chiwetel Ejiofor","Michael Fassbender","Brad Pitt","Lupita Nyong'o","Benedict Cumberbatch"]},
  {id:"m38",title:"Doctor Strange",year:2016,rarity:1,tmdbId:284052,cast:["Benedict Cumberbatch","Rachel McAdams","Tilda Swinton","Chiwetel Ejiofor"]},
  {id:"m39",title:"The Matrix",year:1999,rarity:1,tmdbId:603,cast:["Keanu Reeves","Laurence Fishburne","Carrie-Anne Moss","Hugo Weaving"]},
  {id:"m40",title:"John Wick",year:2014,rarity:1,tmdbId:245891,cast:["Keanu Reeves","Ian McShane","Willem Dafoe","Adrianne Palicki"]},
  {id:"m41",title:"Speed",year:1994,rarity:2,tmdbId:1637,cast:["Keanu Reeves","Sandra Bullock","Dennis Hopper"]},
  {id:"m42",title:"Gladiator",year:2000,rarity:1,tmdbId:98,cast:["Russell Crowe","Joaquin Phoenix","Oliver Reed","Richard Harris","Connie Nielsen"]},
  {id:"m43",title:"Joker",year:2019,rarity:1,tmdbId:475557,cast:["Joaquin Phoenix","Robert De Niro","Zazie Beetz","Frances Conroy"]},
  {id:"m44",title:"Goodfellas",year:1990,rarity:1,tmdbId:769,cast:["Robert De Niro","Ray Liotta","Joe Pesci","Lorraine Bracco"]},
  {id:"m45",title:"The Godfather",year:1972,rarity:1,tmdbId:238,cast:["Marlon Brando","Al Pacino","James Caan","Robert Duvall","Diane Keaton"]},
  {id:"m46",title:"Scarface",year:1983,rarity:1,tmdbId:111,cast:["Al Pacino","Michelle Pfeiffer","Steven Bauer","Mary Elizabeth Mastrantonio"]},
  {id:"m47",title:"Heat",year:1995,rarity:2,tmdbId:9693,cast:["Al Pacino","Robert De Niro","Val Kilmer","Jon Voight","Natalie Portman"]},
  {id:"m48",title:"The Deer Hunter",year:1978,rarity:3,tmdbId:11778,cast:["Robert De Niro","Meryl Streep","Christopher Walken","John Cazale"]},
  {id:"m49",title:"Kramer vs. Kramer",year:1979,rarity:3,tmdbId:9312,cast:["Dustin Hoffman","Meryl Streep","Jane Alexander"]},
  {id:"m50",title:"The Devil Wears Prada",year:2006,rarity:1,tmdbId:10674,cast:["Meryl Streep","Anne Hathaway","Emily Blunt","Stanley Tucci"]},
  {id:"m51",title:"Mamma Mia!",year:2008,rarity:1,tmdbId:10020,cast:["Meryl Streep","Pierce Brosnan","Colin Firth","Amanda Seyfried"]},
  {id:"m52",title:"The Hours",year:2002,rarity:3,tmdbId:12183,cast:["Meryl Streep","Nicole Kidman","Julianne Moore","Ed Harris"]},
  {id:"m53",title:"Eyes Wide Shut",year:1999,rarity:3,tmdbId:1640,cast:["Tom Cruise","Nicole Kidman","Sydney Pollack"]},
  {id:"m54",title:"Moulin Rouge!",year:2001,rarity:1,tmdbId:628,cast:["Nicole Kidman","Ewan McGregor","Jim Broadbent","Richard Roxburgh"]},
  {id:"m55",title:"Chicago",year:2002,rarity:1,tmdbId:1574,cast:["Renée Zellweger","Catherine Zeta-Jones","Richard Gere","Queen Latifah"]},
  {id:"m56",title:"Pretty Woman",year:1990,rarity:1,tmdbId:11502,cast:["Julia Roberts","Richard Gere","Hector Elizondo"]},
  {id:"m57",title:"Notting Hill",year:1999,rarity:1,tmdbId:1655,cast:["Julia Roberts","Hugh Grant","Rhys Ifans","Emma Chambers"]},
  {id:"m58",title:"My Best Friend's Wedding",year:1997,rarity:2,tmdbId:9325,cast:["Julia Roberts","Dermot Mulroney","Cameron Diaz","Rupert Everett"]},
  {id:"m59",title:"Mulholland Drive",year:2001,rarity:4,tmdbId:203,cast:["Naomi Watts","Laura Harring","Ann Miller"]},
  {id:"m60",title:"King Kong",year:2005,rarity:2,tmdbId:8869,cast:["Naomi Watts","Jack Black","Adrien Brody"]},
  {id:"m61",title:"The Lord of the Rings: The Fellowship",year:2001,rarity:1,tmdbId:120,cast:["Elijah Wood","Ian McKellen","Viggo Mortensen","Orlando Bloom","Sean Astin","Cate Blanchett"]},
  {id:"m62",title:"The Lord of the Rings: The Return of the King",year:2003,rarity:1,tmdbId:122,cast:["Elijah Wood","Ian McKellen","Viggo Mortensen","Orlando Bloom","Sean Astin","Cate Blanchett","Andy Serkis"]},
  {id:"m63",title:"Pirates of the Caribbean",year:2003,rarity:1,tmdbId:22,cast:["Johnny Depp","Orlando Bloom","Keira Knightley","Geoffrey Rush"]},
  {id:"m64",title:"Edward Scissorhands",year:1990,rarity:2,tmdbId:311,cast:["Johnny Depp","Winona Ryder","Dianne Wiest"]},
  {id:"m65",title:"Sweeney Todd",year:2007,rarity:2,tmdbId:4512,cast:["Johnny Depp","Helena Bonham Carter","Alan Rickman"]},
  {id:"m66",title:"A Few Good Men",year:1992,rarity:2,tmdbId:10349,cast:["Tom Cruise","Jack Nicholson","Demi Moore","Kevin Bacon"]},
  {id:"m67",title:"Jerry Maguire",year:1996,rarity:2,tmdbId:336,cast:["Tom Cruise","Renée Zellweger","Cuba Gooding Jr."]},
  {id:"m68",title:"The Truman Show",year:1998,rarity:1,tmdbId:37165,cast:["Jim Carrey","Laura Linney","Ed Harris","Noah Emmerich"]},
  {id:"m69",title:"Eternal Sunshine of the Spotless Mind",year:2004,rarity:2,tmdbId:38,cast:["Jim Carrey","Kate Winslet","Kirsten Dunst","Mark Ruffalo","Elijah Wood"]},
  {id:"m70",title:"The Mask",year:1994,rarity:1,tmdbId:8467,cast:["Jim Carrey","Cameron Diaz","Peter Riegert"]},
  {id:"m71",title:"Birdman",year:2014,rarity:2,tmdbId:194662,cast:["Michael Keaton","Edward Norton","Emma Stone","Naomi Watts","Zach Galifianakis"]},
  {id:"m72",title:"La La Land",year:2016,rarity:1,tmdbId:313369,cast:["Ryan Gosling","Emma Stone","John Legend","Rosemarie DeWitt"]},
  {id:"m73",title:"The Notebook",year:2004,rarity:1,tmdbId:11036,cast:["Ryan Gosling","Rachel McAdams","James Garner","Gena Rowlands"]},
  {id:"m74",title:"Crazy, Stupid, Love",year:2011,rarity:2,tmdbId:50014,cast:["Ryan Gosling","Steve Carell","Emma Stone","Julianne Moore","Kevin Bacon"]},
  {id:"m75",title:"Silver Linings Playbook",year:2012,rarity:1,tmdbId:116745,cast:["Bradley Cooper","Jennifer Lawrence","Robert De Niro","Jacki Weaver"]},
  {id:"m76",title:"American Hustle",year:2013,rarity:2,tmdbId:207398,cast:["Christian Bale","Amy Adams","Bradley Cooper","Jennifer Lawrence","Robert De Niro"]},
  {id:"m77",title:"The Fighter",year:2010,rarity:2,tmdbId:45317,cast:["Mark Wahlberg","Christian Bale","Amy Adams","Melissa Leo"]},
  {id:"m78",title:"Arrival",year:2016,rarity:2,tmdbId:329865,cast:["Amy Adams","Jeremy Renner","Forest Whitaker"]},
  {id:"m79",title:"Sicario",year:2015,rarity:2,tmdbId:273481,cast:["Emily Blunt","Benicio del Toro","Josh Brolin","Jeremy Renner"]},
  {id:"m80",title:"Oppenheimer",year:2023,rarity:1,tmdbId:872585,cast:["Cillian Murphy","Emily Blunt","Matt Damon","Robert Downey Jr.","Florence Pugh","Rami Malek","Josh Brolin","Kenneth Branagh"]},
  {id:"m81",title:"Barbie",year:2023,rarity:1,tmdbId:346698,cast:["Margot Robbie","Ryan Gosling","America Ferrera","Kate McKinnon","Will Ferrell","Issa Rae","Simu Liu"]},
  {id:"m82",title:"Dune",year:2021,rarity:1,tmdbId:438631,cast:["Timothée Chalamet","Zendaya","Rebecca Ferguson","Oscar Isaac","Josh Brolin","Javier Bardem","Jason Momoa","Charlotte Rampling"]},
  {id:"m83",title:"Spencer",year:2021,rarity:3,tmdbId:671782,cast:["Kristen Stewart","Timothy Spall","Sally Hawkins"]},
  {id:"m84",title:"Poor Things",year:2023,rarity:3,tmdbId:792307,cast:["Emma Stone","Mark Ruffalo","Willem Dafoe","Ramy Youssef"]},
  {id:"m85",title:"Gladiator II",year:2024,rarity:2,tmdbId:558449,cast:["Paul Mescal","Pedro Pascal","Denzel Washington","Connie Nielsen"]},
  {id:"m86",title:"Mad Max: Fury Road",year:2015,rarity:1,tmdbId:76341,cast:["Tom Hardy","Charlize Theron","Nicholas Hoult","Hugh Keays-Byrne"]},
  {id:"m87",title:"A Beautiful Mind",year:2001,rarity:2,tmdbId:453,cast:["Russell Crowe","Jennifer Connelly","Ed Harris","Paul Bettany"]},
  {id:"m88",title:"The Silence of the Lambs",year:1991,rarity:1,tmdbId:274,cast:["Anthony Hopkins","Jodie Foster","Scott Glenn","Ted Levine"]},
  {id:"m89",title:"Schindler's List",year:1993,rarity:2,tmdbId:424,cast:["Liam Neeson","Ben Kingsley","Ralph Fiennes"]},
  {id:"m90",title:"The Hurt Locker",year:2008,rarity:3,tmdbId:12162,cast:["Jeremy Renner","Anthony Mackie","Brian Geraghty"]},
  {id:"m91",title:"Zero Dark Thirty",year:2012,rarity:3,tmdbId:89751,cast:["Jessica Chastain","Jason Clarke","Joel Edgerton","Jeremy Renner"]},
  {id:"m92",title:"One Flew Over the Cuckoo's Nest",year:1975,rarity:1,tmdbId:1366,cast:["Jack Nicholson","Louise Fletcher","Danny DeVito","Christopher Lloyd"]},
  {id:"m93",title:"As Good as It Gets",year:1997,rarity:2,tmdbId:786,cast:["Jack Nicholson","Helen Hunt","Greg Kinnear"]},
  {id:"m94",title:"The Talented Mr. Ripley",year:1999,rarity:3,tmdbId:2758,cast:["Matt Damon","Gwyneth Paltrow","Jude Law","Cate Blanchett"]},
  {id:"m95",title:"Carol",year:2015,rarity:3,tmdbId:258480,cast:["Cate Blanchett","Rooney Mara","Kyle Chandler","Jake Lacy"]},
  {id:"m96",title:"Little Women",year:2019,rarity:2,tmdbId:331354,cast:["Saoirse Ronan","Florence Pugh","Meryl Streep","Emma Watson","Eliza Scanlen","Laura Dern","Timothée Chalamet"]},
  {id:"m97",title:"Midsommar",year:2019,rarity:3,tmdbId:530385,cast:["Florence Pugh","Jack Reynor","William Jackson Harper","Will Poulter"]},
  {id:"m98",title:"The Queen's Gambit",year:2020,rarity:2,tmdbId:87739,cast:["Anya Taylor-Joy","Bill Camp","Moses Ingram"]},
  {id:"m99",title:"Marriage Story",year:2019,rarity:2,tmdbId:492188,cast:["Scarlett Johansson","Adam Driver","Laura Dern","Ray Liotta"]},
  {id:"m100",title:"Lost in Translation",year:2003,rarity:2,tmdbId:153,cast:["Scarlett Johansson","Bill Murray","Giovanni Ribisi"]}
];

// Costruisco una mappa attore → immagine (TMDB se key disponibile, altrimenti placeholder)
const imgCache = {};
function actorImg(name) {
  if (tmdbActorImgs[name]) return tmdbActorImgs[name];
  if (imgCache[name]) return imgCache[name];
  const slug = name.toLowerCase().replace(/[^a-z0-9]/g,'-').replace(/-+/g,'-');
  return `https://picsum.photos/seed/sb-${slug}/700/900`;
}
function posterImg(movie) {
  if (movie._poster) return movie._poster;
  return `https://picsum.photos/seed/sbp-${movie.id}/500/720`;
}

// TMDB loader
const tmdbActorImgs = {};
async function loadTMDBImages() {
  if (!TMDB_KEY) return;
  showTMDBStatus("Caricamento immagini TMDB in corso...");
  // 1. Carica poster film (usando tmdbId già mappati)
  const movieBatch = [...movies];
  for (let i = 0; i < movieBatch.length; i++) {
    const m = movieBatch[i];
    try {
      const r = await fetch(`https://api.themoviedb.org/3/movie/${m.tmdbId}?api_key=${TMDB_KEY}&language=it`);
      const d = await r.json();
      if (d.poster_path) m._poster = `https://image.tmdb.org/t/p/w342${d.poster_path}`;
    } catch(e) {}
    if (i % 10 === 0) { updateSel(); renderPath(); }
  }
  // 2. Carica foto attori (solo quelli nelle sfide + attore corrente)
  const actorsToLoad = new Set();
  challenges.forEach(ch => { actorsToLoad.add(ch.start); actorsToLoad.add(ch.target); });
  actorsToLoad.add(START); actorsToLoad.add(TARGET);
  for (const name of actorsToLoad) {
    await loadActorImg(name);
  }
  hideTMDBStatus();
  render();
}

async function loadActorImg(name) {
  if (tmdbActorImgs[name]) return tmdbActorImgs[name];
  try {
    const r = await fetch(`https://api.themoviedb.org/3/search/person?api_key=${TMDB_KEY}&query=${encodeURIComponent(name)}&language=it`);
    const d = await r.json();
    if (d.results && d.results[0] && d.results[0].profile_path) {
      tmdbActorImgs[name] = `https://image.tmdb.org/t/p/w342${d.results[0].profile_path}`;
    }
  } catch(e) {}
  return tmdbActorImgs[name] || null;
}

function showTMDBStatus(msg) {
  const el = document.getElementById("tmdbStatus");
  if (el) { el.textContent = msg; el.style.display = "block"; }
}
function hideTMDBStatus() {
  const el = document.getElementById("tmdbStatus");
  if (el) el.style.display = "none";
}

// ===== STATO GIOCO =====
let mode = "timed";
let curChallenge = 0;
let START = "", TARGET = "", cur = "";
let path = [], secsLeft = 0, oscars = 0, state = "playing", tid = null, selMov = "", selAct = "";

const $ = id => document.getElementById(id);

function init() {
  // mode buttons
  $("modeTimed").addEventListener("click", () => setMode("timed"));
  $("modeRelax").addEventListener("click", () => setMode("relaxed"));
  $("modeLearn").addEventListener("click", () => setMode("training"));
  // game buttons
  $("movieSel").addEventListener("change", () => { selMov=$("movieSel").value; hideMsg(); updateSel(); });
  $("actorSel").addEventListener("change", () => {
    selAct=$("actorSel").value; hideMsg();
    if(GAME_MODES[mode].training){ if(selAct) filterMoviesForTraining(selAct); else fillMovies(); }
    updateSel();
  });
  $("confBtn").addEventListener("click", verify);
  $("hintBtn").addEventListener("click", useHint);
  $("resetBtn").addEventListener("click", () => startGame(START, TARGET));
  $("playAgainBtn").addEventListener("click", () => startGame(START, TARGET));
  $("newChallengeBtn").addEventListener("click", nextChallenge);
  buildChallengeButtons();
  fillMovies();
  fillActors();
  injectAssets();
  loadTMDBImages();
  startChallenge(0);
}

function buildChallengeButtons() {
  const list = $("challengeList");
  list.innerHTML = "";
  challenges.forEach((ch, i) => {
    const btn = document.createElement("button");
    btn.className = "ch-btn" + (i === curChallenge ? " active" : "");
    btn.textContent = ch.label;
    btn.addEventListener("click", () => startChallenge(i));
    btn.id = `ch-${i}`;
    list.appendChild(btn);
  });
  // bottone random
  const rnd = document.createElement("button");
  rnd.className = "ch-btn";
  rnd.textContent = "🎲 Random";
  rnd.addEventListener("click", randomChallenge);
  list.appendChild(rnd);
}

function setMode(m) {
  mode = m;
  $("modeTimed").classList.toggle("active", m === "timed");
  $("modeRelax").classList.toggle("active", m === "relaxed");
  $("modeLearn").classList.toggle("active", m === "training");
  startGame(START, TARGET);
}

function startChallenge(i) {
  curChallenge = i;
  document.querySelectorAll(".ch-btn").forEach((b,j) => b.classList.toggle("active", j === i));
  const ch = challenges[i];
  startGame(ch.start, ch.target);
}

function randomChallenge() {
  const connected = getConnectedActors();
  let a1, a2;
  do { a1 = connected[Math.floor(Math.random()*connected.length)]; } while(!a1);
  do { a2 = connected[Math.floor(Math.random()*connected.length)]; } while(a2 === a1);
  document.querySelectorAll(".ch-btn").forEach(b => b.classList.remove("active"));
  startGame(a1, a2);
}

function nextChallenge() {
  curChallenge = (curChallenge + 1) % challenges.length;
  startChallenge(curChallenge);
}

function startGame(start, target) {
  START = start; TARGET = target; cur = start;
  path = []; selMov = ""; selAct = "";
  const m = GAME_MODES[mode];
  secsLeft = m.timed ? m.seconds : 9999;
  oscars = m.startOscars;
  state = "playing";
  $("movieSel").value = ""; $("actorSel").value = "";
  $("msgBox").className = "msg"; $("msgBox").innerHTML = "";
  $("resultBox").classList.remove("vis");
  $("selBox").style.display = "grid";
  $("hintBtn").disabled = false;
  clearInterval(tid);
  if (m.timed) tid = setInterval(tick, 1000);
  render();
}

function tick() {
  if (state !== "playing") return;
  secsLeft--;
  if (secsLeft <= 0) {
    secsLeft = 0;
    oscars += 1; // Oscar consolazione
    endGame(false, "Tempo scaduto", "Non hai completato il ponte in tempo. Hai guadagnato 1 Oscar di consolazione.", "⏱");
  }
  renderHud();
}

function fillMovies() {
  $("movieSel").innerHTML = `<option value="">Seleziona un film...</option>`;
  [...movies].sort((a,b) => a.title.localeCompare(b.title,"it")).forEach(m => {
    const o = document.createElement("option");
    o.value = m.id; o.textContent = `${m.title} (${m.year})`;
    $("movieSel").appendChild(o);
  });
}

function fillActors() {
  const all = getConnectedActors().sort((a,b) => a.localeCompare(b,"it"));
  $("actorSel").innerHTML = `<option value="">Seleziona un attore...</option>`;
  all.forEach(a => {
    const o = document.createElement("option");
    o.value = a; o.textContent = a;
    $("actorSel").appendChild(o);
  });
}

function getConnectedActors() {
  const s = new Set();
  movies.forEach(m => m.cast.forEach(a => s.add(a)));
  return [...s];
}

function getMovie() { return selMov ? movies.find(m => m.id === selMov) : null; }

function verify() {
  if (state !== "playing") return;
  const m = getMovie(); if (!m || !selAct) return;
  const hasC = m.cast.includes(cur), hasN = m.cast.includes(selAct);
  const valid = hasC && hasN && cur !== selAct;
  if (!valid) {
    oscars = Math.max(0, oscars - 1);
    const reason = !hasC && !hasN ? `"${m.title}" non contiene né ${cur} né ${selAct}.`
      : !hasC ? `"${m.title}" non contiene ${cur}.`
      : !hasN ? `"${m.title}" non contiene ${selAct}.`
      : "Non puoi collegare un attore a se stesso.";
    showMsg(`❌ Collegamento sbagliato — ${reason} –1 Oscar.`, "err");
    selMov = ""; selAct = ""; $("movieSel").value = ""; $("actorSel").value = "";
    render();
    if (oscars <= 0) endGame(false, "Oscar finiti", "Troppi errori. Il ponte è crollato.", "🏅");
    return;
  }
  path.push({ from:cur, movie:m.title, year:m.year, rarity:m.rarity, poster:posterImg(m), next:selAct });
  cur = selAct; selMov = ""; selAct = ""; $("movieSel").value = ""; $("actorSel").value = "";
  showMsg("✅ Collegamento valido! Ponte aggiornato.", "ok");
  if (cur === TARGET) { endGame(true, "Ponte completato!", `Hai collegato ${START} a ${TARGET} in ${path.length} grado/i!`, "🏆"); return; }
  if (path.length >= 6) { endGame(false, "Troppi gradi", `Hai superato i 6 gradi senza raggiungere ${TARGET}.`, "🎬"); return; }
  render();
}

function useHint() {
  if (state !== "playing") return;
  const m = GAME_MODES[mode];
  if (oscars < m.hintCost) { showMsg("❌ Non hai abbastanza Oscar per l'aiuto.", "err"); return; }
  const moviesWithCur = movies.filter(mv => mv.cast.includes(cur));
  if (!moviesWithCur.length) { showMsg("💡 Nessun film trovato nel database per l'attore attuale.", "hint"); return; }
  const pick = moviesWithCur[Math.floor(Math.random() * moviesWithCur.length)];
  oscars = Math.max(0, oscars - m.hintCost);
  const costar = pick.cast.filter(a => a !== cur).slice(0,3).join(", ");
  showMsg(`💡 <strong>${cur}</strong> appare in <em>${pick.title}</em> (${pick.year}) con: ${costar}. –1 Oscar.`, "hint");
  renderHud();
}

function endGame(won, title, txt, icon) {
  state = won ? "won" : "lost";
  clearInterval(tid);
  $("selBox").style.display = "none";
  $("resultBox").classList.add("vis");
  $("msgBox").className = "msg";
  $("hintBtn").disabled = true;
  $("resIcon").textContent = icon;
  $("resTitle").textContent = title;
  $("resTxt").textContent = txt;
  const sc = calcScore();
  $("finalSc").textContent = sc;
  $("finalDeg").textContent = path.length;
  const pc = calcPopcorn(won, sc);
  $("popcornEarned").textContent = pc;
  $("popcornReward").style.display = pc > 0 ? "flex" : "none";
  render();
}

function calcPopcorn(won, score) {
  if (!won) return Math.floor(score / 30);
  return 50 + Math.floor(score / 10);
}

function render() { renderHud(); renderCur(); updateSel(); renderPath(); }

function renderHud() {
  const m = GAME_MODES[mode];
  $("tv").textContent = m.timed ? fmtTime(secsLeft) : "∞";
  $("sv").textContent = calcScore();
  $("dv").textContent = `${path.length}/6`;
  $("ov").textContent = oscars;
}

function renderCur() {
  const el = $("curActor");
  el.style.opacity = 0; el.style.transform = "translateY(5px)";
  setTimeout(() => { el.textContent = cur; el.style.opacity = 1; el.style.transform = "translateY(0)"; }, 110);
  // Carica foto TMDB se non ancora in cache
  if (TMDB_KEY && (!tmdbActorImgs[START] || !tmdbActorImgs[TARGET])) {
    Promise.all([loadActorImg(START), loadActorImg(TARGET)]).then(() => {
      $("startImg").src = actorImg(START);
      $("targetImg").src = actorImg(TARGET);
    });
  }
  $("startImg").src = actorImg(START);
  $("targetImg").src = actorImg(TARGET);
  $("startName").textContent = START;
  $("targetName").textContent = TARGET;
  $("startCard").classList.toggle("active", cur === START);
  $("targetCard").classList.toggle("active", cur === TARGET);
}

function updateSel() {
  const m = getMovie(); const ready = !!(m && selAct);
  $("confBtn").disabled = !ready;
  if (!m && !selAct) $("confTxt").textContent = "Scegli un film e un attore per verificare il collegamento.";
  else if (!m) $("confTxt").textContent = `Hai scelto ${selAct}. Ora scegli il film che lo collega a ${cur}.`;
  else if (!selAct) $("confTxt").textContent = `Film: "${m.title}". Ora scegli l'attore da collegare a ${cur}.`;
  else $("confTxt").textContent = `Verifica: ${cur} → ${selAct} via "${m.title}".`;
  if (m) {
    $("prev").classList.add("vis");
    $("prevPoster").src = posterImg(m);
    $("prevTitle").textContent = m.title;
    $("prevYear").textContent = `${m.year}`;
    $("prevGuess").textContent = selAct ? `${cur} → ${selAct}` : `Cast: ${m.cast.slice(0,3).join(", ")}...`;
    $("prevRarity").textContent = `Rarità ${m.rarity} · +${m.rarity*10} pt`;
  } else { $("prev").classList.remove("vis"); }
}

function renderPath() {
  $("stepCtr").textContent = `${path.length} / 6 gradi`;
  $("emptyPath").style.display = path.length === 0 ? "block" : "none";
  $("pathList").innerHTML = "";
  path.forEach((s, i) => {
    const el = document.createElement("article");
    el.className = "path-step";
    el.innerHTML = `<img src="${s.poster}" alt=""/><div><div class="step-no">Grado ${i+1}</div><div class="path-movie">${esc(s.movie)} (${s.year})</div><div class="path-actors">${esc(s.from)} → ${esc(s.next)}</div><span class="pill">Rarità ${s.rarity} · +${s.rarity*10} pt</span></div>`;
    $("pathList").appendChild(el);
  });
}

function showMsg(t, type) { $("msgBox").innerHTML = t; $("msgBox").className = `msg vis ${type||""}`; }
function hideMsg() { $("msgBox").className = "msg"; $("msgBox").innerHTML = ""; }

function calcScore() {
  const m = GAME_MODES[mode];
  const rp = path.reduce((s,x) => s + x.rarity, 0) * 10;
  const sp = m.timed ? Math.floor(secsLeft / m.speedDiv) : 0;
  const dp = path.length > 0 ? Math.max(0, 60 - path.length * 8) : 0;
  const op = oscars * m.oscarPts;
  return Math.round((rp + sp + dp + op) * m.scoreMultiplier);
}

function rarLabel(v) { return v <= 1 ? "famoso" : v <= 3 ? "medio" : "raro"; }
function fmtTime(s) { return `${Math.floor(s/60)}:${(s%60).toString().padStart(2,"0")}`; }
function esc(v) { return String(v).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;"); }

function filterMoviesForTraining(next){
  const valid=movies.filter(m=>m.cast.includes(cur)&&m.cast.includes(next)&&cur!==next);
  $("movieSel").innerHTML=valid.length
    ? `<option value="">Film validi: ${valid.length} — scegli...</option>`
    : `<option value="">Nessun collegamento diretto trovato</option>`;
  valid.sort((a,b)=>a.title.localeCompare(b.title,"it")).forEach(m=>{
    const o=document.createElement("option");
    o.value=m.id; o.textContent=`${m.title} (${m.year})`; $("movieSel").appendChild(o);
  });
}

function levelOf(pts){
  for(let i=PROGRESSION.length-1;i>=0;i--) if(pts>=PROGRESSION[i].pts) return i;
  return 0;
}

function renderProgression(){
  const chain=$("progChain"); if(!chain) return;
  const lv=levelOf(totalPopcorn);
  chain.innerHTML="";
  PROGRESSION.forEach((p,i)=>{
    if(i>0){const a=document.createElement("span");a.className="prog-arrow";a.textContent="›";chain.appendChild(a);}
    const d=document.createElement("div");
    d.className="prog-item"+(i<=lv?" on":"")+(i===lv?" cur":"");
    d.innerHTML=`<img src="${ASSETS[p.img]||""}" alt="${p.label}"/><span>${p.label}</span>`;
    chain.appendChild(d);
  });
  const lp=PROGRESSION[lv];
  const ri=$("rewardIcon"); if(ri) ri.src=ASSETS[lp.img]||"";
  const rn=$("rewardName"); if(rn) rn.textContent=lp.label;
}

function injectAssets(){
  const icPc=$("icPc"); if(icPc) icPc.src=ASSETS.img_popcorn||"";
  const icPl=$("icPl"); if(icPl) icPl.src=ASSETS.img_pellicola||"";
  const icOs=$("icOs"); if(icOs) icOs.src=ASSETS.img_oscar||"";
  const il=$("iconLearn"); if(il) il.src=ASSETS.img_cinepresa||"";
}


// ===== SPLASH SCREEN =====
function runSplash() {
  const splash = document.getElementById("splashScreen");
  const main = document.getElementById("mainApp");
  const bar = document.getElementById("splashBar");
  const msg = document.getElementById("splashMsg");
  if (!splash) return;
  // Progressione simulata
  const steps = [
    [300,  15, "Preparando il database..."],
    [700,  40, "Caricando gli attori..."],
    [1200, 65, "Collegando i film..."],
    [1700, 85, "Quasi pronto..."],
    [2200, 100, "Pronti!"],
  ];
  steps.forEach(([delay, pct, text]) => {
    setTimeout(() => {
      bar.style.width = pct + "%";
      msg.textContent = text;
    }, delay);
  });
  // Dissolvenza
  setTimeout(() => {
    splash.style.opacity = "0";
    splash.style.transform = "scale(1.04)";
    main.style.opacity = "1";
    setTimeout(() => { splash.style.display = "none"; }, 750);
  }, 2600);
}

// ── Inizializzazione gioco dall'esterno ──
function initGame() {
  if (window._gameReady) return;
  window._gameReady = true;
  try {
    buildChallengeButtons();
    fillMovies();
    fillActors();
    if (typeof injectAssets === 'function') injectAssets();
    startChallenge(0);
  } catch(e) { console.error('initGame error:', e); }
}
