const TMDB_KEY = window.TMDB_KEY || ""; // lascia vuoto se non usi TMDB
// SIL_MAN loaded from assets-loader.js (window.SIL_MAN)
// SIL_WOMAN loaded from assets-loader.js (window.SIL_WOMAN)

// ── ASSETS globale — dipende da assets.js ──
(function() {
  if (!window.ASSETS) window.ASSETS = {};
  if (typeof IMG   !== 'undefined') Object.assign(window.ASSETS, IMG);
  if (typeof EXTRA !== 'undefined') Object.assign(window.ASSETS, EXTRA);
  // Alias per icone HUD e progressione Mondo Pop Corn
  var A = window.ASSETS;
  if (!A.img_popcorn)   A.img_popcorn   = A.popcorn_sm || '';
  if (!A.img_oscar)     A.img_oscar     = A.oscar_sm   || '';
  if (!A.img_pellicola) A.img_pellicola = A.oscar_sm   || '';
  if (!A.img_cinepresa) A.img_cinepresa = A.oscar_sm   || '';
  if (!A.img_machine)   A.img_machine   = A.popcorn_sm || '';
  if (!A.img_caramel)   A.img_caramel   = A.popcorn_sm || '';
  if (!A.img_chair)     A.img_chair     = A.popcorn_sm || '';
  if (!A.img_cinema)    A.img_cinema    = A.oscar_sm   || '';
})();


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
  { start:"Tom Hanks",          target:"Kevin Bacon",         label:"Classico" },
  { start:"Meryl Streep",       target:"Kevin Bacon",         label:"Difficile" },
  { start:"Leonardo DiCaprio",  target:"Denzel Washington",   label:"Generazioni" },
  { start:"Brad Pitt",          target:"Cate Blanchett",      label:"Prestige" },
  { start:"Tom Hardy",          target:"Meryl Streep",        label:"Trasversale" },
  { start:"Natalie Portman",    target:"Chris Pratt",         label:"Stelle" },
  { start:"Julia Roberts",      target:"Benedict Cumberbatch",label:"Epoche" },
  { start:"Joaquin Phoenix",    target:"Margot Robbie",       label:"Oscars" },
  { start:"Chadwick Boseman",   target:"Ryan Gosling",         label:"Marvel" },
  { start:"Cillian Murphy",     target:"Emma Stone",          label:"Nolan" },
];

// DATABASE ATTORI (120+)
const actorList = [
  // Classici / Oscar
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
  "Andrew Garfield","Tobey Maguire","Willem Dafoe","Guy Pearce","Benicio del Toro","Adrien Brody",
  // Nuovi
  "Tom Hardy","Joseph Gordon-Levitt","Chadwick Boseman","Adam Driver","Colin Firth",
  "Ed Harris","Jake Gyllenhaal","Hugh Grant","Laurence Fishburne","Michael Caine",
  "Matthew McConaughey","Martin Sheen","Richard Gere","Paul Dano","Barry Keoghan",
  "Jacob Elordi","Pedro Pascal","Ethan Hawke"
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
  "Jamie Lee Curtis","Sigourney Weaver","Alfre Woodard","Angela Bassett",
  // Nuove
  "Elliot Page","Emma Watson","Hailee Steinfeld","Sydney Sweeney","Anya Taylor-Joy"
];
const allActors = [...actorList, ...actressList];

// DATABASE FILM (120 titoli, cast espansi)
const movies = [
  // ── TOM HANKS ──
  {id:"m1",  title:"Forrest Gump",           year:1994,rarity:1,tmdbId:13,     cast:["Tom Hanks","Robin Wright","Gary Sinise","Robin Wright","Sally Field"]},
  {id:"m2",  title:"Catch Me If You Can",    year:2002,rarity:1,tmdbId:640,    cast:["Tom Hanks","Leonardo DiCaprio","Christopher Walken","Amy Adams","Martin Sheen"]},
  {id:"m3",  title:"The Post",               year:2017,rarity:2,tmdbId:400535, cast:["Tom Hanks","Meryl Streep","Bob Odenkirk","Alison Brie"]},
  {id:"m4",  title:"Cast Away",              year:2000,rarity:2,tmdbId:376,    cast:["Tom Hanks","Helen Hunt"]},
  {id:"m5",  title:"Philadelphia",           year:1993,rarity:3,tmdbId:11778,  cast:["Tom Hanks","Denzel Washington","Antonio Banderas","Jason Robards"]},
  {id:"m6",  title:"Elvis",                  year:2022,rarity:2,tmdbId:717728, cast:["Austin Butler","Tom Hanks","Olivia DeJonge","Luke Bracey"]},
  {id:"m7",  title:"The Green Mile",         year:1999,rarity:2,tmdbId:497,    cast:["Tom Hanks","Michael Clarke Duncan","James Cromwell","Gary Sinise","Sam Rockwell","Doug Hutchison"]},
  // ── LEONARDO DiCAPRIO ──
  {id:"m8",  title:"Titanic",                year:1997,rarity:1,tmdbId:597,    cast:["Leonardo DiCaprio","Kate Winslet","Billy Zane","Kathy Bates","Bill Paxton"]},
  {id:"m9",  title:"The Revenant",           year:2015,rarity:2,tmdbId:281957, cast:["Leonardo DiCaprio","Tom Hardy","Will Poulter","Domhnall Gleeson"]},
  {id:"m10", title:"Inception",              year:2010,rarity:1,tmdbId:27205,  cast:["Leonardo DiCaprio","Joseph Gordon-Levitt","Marion Cotillard","Tom Hardy","Elliot Page","Cillian Murphy","Michael Caine"]},
  {id:"m11", title:"Once Upon a Time in Hollywood",year:2019,rarity:1,tmdbId:466272,cast:["Leonardo DiCaprio","Brad Pitt","Margot Robbie","Al Pacino","Dakota Fanning"]},
  {id:"m12", title:"The Departed",           year:2006,rarity:2,tmdbId:1422,   cast:["Leonardo DiCaprio","Matt Damon","Mark Wahlberg","Jack Nicholson","Martin Sheen","Alec Baldwin"]},
  {id:"m13", title:"Django Unchained",       year:2012,rarity:1,tmdbId:68718,  cast:["Jamie Foxx","Christoph Waltz","Leonardo DiCaprio","Samuel L. Jackson","Kerry Washington","Jonah Hill"]},
  {id:"m14", title:"The Wolf of Wall Street",year:2013,rarity:1,tmdbId:106646, cast:["Leonardo DiCaprio","Jonah Hill","Margot Robbie","Matthew McConaughey","Jon Bernthal"]},
  {id:"m15", title:"Shutter Island",         year:2010,rarity:2,tmdbId:11324,  cast:["Leonardo DiCaprio","Mark Ruffalo","Ben Kingsley","Michelle Williams","Emily Mortimer"]},
  // ── BRAD PITT ──
  {id:"m16", title:"Sleepers",               year:1996,rarity:4,tmdbId:10484,  cast:["Brad Pitt","Kevin Bacon","Robert De Niro","Dustin Hoffman","Jason Patric"]},
  {id:"m17", title:"Fight Club",             year:1999,rarity:1,tmdbId:550,    cast:["Brad Pitt","Edward Norton","Helena Bonham Carter","Meat Loaf","Jared Leto"]},
  {id:"m18", title:"Se7en",                  year:1995,rarity:1,tmdbId:807,    cast:["Brad Pitt","Morgan Freeman","Gwyneth Paltrow","Kevin Spacey","R. Lee Ermey"]},
  {id:"m19", title:"Twelve Monkeys",         year:1995,rarity:3,tmdbId:63,     cast:["Brad Pitt","Bruce Willis","Madeleine Stowe","Christopher Plummer"]},
  {id:"m20", title:"Inglourious Basterds",   year:2009,rarity:1,tmdbId:16869,  cast:["Brad Pitt","Christoph Waltz","Mélanie Laurent","Michael Fassbender","Eli Roth","Diane Kruger"]},
  {id:"m21", title:"Ocean's Eleven",         year:2001,rarity:1,tmdbId:161,    cast:["George Clooney","Brad Pitt","Julia Roberts","Matt Damon","Andy Garcia","Casey Affleck","Bernie Mac","Elliott Gould"]},
  {id:"m22", title:"Moneyball",              year:2011,rarity:2,tmdbId:60308,  cast:["Brad Pitt","Jonah Hill","Philip Seymour Hoffman","Robin Wright"]},
  {id:"m23", title:"Fury",                   year:2014,rarity:2,tmdbId:228150, cast:["Brad Pitt","Shia LaBeouf","Logan Lerman","Jon Bernthal","Jason Isaacs"]},
  // ── KEVIN BACON / CONNETTORI ──
  {id:"m24", title:"JFK",                    year:1991,rarity:4,tmdbId:1813,   cast:["Gary Oldman","Kevin Bacon","Tommy Lee Jones","Kevin Costner","Sissy Spacek","Ed Harris","Jack Lemmon"]},
  {id:"m25", title:"A Few Good Men",         year:1992,rarity:2,tmdbId:10349,  cast:["Tom Cruise","Jack Nicholson","Demi Moore","Kevin Bacon","Kiefer Sutherland","Kevin Pollak"]},
  {id:"m26", title:"Mystic River",           year:2003,rarity:3,tmdbId:8065,   cast:["Sean Penn","Tim Robbins","Kevin Bacon","Laurence Fishburne","Marcia Gay Harden","Laura Linney"]},
  {id:"m27", title:"X-Men: First Class",     year:2011,rarity:2,tmdbId:49538,  cast:["James McAvoy","Michael Fassbender","Jennifer Lawrence","Kevin Bacon","Rose Byrne","January Jones"]},
  // ── GEORGE CLOONEY ──
  {id:"m28", title:"Gravity",                year:2013,rarity:1,tmdbId:177572, cast:["Sandra Bullock","George Clooney"]},
  {id:"m29", title:"Michael Clayton",        year:2007,rarity:3,tmdbId:3082,   cast:["George Clooney","Tom Wilkinson","Tilda Swinton","Sydney Pollack"]},
  // ── GARY OLDMAN ──
  {id:"m30", title:"Air Force One",          year:1997,rarity:3,tmdbId:9296,   cast:["Harrison Ford","Gary Oldman","Glenn Close","Dean Stockwell"]},
  {id:"m31", title:"The Laundromat",         year:2019,rarity:3,tmdbId:590706, cast:["Meryl Streep","Gary Oldman","Antonio Banderas","Sharon Stone"]},
  // ── NOLAN UNIVERSE ──
  {id:"m32", title:"The Dark Knight",        year:2008,rarity:1,tmdbId:155,    cast:["Christian Bale","Gary Oldman","Morgan Freeman","Michael Caine","Maggie Gyllenhaal","Aaron Eckhart"]},
  {id:"m33", title:"Batman Begins",          year:2005,rarity:2,tmdbId:272,    cast:["Christian Bale","Liam Neeson","Gary Oldman","Morgan Freeman","Cillian Murphy","Michael Caine","Rutger Hauer"]},
  {id:"m34", title:"The Dark Knight Rises",  year:2012,rarity:1,tmdbId:49026,  cast:["Christian Bale","Tom Hardy","Gary Oldman","Morgan Freeman","Anne Hathaway","Marion Cotillard","Joseph Gordon-Levitt","Michael Caine"]},
  {id:"m35", title:"Dunkirk",                year:2017,rarity:2,tmdbId:374720, cast:["Tom Hardy","Cillian Murphy","Mark Rylance","Barry Keoghan","Fionn Whitehead"]},
  {id:"m36", title:"Oppenheimer",            year:2023,rarity:1,tmdbId:872585, cast:["Cillian Murphy","Emily Blunt","Matt Damon","Robert Downey Jr.","Florence Pugh","Rami Malek","Josh Brolin","Gary Oldman","Kenneth Branagh"]},
  // ── NATALIE PORTMAN ──
  {id:"m37", title:"Closer",                 year:2004,rarity:2,tmdbId:9563,   cast:["Natalie Portman","Julia Roberts","Jude Law","Clive Owen"]},
  {id:"m38", title:"Black Swan",             year:2010,rarity:2,tmdbId:45612,  cast:["Natalie Portman","Mila Kunis","Vincent Cassel","Barbara Hershey","Winona Ryder"]},
  {id:"m39", title:"Heat",                   year:1995,rarity:2,tmdbId:9693,   cast:["Al Pacino","Robert De Niro","Val Kilmer","Ashley Judd","Natalie Portman","Amy Brenneman","Jon Voight"]},
  // ── MATT DAMON ──
  {id:"m40", title:"Good Will Hunting",      year:1997,rarity:1,tmdbId:489,    cast:["Matt Damon","Robin Williams","Ben Affleck","Minnie Driver","Stellan Skarsgård"]},
  {id:"m41", title:"The Martian",            year:2015,rarity:1,tmdbId:286217, cast:["Matt Damon","Jessica Chastain","Chiwetel Ejiofor","Kristen Wiig","Jeff Daniels","Michael Peña","Sean Bean","Kate Mara"]},
  {id:"m42", title:"Interstellar",           year:2014,rarity:1,tmdbId:157336, cast:["Matthew McConaughey","Anne Hathaway","Jessica Chastain","Matt Damon","Michael Caine","Casey Affleck","John Lithgow"]},
  // ── MARVEL ──
  {id:"m43", title:"The Avengers",           year:2012,rarity:1,tmdbId:24428,  cast:["Robert Downey Jr.","Chris Evans","Chris Hemsworth","Scarlett Johansson","Mark Ruffalo","Jeremy Renner","Samuel L. Jackson","Tom Hiddleston"]},
  {id:"m44", title:"Iron Man",               year:2008,rarity:1,tmdbId:1726,   cast:["Robert Downey Jr.","Gwyneth Paltrow","Jeff Bridges","Terrence Howard","Paul Bettany"]},
  {id:"m45", title:"Captain America: Civil War",year:2016,rarity:1,tmdbId:271110,cast:["Chris Evans","Robert Downey Jr.","Scarlett Johansson","Tom Holland","Jeremy Renner","Chadwick Boseman","Paul Rudd","Paul Bettany","Sebastian Stan"]},
  {id:"m46", title:"Thor: Ragnarok",         year:2017,rarity:1,tmdbId:284053, cast:["Chris Hemsworth","Tom Hiddleston","Cate Blanchett","Idris Elba","Mark Ruffalo","Jeff Goldblum","Tessa Thompson"]},
  {id:"m47", title:"Avengers: Infinity War", year:2018,rarity:1,tmdbId:299536, cast:["Robert Downey Jr.","Chris Hemsworth","Benedict Cumberbatch","Scarlett Johansson","Chris Pratt","Tom Holland","Chadwick Boseman","Josh Brolin","Idris Elba"]},
  {id:"m48", title:"Guardians of the Galaxy",year:2014,rarity:1,tmdbId:118340, cast:["Chris Pratt","Zoe Saldana","Dave Bautista","Vin Diesel","Bradley Cooper","Glenn Close"]},
  {id:"m49", title:"Black Panther",          year:2018,rarity:1,tmdbId:284054, cast:["Chadwick Boseman","Michael B. Jordan","Lupita Nyong'o","Danai Gurira","Forest Whitaker","Angela Bassett","Martin Freeman"]},
  {id:"m50", title:"Doctor Strange",         year:2016,rarity:1,tmdbId:284052, cast:["Benedict Cumberbatch","Rachel McAdams","Tilda Swinton","Chiwetel Ejiofor","Mads Mikkelsen"]},
  // ── DE NIRO / PACINO ──
  {id:"m51", title:"Goodfellas",             year:1990,rarity:1,tmdbId:769,    cast:["Robert De Niro","Ray Liotta","Joe Pesci","Lorraine Bracco","Paul Sorvino"]},
  {id:"m52", title:"The Godfather",          year:1972,rarity:1,tmdbId:238,    cast:["Marlon Brando","Al Pacino","James Caan","Robert Duvall","Diane Keaton","Robert De Niro"]},
  {id:"m53", title:"Scarface",               year:1983,rarity:1,tmdbId:111,    cast:["Al Pacino","Michelle Pfeiffer","Steven Bauer","Mary Elizabeth Mastrantonio","F. Murray Abraham"]},
  {id:"m54", title:"Joker",                  year:2019,rarity:1,tmdbId:475557, cast:["Joaquin Phoenix","Robert De Niro","Zazie Beetz","Frances Conroy","Brett Cullen"]},
  {id:"m55", title:"Silver Linings Playbook",year:2012,rarity:1,tmdbId:116745, cast:["Bradley Cooper","Jennifer Lawrence","Robert De Niro","Jacki Weaver","Chris Tucker"]},
  {id:"m56", title:"The Irishman",           year:2019,rarity:2,tmdbId:398978, cast:["Robert De Niro","Al Pacino","Joe Pesci","Harvey Keitel","Anna Paquin","Jesse Plemons"]},
  // ── MERYL STREEP ──
  {id:"m57", title:"The Devil Wears Prada",  year:2006,rarity:1,tmdbId:10674,  cast:["Meryl Streep","Anne Hathaway","Emily Blunt","Stanley Tucci","Adrian Grenier"]},
  {id:"m58", title:"Mamma Mia!",             year:2008,rarity:1,tmdbId:10020,  cast:["Meryl Streep","Pierce Brosnan","Colin Firth","Amanda Seyfried","Stellan Skarsgård"]},
  {id:"m59", title:"The Hours",              year:2002,rarity:3,tmdbId:12183,  cast:["Meryl Streep","Nicole Kidman","Julianne Moore","Ed Harris","Toni Collette","Claire Danes"]},
  {id:"m60", title:"The Deer Hunter",        year:1978,rarity:3,tmdbId:11778,  cast:["Robert De Niro","Meryl Streep","Christopher Walken","John Savage","John Cazale"]},
  {id:"m61", title:"Kramer vs. Kramer",      year:1979,rarity:3,tmdbId:9312,   cast:["Dustin Hoffman","Meryl Streep","Jane Alexander","Justin Henry"]},
  {id:"m62", title:"Little Women",           year:2019,rarity:2,tmdbId:331354, cast:["Saoirse Ronan","Florence Pugh","Meryl Streep","Emma Watson","Laura Dern","Timothée Chalamet","Eliza Scanlen"]},
  // ── JULIA ROBERTS ──
  {id:"m63", title:"Pretty Woman",           year:1990,rarity:1,tmdbId:11502,  cast:["Julia Roberts","Richard Gere","Hector Elizondo","Jason Alexander","Laura San Giacomo"]},
  {id:"m64", title:"Notting Hill",           year:1999,rarity:1,tmdbId:1655,   cast:["Julia Roberts","Hugh Grant","Rhys Ifans","Emma Chambers","Hugh Bonneville"]},
  {id:"m65", title:"Erin Brockovich",        year:2000,rarity:2,tmdbId:10590,  cast:["Julia Roberts","Albert Finney","Aaron Paul","Marg Helgenberger","Cherry Jones"]},
  // ── TOM CRUISE ──
  {id:"m66", title:"Jerry Maguire",          year:1996,rarity:2,tmdbId:336,    cast:["Tom Cruise","Renée Zellweger","Cuba Gooding Jr.","Kelly Preston","Jay Mohr"]},
  {id:"m67", title:"Eyes Wide Shut",         year:1999,rarity:3,tmdbId:1640,   cast:["Tom Cruise","Nicole Kidman","Sydney Pollack","Todd Field"]},
  {id:"m68", title:"Mission: Impossible - Fallout",year:2018,rarity:1,tmdbId:353081,cast:["Tom Cruise","Henry Cavill","Rebecca Ferguson","Ving Rhames","Angela Bassett","Vanessa Kirby"]},
  // ── NICOLE KIDMAN ──
  {id:"m69", title:"Moulin Rouge!",          year:2001,rarity:1,tmdbId:628,    cast:["Nicole Kidman","Ewan McGregor","Jim Broadbent","Richard Roxburgh"]},
  {id:"m70", title:"Big Little Lies (film)", year:2019,rarity:2,tmdbId:63247,  cast:["Nicole Kidman","Reese Witherspoon","Shailene Woodley","Laura Dern","Zoë Kravitz"]},
  // ── JENNIFER LAWRENCE ──
  {id:"m71", title:"The Hunger Games",       year:2012,rarity:1,tmdbId:70160,  cast:["Jennifer Lawrence","Josh Hutcherson","Liam Hemsworth","Woody Harrelson","Elizabeth Banks","Wes Bentley","Stanley Tucci"]},
  {id:"m72", title:"American Hustle",        year:2013,rarity:2,tmdbId:207398, cast:["Christian Bale","Amy Adams","Bradley Cooper","Jennifer Lawrence","Robert De Niro","Jeremy Renner"]},
  // ── KEANU / MATRIX ──
  {id:"m73", title:"The Matrix",             year:1999,rarity:1,tmdbId:603,    cast:["Keanu Reeves","Laurence Fishburne","Carrie-Anne Moss","Hugo Weaving","Joe Pantoliano"]},
  {id:"m74", title:"Speed",                  year:1994,rarity:2,tmdbId:1637,   cast:["Keanu Reeves","Sandra Bullock","Dennis Hopper","Jeff Daniels","Alan Ruck"]},
  {id:"m75", title:"John Wick",              year:2014,rarity:1,tmdbId:245891, cast:["Keanu Reeves","Ian McShane","Willem Dafoe","Adrianne Palicki","Dean Winters","Alfie Allen"]},
  // ── RUSSELL CROWE ──
  {id:"m76", title:"Gladiator",              year:2000,rarity:1,tmdbId:98,     cast:["Russell Crowe","Joaquin Phoenix","Oliver Reed","Richard Harris","Connie Nielsen","Derek Jacobi"]},
  {id:"m77", title:"A Beautiful Mind",       year:2001,rarity:2,tmdbId:453,    cast:["Russell Crowe","Jennifer Connelly","Ed Harris","Paul Bettany","Adam Goldberg"]},
  {id:"m78", title:"American Gangster",      year:2007,rarity:2,tmdbId:4982,   cast:["Denzel Washington","Russell Crowe","Chiwetel Ejiofor","Josh Brolin","Ted Levine","Cuba Gooding Jr."]},
  // ── DENZEL WASHINGTON ──
  {id:"m79", title:"Training Day",           year:2001,rarity:1,tmdbId:1630,   cast:["Denzel Washington","Ethan Hawke","Scott Glenn","Tom Berenger","Harris Yulin"]},
  {id:"m80", title:"Fences",                 year:2016,rarity:2,tmdbId:397654, cast:["Denzel Washington","Viola Davis","Stephen McKinley Henderson","Jovan Adepo","Russell Hornsby"]},
  {id:"m81", title:"Book of Eli",            year:2010,rarity:2,tmdbId:20439,  cast:["Denzel Washington","Mila Kunis","Gary Oldman","Ray Stevenson","Jennifer Beals"]},
  // ── CATE BLANCHETT ──
  {id:"m82", title:"The Lord of the Rings: The Fellowship",year:2001,rarity:1,tmdbId:120,cast:["Elijah Wood","Ian McKellen","Viggo Mortensen","Orlando Bloom","Sean Astin","Cate Blanchett","Ian Holm","Hugo Weaving"]},
  {id:"m83", title:"The Lord of the Rings: The Return of the King",year:2003,rarity:1,tmdbId:122,cast:["Elijah Wood","Ian McKellen","Viggo Mortensen","Orlando Bloom","Sean Astin","Cate Blanchett","Andy Serkis","Bernard Hill"]},
  {id:"m84", title:"Carol",                  year:2015,rarity:3,tmdbId:258480, cast:["Cate Blanchett","Rooney Mara","Kyle Chandler","Jake Lacy"]},
  {id:"m85", title:"Notes on a Scandal",     year:2006,rarity:3,tmdbId:4551,   cast:["Cate Blanchett","Judi Dench","Andrew Simpson","Bill Nighy"]},
  // ── EMMA STONE ──
  {id:"m86", title:"La La Land",             year:2016,rarity:1,tmdbId:313369, cast:["Ryan Gosling","Emma Stone","John Legend","Rosemarie DeWitt","Finn Wittrock"]},
  {id:"m87", title:"The Favourite",          year:2018,rarity:2,tmdbId:497582, cast:["Olivia Colman","Emma Stone","Rachel Weisz","Nicholas Hoult","Joe Alwyn"]},
  {id:"m88", title:"Birdman",                year:2014,rarity:2,tmdbId:194662, cast:["Michael Keaton","Edward Norton","Emma Stone","Naomi Watts","Zach Galifianakis","Andrea Riseborough"]},
  {id:"m89", title:"Poor Things",            year:2023,rarity:3,tmdbId:792307, cast:["Emma Stone","Mark Ruffalo","Willem Dafoe","Ramy Youssef","Christopher Abbott"]},
  {id:"m90", title:"Crazy, Stupid, Love",    year:2011,rarity:2,tmdbId:50014,  cast:["Ryan Gosling","Steve Carell","Emma Stone","Julianne Moore","Kevin Bacon","Marisa Tomei"]},
  // ── SCARLETT JOHANSSON ──
  {id:"m91", title:"Marriage Story",         year:2019,rarity:2,tmdbId:492188, cast:["Scarlett Johansson","Adam Driver","Laura Dern","Alan Alda","Ray Liotta"]},
  {id:"m92", title:"Lost in Translation",    year:2003,rarity:2,tmdbId:153,    cast:["Scarlett Johansson","Bill Murray","Giovanni Ribisi","Anna Faris"]},
  // ── JAKE GYLLENHAAL ──
  {id:"m93", title:"Zodiac",                 year:2007,rarity:2,tmdbId:1949,   cast:["Jake Gyllenhaal","Robert Downey Jr.","Mark Ruffalo","Anthony Edwards","Brian Cox","Chloe Sevigny"]},
  {id:"m94", title:"Brokeback Mountain",     year:2005,rarity:2,tmdbId:711,    cast:["Jake Gyllenhaal","Heath Ledger","Michelle Williams","Anne Hathaway","Randy Quaid"]},
  {id:"m95", title:"Prisoners",              year:2013,rarity:2,tmdbId:146021, cast:["Jake Gyllenhaal","Hugh Jackman","Paul Dano","Viola Davis","Terrence Howard","Melissa Leo","Maria Bello"]},
  // ── TOM HARDY (connettori) ──
  {id:"m96", title:"Venom",                  year:2018,rarity:1,tmdbId:335983, cast:["Tom Hardy","Michelle Williams","Riz Ahmed","Jenny Slate","Anne Weying"]},
  {id:"m97", title:"Legend",                 year:2015,rarity:3,tmdbId:307901, cast:["Tom Hardy","Emily Browning","Taron Egerton","Christopher Eccleston"]},
  // ── HUGH JACKMAN ──
  {id:"m98", title:"The Greatest Showman",   year:2017,rarity:1,tmdbId:383498, cast:["Hugh Jackman","Zac Efron","Michelle Williams","Zendaya","Rebecca Ferguson","Keala Settle"]},
  {id:"m99", title:"Logan",                  year:2017,rarity:1,tmdbId:263115, cast:["Hugh Jackman","Patrick Stewart","Dafne Keen","Boyd Holbrook","Richard E. Grant"]},
  // ── COLIN FIRTH ──
  {id:"m100",title:"The King's Speech",      year:2010,rarity:2,tmdbId:45269,  cast:["Colin Firth","Helena Bonham Carter","Geoffrey Rush","Guy Pearce","Derek Jacobi"]},
  {id:"m101",title:"Kingsman: The Secret Service",year:2014,rarity:1,tmdbId:207703,cast:["Taron Egerton","Colin Firth","Samuel L. Jackson","Michael Caine","Mark Strong","Sophie Cookson"]},
  {id:"m102",title:"Bridget Jones's Diary",  year:2001,rarity:1,tmdbId:16009,  cast:["Renée Zellweger","Colin Firth","Hugh Grant","Jim Broadbent","Gemma Jones"]},
  // ── CHADWICK BOSEMAN ──
  {id:"m103",title:"Ma Rainey's Black Bottom",year:2020,rarity:2,tmdbId:677179,cast:["Chadwick Boseman","Viola Davis","Glynn Turman","Colman Domingo"]},
  {id:"m104",title:"21 Bridges",             year:2019,rarity:2,tmdbId:605116, cast:["Chadwick Boseman","Sienna Miller","J.K. Simmons","Stephan James","Taylor Kitsch"]},
  // ── ADAM DRIVER ──
  {id:"m105",title:"Star Wars: The Force Awakens",year:2015,rarity:1,tmdbId:140607,cast:["John Boyega","Oscar Isaac","Adam Driver","Harrison Ford","Carrie Fisher","Lupita Nyong'o","Domhnall Gleeson"]},
  {id:"m106",title:"BlacKkKlansman",         year:2018,rarity:2,tmdbId:487291, cast:["Adam Driver","John David Washington","Laura Harring","Topher Grace","Corey Hawkins"]},
  // ── JAKE GYLLENHAAL extra ──
  {id:"m107",title:"Nightcrawler",           year:2014,rarity:2,tmdbId:242582, cast:["Jake Gyllenhaal","Rene Russo","Riz Ahmed","Bill Paxton","Michael Hyatt"]},
  // ── MATTHEW McCONAUGHEY ──
  {id:"m108",title:"Dallas Buyers Club",     year:2013,rarity:2,tmdbId:197340, cast:["Matthew McConaughey","Jared Leto","Jennifer Garner","Steve Zahn","Dallas Roberts"]},
  // ── RYAN GOSLING ──
  {id:"m109",title:"The Notebook",           year:2004,rarity:1,tmdbId:11036,  cast:["Ryan Gosling","Rachel McAdams","James Garner","Gena Rowlands","Joan Allen","Sam Shepard"]},
  {id:"m110",title:"Drive",                  year:2011,rarity:2,tmdbId:57158,  cast:["Ryan Gosling","Carey Mulligan","Bryan Cranston","Albert Brooks","Ron Perlman","Christina Hendricks"]},
  // ── DUNE / SCI-FI ──
  {id:"m111",title:"Dune",                   year:2021,rarity:1,tmdbId:438631, cast:["Timothée Chalamet","Zendaya","Rebecca Ferguson","Oscar Isaac","Josh Brolin","Javier Bardem","Jason Momoa","Charlotte Rampling","Dave Bautista","Stellan Skarsgård"]},
  {id:"m112",title:"Dune: Part Two",         year:2024,rarity:1,tmdbId:693134, cast:["Timothée Chalamet","Zendaya","Rebecca Ferguson","Austin Butler","Florence Pugh","Christopher Walken","Josh Brolin","Javier Bardem"]},
  // ── HORROR/THRILLER ──
  {id:"m113",title:"The Silence of the Lambs",year:1991,rarity:1,tmdbId:274,  cast:["Anthony Hopkins","Jodie Foster","Scott Glenn","Ted Levine","Anthony Heald"]},
  {id:"m114",title:"Misery",                 year:1990,rarity:3,tmdbId:2274,   cast:["Kathy Bates","James Caan","Lauren Bacall","Richard Farnsworth"]},
  // ── PERIODO FILMICO ESTESO ──
  {id:"m115",title:"Schindler's List",        year:1993,rarity:2,tmdbId:424,   cast:["Liam Neeson","Ben Kingsley","Ralph Fiennes","Caroline Goodall","Jonathan Sagall"]},
  {id:"m116",title:"Gladiator II",           year:2024,rarity:2,tmdbId:558449, cast:["Paul Mescal","Pedro Pascal","Denzel Washington","Connie Nielsen","Joseph Quinn"]},
  {id:"m117",title:"Mad Max: Fury Road",     year:2015,rarity:1,tmdbId:76341,  cast:["Tom Hardy","Charlize Theron","Nicholas Hoult","Hugh Keays-Byrne","Zoë Kravitz"]},
  {id:"m118",title:"Knives Out",             year:2019,rarity:1,tmdbId:546554, cast:["Daniel Craig","Chris Evans","Ana de Armas","Jamie Lee Curtis","Michael Shannon","Don Johnson","Toni Collette","Christopher Plummer"]},
  {id:"m119",title:"Spotlight",              year:2015,rarity:2,tmdbId:314365, cast:["Mark Ruffalo","Michael Keaton","Rachel McAdams","Stanley Tucci","Liev Schreiber","Brian d'Arcy James"]},
  {id:"m120",title:"Bohemian Rhapsody",      year:2018,rarity:1,tmdbId:424694, cast:["Rami Malek","Gwyneth Paltrow","Tom Hollander","Aidan Gillen"]},
  // ── THRILLER / OSCARS LATE ──
  {id:"m121",title:"Zero Dark Thirty",       year:2012,rarity:3,tmdbId:89751,  cast:["Jessica Chastain","Jason Clarke","Joel Edgerton","Jeremy Renner","Mark Strong","Kyle Chandler"]},
  {id:"m122",title:"The Hurt Locker",        year:2008,rarity:3,tmdbId:12162,  cast:["Jeremy Renner","Anthony Mackie","Brian Geraghty","Guy Pearce","Ralph Fiennes","Evangeline Lilly"]},
  {id:"m123",title:"Sicario",                year:2015,rarity:2,tmdbId:273481, cast:["Emily Blunt","Benicio del Toro","Josh Brolin","Jeremy Renner","Daniel Kaluuya"]},
  {id:"m124",title:"Arrival",                year:2016,rarity:2,tmdbId:329865, cast:["Amy Adams","Jeremy Renner","Forest Whitaker","Michael Stuhlbarg","Tzi Ma"]},
  {id:"m125",title:"The Fighter",            year:2010,rarity:2,tmdbId:45317,  cast:["Mark Wahlberg","Christian Bale","Amy Adams","Melissa Leo","Jack McGee"]},
  // ── MISC CONNETTORI ──
  {id:"m126",title:"One Flew Over the Cuckoo's Nest",year:1975,rarity:1,tmdbId:1366,cast:["Jack Nicholson","Louise Fletcher","Danny DeVito","Christopher Lloyd","Brad Dourif","Will Sampson"]},
  {id:"m127",title:"As Good as It Gets",     year:1997,rarity:2,tmdbId:786,    cast:["Jack Nicholson","Helen Hunt","Greg Kinnear","Cuba Gooding Jr.","Skeet Ulrich"]},
  {id:"m128",title:"The Talented Mr. Ripley",year:1999,rarity:3,tmdbId:2758,   cast:["Matt Damon","Gwyneth Paltrow","Jude Law","Cate Blanchett","Philip Seymour Hoffman","Cate Blanchett"]},
  {id:"m129",title:"Midsommar",              year:2019,rarity:3,tmdbId:530385, cast:["Florence Pugh","Jack Reynor","William Jackson Harper","Will Poulter"]},
  {id:"m130",title:"The Queen's Gambit",     year:2020,rarity:2,tmdbId:87739,  cast:["Anya Taylor-Joy","Bill Camp","Moses Ingram","Thomas Brodie-Sangster"]},
,
  // ── FILM AGGIUNTIVI PER ATTORI SENZA COPERTURA ──
  {id:"m131",title:"Pulp Fiction",            year:1994,rarity:1,tmdbId:680,    cast:["John Travolta","Samuel L. Jackson","Bruce Willis","Uma Thurman","Harvey Keitel","Tim Roth","Ving Rhames"]},
  {id:"m132",title:"Pirates of the Caribbean",year:2003,rarity:1,tmdbId:22,    cast:["Johnny Depp","Keira Knightley","Orlando Bloom","Geoffrey Rush","Jack Davenport"]},
  {id:"m133",title:"Eternal Sunshine of the Spotless Mind",year:2004,rarity:2,tmdbId:38,cast:["Jim Carrey","Kate Winslet","Mark Ruffalo","Kirsten Dunst","Elijah Wood","Tom Wilkinson"]},
  {id:"m134",title:"The Grand Budapest Hotel",year:2014,rarity:2,tmdbId:120467,cast:["Ralph Fiennes","Saoirse Ronan","Bill Murray","Edward Norton","Adrien Brody","Tilda Swinton","Jude Law","Jeff Goldblum","Owen Wilson"]},
  {id:"m135",title:"Men in Black",            year:1997,rarity:1,tmdbId:607,   cast:["Will Smith","Tommy Lee Jones","Vincent D'Onofrio","Rip Torn","Tony Shalhoub"]},
  {id:"m136",title:"Ali",                     year:2001,rarity:3,tmdbId:9348,  cast:["Will Smith","Jamie Foxx","Jon Voight","Mario Van Peebles","Ron Silver"]},
  {id:"m137",title:"Iron Man 3",              year:2013,rarity:1,tmdbId:68721, cast:["Robert Downey Jr.","Don Cheadle","Gwyneth Paltrow","Guy Pearce","Ben Kingsley"]},
  {id:"m138",title:"Captain Marvel",          year:2019,rarity:1,tmdbId:299537,cast:["Brie Larson","Samuel L. Jackson","Ben Mendelsohn","Jude Law","Lee Pace"]},
  {id:"m139",title:"Avengers: Endgame",       year:2019,rarity:1,tmdbId:299534,cast:["Robert Downey Jr.","Chris Evans","Scarlett Johansson","Chris Hemsworth","Mark Ruffalo","Don Cheadle","Josh Brolin","Brie Larson","Paul Rudd","Bradley Cooper"]},
  {id:"m140",title:"Everything Everywhere All at Once",year:2022,rarity:1,tmdbId:545611,cast:["Michelle Yeoh","Jamie Lee Curtis","Ke Huy Quan","Stephanie Hsu"]},
  {id:"m141",title:"Crazy Rich Asians",       year:2018,rarity:1,tmdbId:490132,cast:["Awkwafina","Michelle Yeoh","Ken Jeong","Gemma Chan"]},
  {id:"m142",title:"Atonement",               year:2007,rarity:2,tmdbId:4512,  cast:["Keira Knightley","James McAvoy","Saoirse Ronan","Benedict Cumberbatch","Brenda Blethyn"]},
  {id:"m143",title:"National Treasure",       year:2004,rarity:2,tmdbId:20504, cast:["Nicolas Cage","Jon Voight","Diane Kruger","Sean Bean","Harvey Keitel","Justin Bartha"]},
  {id:"m144",title:"Adaptation",              year:2002,rarity:3,tmdbId:9731,  cast:["Nicolas Cage","Meryl Streep","Tilda Swinton","Brian Cox","Chris Cooper"]},
  {id:"m145",title:"The Truman Show",         year:1998,rarity:1,tmdbId:37165, cast:["Jim Carrey","Ed Harris","Laura Linney","Noah Emmerich"]},
  {id:"m146",title:"Mr. & Mrs. Smith",        year:2005,rarity:1,tmdbId:1458,  cast:["Brad Pitt","Angelina Jolie","Vince Vaughn","Adam Brody","Kerry Washington"]},
  {id:"m147",title:"Girl, Interrupted",       year:1999,rarity:2,tmdbId:2675,  cast:["Angelina Jolie","Winona Ryder","Clea DuVall","Whoopi Goldberg","Vanessa Redgrave"]},
  {id:"m148",title:"Traffic",                 year:2000,rarity:3,tmdbId:491,   cast:["Benicio del Toro","Don Cheadle","Catherine Zeta-Jones","Topher Grace","Luis Guzman"]},
  {id:"m149",title:"Road to Perdition",       year:2002,rarity:3,tmdbId:1950,  cast:["Tom Hanks","Paul Newman","Daniel Craig","Jude Law"]},
  {id:"m150",title:"Mulholland Drive",        year:2001,rarity:3,tmdbId:1018,  cast:["Naomi Watts","Laura Harring","Justin Theroux"]},
  {id:"m151",title:"The Imitation Game",      year:2014,rarity:2,tmdbId:205596,cast:["Benedict Cumberbatch","Keira Knightley","Matthew Goode","Charles Dance","Mark Strong"]},
  {id:"m152",title:"Thelma & Louise",         year:1991,rarity:3,tmdbId:10590, cast:["Susan Sarandon","Geena Davis","Brad Pitt","Harvey Keitel","Michael Madsen"]},
  {id:"m153",title:"Deadpool & Wolverine",    year:2024,rarity:1,tmdbId:533535,cast:["Ryan Reynolds","Hugh Jackman","Emma Corrin","Jennifer Garner","Morena Baccarin"]},
  {id:"m154",title:"Hustle",                  year:2022,rarity:2,tmdbId:960259,cast:["Adam Sandler","Queen Latifah","Ben Foster","Kenny Smith","Idris Elba"]},
  {id:"m155",title:"Uncut Gems",              year:2019,rarity:2,tmdbId:473033,cast:["Adam Sandler","Julia Fox","Lakeith Stanfield"]},
  {id:"m156",title:"Crouching Tiger, Hidden Dragon",year:2000,rarity:1,tmdbId:146232,cast:["Michelle Yeoh","Zhang Ziyi","Chow Yun-fat","Chang Chen"]},
  {id:"m157",title:"Something's Gotta Give",  year:2003,rarity:2,tmdbId:10792, cast:["Jack Nicholson","Diane Keaton","Keanu Reeves","Frances McDormand","Amanda Peet"]},
  {id:"m158",title:"Gone Girl",               year:2014,rarity:1,tmdbId:209112,cast:["Ben Affleck","Rosamund Pike","Neil Patrick Harris","Tyler Perry","Carrie Coon"]},
  {id:"m159",title:"Gosford Park",            year:2001,rarity:3,tmdbId:12594, cast:["Helen Mirren","Maggie Smith","Kristin Scott Thomas","Clive Owen","Emily Watson","Ryan Phillippe","Charles Dance"]},
  {id:"m160",title:"Get Shorty",              year:1995,rarity:3,tmdbId:8967,  cast:["John Travolta","Gene Hackman","Rene Russo","Danny DeVito"]},
  {id:"m161",title:"The Jungle Book",         year:2016,rarity:1,tmdbId:278927,cast:["Bill Murray","Ben Kingsley","Idris Elba","Lupita Nyong'o","Scarlett Johansson","Christopher Walken"]},
  {id:"m162",title:"Hitch",                   year:2005,rarity:2,tmdbId:22580, cast:["Will Smith","Eva Mendes","Kevin James","Amber Valletta"]},
  {id:"m163",title:"Mask of Zorro",           year:1998,rarity:2,tmdbId:2300,  cast:["Antonio Banderas","Catherine Zeta-Jones","Anthony Hopkins","Salma Hayek"]},
  {id:"m164",title:"Enchanted",               year:2007,rarity:2,tmdbId:5765,  cast:["Amy Adams","Patrick Dempsey","James Marsden","Susan Sarandon","Idina Menzel"]},
  {id:"m165",title:"Charlie's Angels",        year:2000,rarity:2,tmdbId:640,   cast:["Cameron Diaz","Drew Barrymore","Lucy Liu","Bill Murray","Sam Rockwell"]},
  {id:"m166",title:"Maleficent",              year:2014,rarity:1,tmdbId:195,   cast:["Angelina Jolie","Elle Fanning","Sam Riley","Imelda Staunton"]},
  {id:"m167",title:"Tropic Thunder",          year:2008,rarity:2,tmdbId:6479,  cast:["Ben Stiller","Robert Downey Jr.","Jack Black","Tom Cruise","Matthew McConaughey","Tobey Maguire","Nick Nolte"]},
  {id:"m168",title:"No Country for Old Men",  year:2007,rarity:2,tmdbId:6977,  cast:["Javier Bardem","Josh Brolin","Tommy Lee Jones","Woody Harrelson","Kelly Macdonald"]},
  {id:"m169",title:"There Will Be Blood",     year:2007,rarity:2,tmdbId:2351,  cast:["Daniel Day-Lewis","Paul Dano","Kevin J. O'Connor","Dillon Freasier"]},
  {id:"m170",title:"X-Men Origins: Wolverine",year:2009,rarity:2,tmdbId:2080, cast:["Hugh Jackman","Liev Schreiber","Ryan Reynolds","Danny Huston","Dominic Monaghan"]},
  {id:"m171",title:"The Amazing Spider-Man",  year:2012,rarity:2,tmdbId:1930,  cast:["Andrew Garfield","Emma Stone","Rhys Ifans","Denis Leary","Martin Sheen"]},
  {id:"m172",title:"Morbius",                 year:2022,rarity:3,tmdbId:526896,cast:["Jared Leto","Matt Smith","Adria Arjona","Jared Harris","Tyrese Gibson"]},
  {id:"m173",title:"Saltburn",                year:2023,rarity:2,tmdbId:1060239,cast:["Barry Keoghan","Jacob Elordi","Rosamund Pike","Richard E. Grant","Carey Mulligan","Archie Madekwe"]},
  {id:"m174",title:"Lost Daughters",          year:2020,rarity:3,tmdbId:701987,cast:["Halle Berry","Penélope Cruz","Eva Longoria","Salma Hayek"]},
  {id:"m175",title:"Priscilla",               year:2023,rarity:3,tmdbId:861694,cast:["Jacob Elordi","Cailee Spaeny","Rodrigo Santoro"]},
  {id:"m176",title:"Rocketman",               year:2019,rarity:2,tmdbId:522938,cast:["Taron Egerton","Jamie Bell","Richard Madden","Bryce Dallas Howard","Stephen Graham"]},
  {id:"m177",title:"The Full Monty",          year:1997,rarity:3,tmdbId:1576,  cast:["Robert Carlyle","Mark Addy","William Snape","Steve Huison","Tom Wilkinson"]},
  {id:"m178",title:"Last Action Hero",        year:1993,rarity:3,tmdbId:11440, cast:["Arnold Schwarzenegger","Austin O'Brien","Sharon Stone","James Belushi"]},
  {id:"m179",title:"Bridesmaids",             year:2011,rarity:1,tmdbId:56853, cast:["Kristen Wiig","Maya Rudolph","Rose Byrne","Melissa McCarthy","Ellie Kemper","Chris O'Dowd","Jon Hamm"]},
  {id:"m180",title:"Barbie",                  year:2023,rarity:1,tmdbId:346698,cast:["Margot Robbie","Ryan Gosling","America Ferrera","Kate McKinnon","Issa Rae","Simu Liu","Ncuti Gatwa","Emma Mackey","Will Ferrell"]}
,
  // ── BATCH FINALE: copertura attori rimasti ──
  {id:"m181",title:"The Help",               year:2011,rarity:1,tmdbId:67438,  cast:["Viola Davis","Emma Stone","Octavia Spencer","Jessica Chastain","Bryce Dallas Howard","Allison Janney"]},
  {id:"m182",title:"Hidden Figures",         year:2016,rarity:1,tmdbId:381289, cast:["Taraji P. Henson","Octavia Spencer","Kevin Costner","Kirsten Dunst","Jim Parsons"]},
  {id:"m183",title:"Love Actually",          year:2003,rarity:1,tmdbId:508,    cast:["Hugh Grant","Emma Thompson","Liam Neeson","Colin Firth","Keira Knightley","Laura Linney","Bill Nighy","Alan Rickman"]},
  {id:"m184",title:"Bruce Almighty",         year:2003,rarity:1,tmdbId:771,    cast:["Jim Carrey","Jennifer Aniston","Morgan Freeman","Steve Carell","Philip Baker Hall"]},
  {id:"m185",title:"The Matrix Reloaded",    year:2003,rarity:2,tmdbId:604,    cast:["Keanu Reeves","Laurence Fishburne","Carrie-Anne Moss","Monica Bellucci","Jada Pinkett Smith","Hugo Weaving"]},
  {id:"m186",title:"Green Book",             year:2018,rarity:1,tmdbId:490132, cast:["Viggo Mortensen","Mahershala Ali","Linda Cardellini","Sebastian Maniscalco"]},
  {id:"m187",title:"Moonlight",              year:2016,rarity:2,tmdbId:376867, cast:["Mahershala Ali","Naomie Harris","Trevante Rhodes","Janelle Monáe","Andre Holland"]},
  {id:"m188",title:"Jumanji: Welcome to the Jungle",year:2017,rarity:1,tmdbId:333339,cast:["Dwayne Johnson","Kevin Hart","Karen Gillan","Jack Black","Nick Jonas"]},
  {id:"m189",title:"21 Jump Street",         year:2012,rarity:1,tmdbId:64688,  cast:["Channing Tatum","Jonah Hill","Ice Cube","Dave Franco","Rob Riggle"]},
  {id:"m190",title:"Magic Mike",             year:2012,rarity:2,tmdbId:88012,  cast:["Channing Tatum","Matthew McConaughey","Olivia Munn","Cody Horn","Alex Pettyfer","Matt Bomer"]},
  {id:"m191",title:"Signs",                  year:2002,rarity:2,tmdbId:2675,   cast:["Mel Gibson","Joaquin Phoenix","Abigail Breslin","Cherry Jones","Patricia Kalember"]},
  {id:"m192",title:"Braveheart",             year:1995,rarity:1,tmdbId:197,    cast:["Mel Gibson","Sophie Marceau","Patrick McGoohan","Brendan Gleeson","Angus Macfadyen"]},
  {id:"m193",title:"The English Patient",    year:1996,rarity:2,tmdbId:409,    cast:["Ralph Fiennes","Juliette Binoche","Kristin Scott Thomas","Willem Dafoe","Colin Firth","Naveen Andrews"]},
  {id:"m194",title:"Slumdog Millionaire",    year:2008,rarity:1,tmdbId:12405,  cast:["Dev Patel","Freida Pinto","Anil Kapoor","Irrfan Khan","Madhur Mittal"]},
  {id:"m195",title:"The Personal History of David Copperfield",year:2019,rarity:3,tmdbId:516260,cast:["Dev Patel","Hugh Laurie","Tilda Swinton","Ben Whishaw","Olivia Colman","Peter Capaldi"]},
  {id:"m196",title:"When Harry Met Sally",   year:1989,rarity:1,tmdbId:639,    cast:["Billy Crystal","Meg Ryan","Carrie Fisher","Bruno Kirby","Lisa Jane Persky"]},
  {id:"m197",title:"City Slickers",          year:1991,rarity:3,tmdbId:4425,   cast:["Billy Crystal","Jack Palance","Daniel Stern","Bruno Kirby","Helen Slater"]},
  {id:"m198",title:"Aliens",                 year:1986,rarity:1,tmdbId:679,    cast:["Sigourney Weaver","Michael Biehn","Paul Reiser","Lance Henriksen","Bill Paxton","Carrie Henn"]},
  {id:"m199",title:"Galaxy Quest",           year:1999,rarity:2,tmdbId:8769,   cast:["Tim Allen","Sigourney Weaver","Alan Rickman","Tony Shalhoub","Sam Rockwell"]},
  {id:"m200",title:"Mean Girls",             year:2004,rarity:1,tmdbId:10625,  cast:["Lindsay Lohan","Rachel McAdams","Tina Fey","Tim Meadows","Amy Poehler","Lacey Chabert"]},
  {id:"m201",title:"This Is the End",        year:2013,rarity:2,tmdbId:148641, cast:["Seth Rogen","James Franco","Jonah Hill","Jay Baruchel","Craig Robinson","Michael Cera","Emma Watson","Rihanna"]},
  {id:"m202",title:"The 40-Year-Old Virgin", year:2005,rarity:2,tmdbId:1894,   cast:["Steve Carell","Seth Rogen","Paul Rudd","Catherine Keener","Romany Malco"]},
  {id:"m203",title:"Jurassic World",         year:2015,rarity:1,tmdbId:135397, cast:["Chris Pratt","Bryce Dallas Howard","Vincent D'Onofrio","Ty Simpkins","Nick Robinson","Omar Sy","Jake Johnson"]},
  {id:"m204",title:"Walk the Line",          year:2005,rarity:2,tmdbId:5765,   cast:["Joaquin Phoenix","Reese Witherspoon","Ginnifer Goodwin","Robert Patrick","Dallas Roberts"]},
  {id:"m205",title:"Her",                    year:2013,rarity:2,tmdbId:152601, cast:["Joaquin Phoenix","Amy Adams","Rooney Mara","Olivia Wilde","Scarlett Johansson"]},
  {id:"m206",title:"Desperately Seeking Susan",year:1985,rarity:4,tmdbId:11502,cast:["Rosanna Arquette","Aidan Quinn","Mark Blum","Robert Joy","Laurie Metcalf"]},
  {id:"m207",title:"Secretariat",            year:2010,rarity:3,tmdbId:42149,  cast:["Diane Lane","John Malkovich","James Cromwell","Dylan Walsh","Margo Martindale"]},
  {id:"m208",title:"The Blind Side",         year:2009,rarity:2,tmdbId:26390,  cast:["Sandra Bullock","Tim McGraw","Quinton Aaron","Kathy Bates","Ray McKinnon"]},
  {id:"m209",title:"Pocahontas",             year:1995,rarity:2,tmdbId:10530,  cast:["Irene Bedard","Mel Gibson","Judy Kuhn","David Ogden Stiers","John Kassir"]},
  {id:"m210",title:"Don't Look Up",          year:2021,rarity:1,tmdbId:764685, cast:["Leonardo DiCaprio","Jennifer Lawrence","Meryl Streep","Cate Blanchett","Jonah Hill","Timothée Chalamet","Tyler Perry","Ron Perlman","Ariana Grande","Mark Rylance"]}
,
  // ── COPERTURA FINALE ──
  {id:"m211",title:"Beverley Hills Cop",     year:1984,rarity:1,tmdbId:90,     cast:["Eddie Murphy","Judge Reinhold","John Ashton","Lisa Eilbacher","Ronny Cox"]},
  {id:"m212",title:"Coming to America",      year:1988,rarity:1,tmdbId:9587,   cast:["Eddie Murphy","Arsenio Hall","James Earl Jones","John Amos","Eddie Murphy Jr."]},
  {id:"m213",title:"The Fast and the Furious",year:2001,rarity:1,tmdbId:9799,  cast:["Vin Diesel","Paul Walker","Michelle Rodriguez","Jordana Brewster","Jason Statham","Dwayne Johnson"]},
  {id:"m214",title:"The Menu",               year:2022,rarity:2,tmdbId:593643, cast:["Ralph Fiennes","Anya Taylor-Joy","Nicholas Hoult","Hong Chau","Janet McTeer","John Leguizamo"]},
  {id:"m215",title:"True Grit",              year:2010,rarity:2,tmdbId:45317,  cast:["Jeff Bridges","Matt Damon","Josh Brolin","Hailee Steinfeld","Barry Pepper","Josh Brolin"]},
  {id:"m216",title:"Widows",                 year:2018,rarity:2,tmdbId:445840, cast:["Viola Davis","Michelle Rodriguez","Elizabeth Debicki","Liam Neeson","Cynthia Erivo","Colin Farrell","Robert Duvall"]},
  {id:"m217",title:"The Northman",           year:2022,rarity:3,tmdbId:639933, cast:["Alexander Skarsgård","Nicole Kidman","Anya Taylor-Joy","Ethan Hawke","Willem Dafoe","Björk"]},
  {id:"m218",title:"Bad Moms",               year:2016,rarity:2,tmdbId:376591, cast:["Mila Kunis","Kathryn Hahn","Kristen Bell","Christina Applegate","Annie Mumolo","Jada Pinkett Smith"]},
  {id:"m219",title:"Argylle",                year:2024,rarity:2,tmdbId:1016360,cast:["Bryce Dallas Howard","Sam Rockwell","Henry Cavill","Ariana DeBose","Bryan Cranston","Samuel L. Jackson","Catherine O'Hara"]},
  {id:"m220",title:"9 to 5",                 year:1980,rarity:3,tmdbId:15379,  cast:["Jane Fonda","Lily Tomlin","Dolly Parton","Dabney Coleman","Sterling Hayden"]}
,
  {id:"m221",title:"True Romance",           year:1993,rarity:3,tmdbId:5765,   cast:["Christian Slater","Patricia Arquette","Brad Pitt","Gary Oldman","Samuel L. Jackson","Christopher Walken","Dennis Hopper","James Gandolfini"]},
  {id:"m222",title:"Scott Pilgrim vs. the World",year:2010,rarity:2,tmdbId:57201,cast:["Michael Cera","Mary Elizabeth Winstead","Chris Evans","Aubrey Plaza","Anna Kendrick","Brandon Routh","Alison Pill"]},
  {id:"m223",title:"12 Years a Slave",       year:2013,rarity:2,tmdbId:76203,  cast:["Chiwetel Ejiofor","Michael Fassbender","Benedict Cumberbatch","Brad Pitt","Paul Dano","Alfre Woodard","Paul Giamatti","Sarah Paulson"]},
  {id:"m224",title:"Elf",                    year:2003,rarity:1,tmdbId:109018, cast:["Will Ferrell","James Caan","Mary Steenburgen","Ed Asner","Zooey Deschanel","Mary Steenburgen"]}
];


const imgCache = {};
// Lista attrici per silhouette corretta
const ACTRESSES_LIST = ["Meryl Streep","Amy Adams","Robin Wright","Margot Robbie","Natalie Portman",
  "Julia Roberts","Cate Blanchett","Angelina Jolie","Jennifer Lawrence","Sandra Bullock",
  "Charlize Theron","Halle Berry","Viola Davis","Octavia Spencer","Jennifer Aniston",
  "Reese Witherspoon","Gwyneth Paltrow","Renée Zellweger","Helen Mirren","Judi Dench",
  "Emma Thompson","Kate Winslet","Rachel Weisz","Keira Knightley","Scarlett Johansson",
  "Mila Kunis","Emma Stone","Anne Hathaway","Kristen Wiig","Tina Fey","Penélope Cruz",
  "Salma Hayek","Cameron Diaz","Drew Barrymore","Nicole Kidman","Naomi Watts",
  "Michelle Pfeiffer","Sharon Stone","Demi Moore","Whoopi Goldberg","Sigourney Weaver",
  "Glenn Close","Jodie Foster","Susan Sarandon","Brie Larson","Saoirse Ronan",
  "Florence Pugh","Anya Taylor-Joy","Zendaya","Ana de Armas","Aubrey Plaza",
  "Rachel McAdams","Carey Mulligan","Rooney Mara","Michelle Williams","Julianne Moore",
  "Tilda Swinton","Frances McDormand","Laura Dern","Jessica Chastain","Emily Blunt",
  "Helena Bonham Carter","Winona Ryder","Mélanie Laurent","Amanda Seyfried","Marion Cotillard",
  "Uma Thurman","Patricia Arquette","Kathryn Hahn","Emma Stone","Lupita Nyong'o"];

function actorImg(name) {
  if (tmdbActorImgs[name]) return tmdbActorImgs[name];
  if (imgCache[name]) return imgCache[name];
  // Usa silhouette appropriata invece di placeholder casuale
  if (typeof SIL_WOMAN !== 'undefined' && ACTRESSES_LIST.includes(name)) return SIL_WOMAN;
  if (typeof SIL_MAN !== 'undefined') return SIL_MAN;
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
let path = [], secsLeft = 0, oscars = 0, state = "playing", tid = null;

// Step-based state
let _spStep = 0;
let _spCurrentFilm = null;
let _spConfirmed = 0;
const _spDots = 6; // massimo 6 collegamenti/gradi // intermediate path dots

const $ = id => document.getElementById(id);

// ===== PATH DOTS =====
function spInitPath() {
  const c = $('spPath');
  if (!c) return;
  c.innerHTML = '';
  const mkNode = (cls, txt) => {
    const d = document.createElement('div');
    d.className = 'sp-pnode ' + cls;
    if (txt) d.textContent = txt;
    return d;
  };
  const mkLine = () => { const l = document.createElement('div'); l.className = 'sp-pline'; return l; };
  c.appendChild(mkNode('pa', 'A'));
  for (let i = 0; i < _spDots; i++) {
    c.appendChild(mkLine());
    const dot = mkNode('pdot', '');
    dot.id = 'spDot' + i;
    c.appendChild(dot);
  }
  c.appendChild(mkLine());
  c.appendChild(mkNode('pb', 'B'));
}

function spMarkDot(index, ok) {
  const d = $('spDot' + index);
  if (!d) return;
  d.className = 'sp-pnode ' + (ok ? 'pok' : 'pno');
  d.textContent = ok ? '✓' : '✗';
}

// ===== ACTOR PHOTOS / HEADER =====
function spSetHeader() {
  const A = window.ASSETS || {};
  const lg = $('spLogo');
  if (lg) lg.src = A.logo || (typeof EXTRA !== 'undefined' ? EXTRA.logo : '') || '';

  const ml = $('spModeLabel');
  if (ml) {
    const labels = { timed:'⏱ Contro il Tempo', relaxed:'★ Start! ★', training:'🎓 Allenamento' };
    ml.textContent = labels[mode] || '★ Start! ★';
  }
  const si = $('spStartImg'), ti = $('spTargetImg');
  const sn = $('spStartName'), tn = $('spTargetName');
  if (si) si.src = actorImg(START);
  if (ti) ti.src = actorImg(TARGET);
  if (sn) sn.textContent = START;
  if (tn) tn.textContent = TARGET;
  // Icona target
  const tgi = $('spTargetIco');
  if (tgi && window.ICN_TARGET) tgi.src = window.ICN_TARGET;

  // Load TMDB photos for start/target
  if (TMDB_KEY) {
    loadActorImg(START).then(url => { if ($('spStartImg') && url) $('spStartImg').src = url; });
    loadActorImg(TARGET).then(url => { if ($('spTargetImg') && url) $('spTargetImg').src = url; });
  }
}

// ===== INIT =====
function initGame() {
  if (window._gameReady && !window._startMode) return;
  if (window._startMode) { mode = window._startMode; window._startMode = null; }
  const ch = challenges[curChallenge % challenges.length];
  spStartGame(ch.start, ch.target);
  if (TMDB_KEY) loadTMDBImages();
  window._gameReady = true;
}

function spStartGame(start, target) {
  START = start; TARGET = target; cur = start;
  path = [];
  const m = GAME_MODES[mode];
  oscars = m.startOscars;
  secsLeft = m.timed ? m.seconds : 9999;
  state = 'playing';
  _spStep = 0;
  _spCurrentFilm = null;
  _spConfirmed = 0;

  clearInterval(tid);
  if (m.timed) tid = setInterval(spTick, 1000);

  const steps = $('spSteps');
  if (steps) steps.innerHTML = '';

  spSetHeader();
  spInitPath();
  spAddFilmStep();
}

function spTick() {
  if (state !== 'playing') return;
  secsLeft--;
  if (secsLeft <= 0) {
    secsLeft = 0;
    clearInterval(tid);
    spEndGame(false, 'timeout');
  }
}

// ===== FILM STEP =====
function spAddFilmStep() {
  _spStep++;
  const n = _spStep;
  const movs = movies
    .filter(m => m.cast.includes(cur))
    .sort((a, b) => a.title.localeCompare(b.title, 'it'));

  const opts = movs.map(m =>
    `<option value="${esc(m.id)}">${esc(m.title)} (${m.year})</option>`
  ).join('');

  const card = document.createElement('div');
  card.className = 'sp-card';
  card.id = 'spCard' + n;
  card.innerHTML =
    '<div class="sp-card-icon">' +
    '<img src="' + (window.ICN_PELLICOLA||'') + '" class="sp-card-icon-img" alt="Film"/>' +
    '</div>' +
    '<div class="sp-card-body">' +
      '<div class="sp-card-title">' + n + ' — Scegli un film con <b>' + esc(cur) + '</b></div>' +
      '<select class="sp-sel" id="spFSel' + n + '" onchange="spOnFilmCh(' + n + ')">' +
        '<option value="">Seleziona un film...</option>' + opts +
      '</select>' +
      '<button class="sp-btn off" id="spFBtn' + n + '" disabled onclick="spOnContinua(' + n + ')">' +
        'CONTINUA &#8594;' +
      '</button>' +
    '</div>';

  $('spSteps').appendChild(card);
  spScrollBot();
}

function spOnFilmCh(n) {
  const sel = $('spFSel' + n), btn = $('spFBtn' + n);
  if (!sel || !btn) return;
  btn.disabled = !sel.value;
  btn.className = sel.value ? 'sp-btn grn' : 'sp-btn off';
}

function spOnContinua(n) {
  const sel = $('spFSel' + n);
  if (!sel || !sel.value) return;
  _spCurrentFilm = movies.find(m => m.id === sel.value);
  if (!_spCurrentFilm) return;
  sel.disabled = true;
  const btn = $('spFBtn' + n);
  if (btn) { btn.disabled = true; btn.className = 'sp-btn off'; }
  $('spCard' + n).classList.add('locked');
  spAddActorStep();
}

// ===== ACTOR STEP =====
function spAddActorStep() {
  _spStep++;
  const n = _spStep;
  const film = _spCurrentFilm;

  const opts = allActors
    .filter(a => a !== cur)
    .sort((a, b) => a.localeCompare(b, 'it'))
    .map(a => '<option value="' + esc(a) + '">' + esc(a) + '</option>')
    .join('');

  const card = document.createElement('div');
  card.className = 'sp-card';
  card.id = 'spCard' + n;
  card.innerHTML =
    '<div class="sp-card-icon">' +
    '<img src="' + (window.ICN_OSCAR_H||'') + '" class="sp-card-icon-img" alt="Attore"/>' +
    '</div>' +
    '<div class="sp-card-body">' +
      '<div class="sp-card-title">' + n + ' — Scegli un attore/attrice in</div>' +
      '<div class="sp-card-sub">' + esc(film.title) + '</div>' +
      '<select class="sp-sel" id="spASel' + n + '" onchange="spOnActorCh(' + n + ')">' +
        '<option value="">Seleziona un attore...</option>' + opts +
      '</select>' +
      '<button class="sp-btn off" id="spABtn' + n + '" disabled onclick="spOnConferma(' + n + ')">' +
        'CONFERMA &#8594;' +
      '</button>' +
    '</div>';

  $('spSteps').appendChild(card);
  spScrollBot();
}

function spOnActorCh(n) {
  const sel = $('spASel' + n), btn = $('spABtn' + n);
  if (!sel || !btn) return;
  btn.disabled = !sel.value;
  btn.className = sel.value ? 'sp-btn grn' : 'sp-btn off';
}

function spOnConferma(n) {
  const sel = $('spASel' + n);
  if (!sel || !sel.value) return;
  const actor = sel.value;
  const film = _spCurrentFilm;
  const ok = film.cast.includes(actor);

  sel.disabled = true;
  const btn = $('spABtn' + n);
  if (btn) { btn.disabled = true; btn.className = 'sp-btn off'; }
  $('spCard' + n).classList.add('locked');

  if (!ok) {
    oscars = Math.max(0, oscars - 1);
  }
  spAddFeedback(ok, actor, film, n);
}

// ===== FEEDBACK =====
function spAddFeedback(ok, actorName, film, stepN) {
  const fb = document.createElement('div');
  fb.className = 'sp-fb';
  fb.id = 'spFb' + stepN;

  const msg = ok
    ? '<strong>' + esc(actorName) + '</strong> ha recitato in <strong>' + esc(film.title) + '</strong>'
    : '<strong>' + esc(actorName) + '</strong> non ha recitato in <strong>' + esc(film.title) + '</strong>';

  const btnHtml = ok
    ? '<button class="sp-fb-btn grn" id="spFbBtn' + stepN + '" onclick="spOnContOk(\'' + esc(actorName).replace(/'/g,"\\'") + '\',' + stepN + ')">CONTINUA &#8594;</button>'
    : '<button class="sp-fb-btn red" id="spFbBtn' + stepN + '" onclick="spOnRiprova(' + stepN + ')">RIPROVA &#8594;</button>';

  fb.innerHTML =
    '<img class="sp-fb-photo" id="spFbP' + stepN + '" src="' + actorImg(actorName) + '" alt=""/>' +
    '<div class="sp-fb-body">' +
      '<div class="sp-fb-row">' +
        '<div class="sp-fb-ttl ' + (ok ? 'ok' : 'err') + '">' + (ok ? 'CORRETTO!' : 'SBAGLIATO!') + '</div>' +
        btnHtml +
      '</div>' +
      '<div class="sp-fb-msg">' + msg + '</div>' +
    '</div>';

  $('spSteps').appendChild(fb);

  if (ok) {
    spMarkDot(_spConfirmed, true);
    path.push({ from: cur, movie: film.title, year: film.year, rarity: film.rarity, next: actorName });
    _spConfirmed++;
  }

  // Try to load TMDB photo
  if (TMDB_KEY) {
    loadActorImg(actorName).then(url => {
      const img = $('spFbP' + stepN);
      if (img && url) img.src = url;
    });
  }

  spScrollBot();

  if (!ok && oscars <= 0) {
    setTimeout(() => spEndGame(false, 'oscars'), 700);
  }
}

function spOnContOk(actorName, stepN) {
  cur = actorName;
  const btn = $('spFbBtn' + stepN);
  if (btn) btn.style.display = 'none';
  $('spFb' + stepN).classList.add('locked');

  if (cur === TARGET) { setTimeout(() => spEndGame(true), 350); return; }
  if (path.length >= _spDots) { setTimeout(() => spEndGame(false, 'maxdeg'), 350); return; }
  spAddFilmStep();
}

function spOnRiprova(stepN) {
  const fb = $('spFb' + stepN);
  if (fb) fb.remove();
  // re-enable actor card
  const card = $('spCard' + stepN);
  const sel = $('spASel' + stepN);
  const btn = $('spABtn' + stepN);
  if (card) card.classList.remove('locked');
  if (sel) { sel.disabled = false; sel.value = ''; }
  if (btn) { btn.disabled = true; btn.className = 'sp-btn off'; }
  spScrollBot();
}

// ===== END GAME =====
function spEndGame(won, reason) {
  state = won ? 'won' : 'lost';
  clearInterval(tid);

  const sc = spCalcScore();
  const pc = calcPopcorn(won, sc);
  if (pc > 0) { totalPopcorn += pc; localStorage.setItem('sb_pc', String(totalPopcorn)); }

  const icons = { won:'🏆', timeout:'⏱', oscars:'🏅', maxdeg:'🎬' };
  const titles = { won:'Sfida Completata!', timeout:'Tempo Scaduto!', oscars:'Oscar Esauriti!', maxdeg:'Troppi Gradi!' };
  const key = won ? 'won' : (reason || 'oscars');
  const msgs = {
    won: 'Hai collegato <strong>' + esc(START) + '</strong> a <strong>' + esc(TARGET) + '</strong> in ' + path.length + ' grado/i!',
    timeout: 'Non hai completato il ponte in tempo.',
    oscars: 'Hai esaurito gli Oscar disponibili.',
    maxdeg: 'Hai superato i ' + _spDots + ' gradi senza raggiungere <strong>' + esc(TARGET) + '</strong>.'
  };

  // icona end: target per won, oscars per lose
  const endIco = won
    ? '<img src="' + (window.ICN_TARGET||'') + '" class="sp-end-ico" alt=""/>'
    : '<span class="sp-end-emoji">' + icons[key] + '</span>';

  const gradi = path.length;
  const oscarEarned = won ? (GAME_MODES[mode].oscarsStart || 4) - oscars : 0;
  const oscarStr  = oscarEarned > 0 ? '+' + oscarEarned : '';
  const pcStr     = pc > 0 ? '+' + pc : '';

  const endCard = document.createElement('div');
  endCard.className = 'sp-card sp-end-card';
  endCard.innerHTML =
    '<div class="sp-end-left">' + endIco + '</div>' +
    '<div class="sp-end-body">' +
      '<div class="sp-end-ttl' + (won ? '' : ' lose') + '">' + titles[key] + '</div>' +
      '<div class="sp-end-desc">' + msgs[key] + '</div>' +
      '<div class="sp-end-gradi">' + gradi + ' su ' + _spDots + ' gradi di separazione</div>' +
      '<div class="sp-end-btns">' +
        '<button class="sp-btn grn sp-end-riscatta" onclick="spRestart()">RISCATTA &#8594;</button>' +
        (oscarStr ? '<button class="sp-btn sp-end-oscar">' + oscarStr + ' &#127942;</button>' : '') +
        (pcStr    ? '<button class="sp-btn sp-end-pc">'   + pcStr    + ' &#127871;</button>' : '') +
      '</div>' +
      '<div class="sp-end-extra">' +
        '<button class="sp-btn sp-end-mini" onclick="spNextChallenge()">&#127922; Nuova sfida</button>' +
        '<button class="sp-btn sp-end-mini" onclick="goTo(\'home\')">&#127968; Home</button>' +
      '</div>' +
    '</div>';

  $('spSteps').appendChild(endCard);
  spScrollBot();
}

function spRestart() { spStartGame(START, TARGET); }

function spNextChallenge() {
  curChallenge = (curChallenge + 1) % challenges.length;
  const ch = challenges[curChallenge];
  spStartGame(ch.start, ch.target);
}

// ===== SCORE =====
function spCalcScore() {
  const m = GAME_MODES[mode];
  const rp = path.reduce((s, x) => s + (x.rarity || 1), 0) * 10;
  const sp2 = m.timed && m.speedDiv ? Math.floor(secsLeft / m.speedDiv) : 0;
  const dp = path.length > 0 ? Math.max(0, 60 - path.length * 8) : 0;
  const op = oscars * (m.oscarPts || 0);
  return Math.round((rp + sp2 + dp + op) * m.scoreMultiplier);
}

function calcPopcorn(won, score) {
  if (!won) return Math.floor(score / 30);
  return 50 + Math.floor(score / 10);
}

// ===== UTILS =====
function spScrollBot() {
  const s = $('spSteps');
  if (s) setTimeout(() => s.scrollTo({ top: s.scrollHeight, behavior: 'smooth' }), 60);
}

function esc(v) {
  return String(v).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
}

function levelOf(pts) {
  for (let i = PROGRESSION.length - 1; i >= 0; i--) if (pts >= PROGRESSION[i].pts) return i;
  return 0;
}

function renderProgression() {
  const chain = $('progChain'); if (!chain) return;
  const lv = levelOf(totalPopcorn);
  chain.innerHTML = '';
  PROGRESSION.forEach((p, i) => {
    if (i > 0) { const a = document.createElement('span'); a.className = 'prog-arrow'; a.textContent = '›'; chain.appendChild(a); }
    const d = document.createElement('div');
    d.className = 'prog-item' + (i <= lv ? ' on' : '') + (i === lv ? ' cur' : '');
    d.innerHTML = '<img src="' + ((window.ASSETS || {})[p.img] || '') + '" alt="' + p.label + '"/><span>' + p.label + '</span>';
    chain.appendChild(d);
  });
}

// injectAssets e runSplash legacy rimossi — gestiti da ui-effects.js
