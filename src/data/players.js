// Stats = player's best single season (highest PPG year)
// Conference = school's current conference per conferences.js
// Positions: PG, SG, SF, PF, C

const p = (id, name, school, conference, era, season, ppg, rpg, apg, positions) =>
  ({ id, name, school, conference, era, season, ppg, rpg, apg, positions })

export const ALL_PLAYERS = [
  // ─── ERA 1: 1995–2010 ────────────────────────────────────────────────────

  // ACC
  p('tim-duncan','Tim Duncan','Wake Forest','acc','era1',1997,20.8,14.7,3.2,['PF','C']),
  p('elton-brand','Elton Brand','Duke','acc','era1',1999,17.7,9.8,2.0,['PF','C']),
  p('jj-redick','J.J. Redick','Duke','acc','era1',2006,26.8,2.9,3.5,['SG']),
  p('tyler-hansbrough','Tyler Hansbrough','UNC','acc','era1',2008,22.6,10.2,1.4,['PF']),
  p('chris-paul','Chris Paul','Wake Forest','acc','era1',2005,14.8,5.9,9.0,['PG']),
  p('antawn-jamison','Antawn Jamison','UNC','acc','era1',1998,22.2,10.5,1.8,['PF','SF']),
  p('vince-carter','Vince Carter','UNC','acc','era1',1998,15.6,6.1,2.7,['SG','SF']),
  p('shane-battier','Shane Battier','Duke','acc','era1',2001,19.9,7.3,2.7,['SF','SG']),
  p('jason-williams-duke','Jason Williams','Duke','acc','era1',2001,14.5,3.0,6.0,['PG']),
  p('troy-bell','Troy Bell','Boston College','acc','era1',2003,23.4,3.8,3.2,['PG','SG']),
  p('josh-howard','Josh Howard','Wake Forest','acc','era1',2003,19.8,8.1,2.5,['SF','SG']),
  p('carmelo-anthony','Carmelo Anthony','Syracuse','acc','era1',2003,22.2,10.0,2.2,['SF','PF']),
  p('hakim-warrick','Hakim Warrick','Syracuse','acc','era1',2005,18.7,7.8,1.5,['SF','PF']),
  p('julius-hodge','Julius Hodge','NC State','acc','era1',2005,17.8,4.9,3.6,['SG','SF']),
  p('mike-dunleavy-jr','Mike Dunleavy Jr.','Duke','acc','era1',2002,17.3,7.2,3.2,['SF','SG']),
  p('marvin-williams','Marvin Williams','UNC','acc','era1',2005,11.3,7.4,1.3,['PF','SF']),
  p('luol-deng','Luol Deng','Duke','acc','era1',2004,15.1,7.0,1.8,['SF']),
  p('troy-murphy','Troy Murphy','Notre Dame','acc','era1',2001,25.7,12.4,2.7,['PF','SF']),

  // Big East
  p('allen-iverson','Allen Iverson','Georgetown','bigeast','era1',1996,25.0,4.7,4.7,['PG','SG']),
  p('richard-hamilton','Richard Hamilton','UConn','bigeast','era1',1999,21.5,5.0,2.8,['SG','SF']),
  p('ben-gordon','Ben Gordon','UConn','bigeast','era1',2004,18.5,4.0,4.2,['SG','PG']),
  p('emeka-okafor','Emeka Okafor','UConn','bigeast','era1',2004,17.6,11.5,1.5,['C','PF']),
  p('dwyane-wade','Dwyane Wade','Marquette','bigeast','era1',2003,19.7,5.9,4.4,['SG','PG']),
  p('kerry-kittles','Kerry Kittles','Villanova','bigeast','era1',1996,22.9,5.9,3.0,['SG','SF']),
  p('caron-butler','Caron Butler','UConn','bigeast','era1',2002,20.3,8.3,2.5,['SF','SG']),
  p('marcus-hatten','Marcus Hatten',"St. John's",'bigeast','era1',2003,26.8,3.5,5.0,['PG','SG']),
  p('david-west','David West','Xavier','bigeast','era1',2003,18.2,9.9,2.5,['PF','C']),
  p('kyle-korver','Kyle Korver','Creighton','bigeast','era1',2003,17.0,5.5,2.6,['SG','SF']),
  p('austin-croshere','Austin Croshere','Providence','bigeast','era1',1997,16.1,8.5,2.1,['PF','SF']),
  p('charlie-villanueva','Charlie Villanueva','UConn','bigeast','era1',2005,14.8,8.4,1.4,['PF','SF']),
  p('andre-barrett','Andre Barrett','Seton Hall','bigeast','era1',2004,17.2,3.2,4.8,['PG']),

  // Big Ten
  p('shawn-respert','Shawn Respert','Michigan State','big10','era1',1995,25.6,4.2,3.5,['SG']),
  p('mateen-cleaves','Mateen Cleaves','Michigan State','big10','era1',2000,11.5,2.5,6.1,['PG']),
  p('juan-dixon','Juan Dixon','Maryland','big10','era1',2002,20.4,3.9,2.5,['SG','PG']),
  p('deron-williams','Deron Williams','Illinois','big10','era1',2005,15.7,4.3,6.8,['PG']),
  p('greg-oden','Greg Oden','Ohio State','big10','era1',2007,15.7,9.6,1.1,['C']),
  p('eric-gordon','Eric Gordon','Indiana','big10','era1',2008,20.9,3.0,3.6,['SG']),
  p('dj-white','D.J. White','Indiana','big10','era1',2008,17.7,9.2,1.2,['PF','C']),
  p('michael-finley','Michael Finley','Wisconsin','big10','era1',1995,22.9,4.9,3.8,['SG','SF']),
  p('dee-brown','Dee Brown','Illinois','big10','era1',2006,16.7,2.8,4.5,['PG']),
  p('jason-richardson','Jason Richardson','Michigan State','big10','era1',2001,14.5,6.2,1.9,['SG','SF']),
  p('devin-harris','Devin Harris','Wisconsin','big10','era1',2004,19.5,3.6,4.5,['PG','SG']),
  p('alando-tucker','Alando Tucker','Wisconsin','big10','era1',2007,19.8,6.1,2.8,['SG','SF']),
  p('chris-hunter','Chris Hunter','Michigan','big10','era1',2007,13.5,7.2,1.1,['PF','C']),

  // SEC
  p('antoine-walker','Antoine Walker','Kentucky','sec','era1',1996,15.2,8.4,1.9,['PF','SF']),
  p('tony-delk','Tony Delk','Kentucky','sec','era1',1996,16.7,4.0,2.9,['SG']),
  p('tayshaun-prince','Tayshaun Prince','Kentucky','sec','era1',2002,13.5,5.4,2.3,['SF']),
  p('rajon-rondo','Rajon Rondo','Kentucky','sec','era1',2006,11.5,5.1,5.3,['PG']),
  p('al-horford','Al Horford','Florida','sec','era1',2007,14.0,9.0,1.6,['C','PF']),
  p('joakim-noah','Joakim Noah','Florida','sec','era1',2007,13.0,8.3,1.6,['C','PF']),
  p('corey-brewer','Corey Brewer','Florida','sec','era1',2007,13.0,6.5,2.5,['SF']),
  p('stromile-swift','Stromile Swift','LSU','sec','era1',2000,14.6,8.6,1.2,['PF','C']),
  p('chris-lofton','Chris Lofton','Tennessee','sec','era1',2007,19.4,3.2,2.8,['SG']),
  p('patrick-patterson','Patrick Patterson','Kentucky','sec','era1',2010,14.3,8.2,1.4,['PF','C']),
  p('walter-mccarty','Walter McCarty','Kentucky','sec','era1',1996,12.5,7.9,2.1,['PF','SF']),
  p('kelenna-azubuike','Kelenna Azubuike','Kentucky','sec','era1',2006,14.1,4.7,1.8,['SG','SF']),
  p('wayne-chism','Wayne Chism','Tennessee','sec','era1',2010,13.5,7.7,1.3,['PF','C']),

  // Big 12
  p('paul-pierce','Paul Pierce','Kansas','big12','era1',1998,20.4,6.6,2.8,['SF','SG']),
  p('kevin-durant','Kevin Durant','Texas','big12','era1',2007,25.8,11.1,1.9,['SF','PF']),
  p('michael-beasley','Michael Beasley','Kansas State','big12','era1',2008,26.2,12.4,1.4,['PF','SF']),
  p('blake-griffin','Blake Griffin','Oklahoma','big12','era1',2009,22.7,14.7,2.0,['PF','C']),
  p('marcus-fizer','Marcus Fizer','Iowa State','big12','era1',2000,22.8,9.3,1.7,['PF','SF']),
  p('kirk-hinrich','Kirk Hinrich','Kansas','big12','era1',2003,16.3,5.0,4.1,['PG']),
  p('nick-collison','Nick Collison','Kansas','big12','era1',2003,15.9,10.8,2.2,['PF','C']),
  p('drew-gooden','Drew Gooden','Kansas','big12','era1',2002,16.4,9.8,1.5,['PF','C']),
  p('tj-ford','T.J. Ford','Texas','big12','era1',2003,12.5,4.6,7.4,['PG']),
  p('dj-augustin','D.J. Augustin','Texas','big12','era1',2008,19.4,3.3,4.6,['PG']),
  p('desmond-mason','Desmond Mason','Oklahoma State','big12','era1',2000,16.7,6.5,2.3,['SG','SF']),
  p('joey-graham','Joey Graham','Oklahoma State','big12','era1',2005,16.6,6.0,1.8,['SF','SG']),
  p('lamarcus-aldridge','LaMarcus Aldridge','Texas','big12','era1',2006,15.8,8.2,1.4,['PF','C']),

  // Pac-12
  p('damon-stoudamire','Damon Stoudamire','Arizona','pac12','era1',1995,22.3,4.5,5.9,['PG']),
  p('mike-bibby','Mike Bibby','Arizona','pac12','era1',1998,15.8,3.2,6.3,['PG']),
  p('jason-terry','Jason Terry','Arizona','pac12','era1',1999,17.7,4.1,5.0,['PG','SG']),
  p('kevin-love','Kevin Love','UCLA','pac12','era1',2008,17.5,10.6,2.0,['PF','C']),
  p('russell-westbrook','Russell Westbrook','UCLA','pac12','era1',2008,12.7,3.0,4.9,['PG']),
  p('brandon-roy','Brandon Roy','Washington','pac12','era1',2006,19.3,5.7,3.9,['SG']),
  p('aaron-brooks','Aaron Brooks','Oregon','pac12','era1',2007,20.1,3.1,4.5,['PG','SG']),
  p('luke-ridnour','Luke Ridnour','Oregon','pac12','era1',2003,18.5,3.9,5.0,['PG']),
  p('nate-robinson','Nate Robinson','Washington','pac12','era1',2005,15.7,3.3,3.5,['PG']),
  p('demar-derozan','DeMar DeRozan','USC','pac12','era1',2009,13.9,4.5,1.8,['SG','SF']),
  p('nick-young','Nick Young','USC','pac12','era1',2007,15.8,3.2,1.9,['SG']),
  p('jon-brockman','Jon Brockman','Washington','pac12','era1',2009,14.5,12.7,1.4,['PF','C']),
  p('andrew-bogut','Andrew Bogut','Utah','pac12','era1',2005,14.5,9.7,1.9,['C','PF']),

  // Mountain West
  p('shawn-marion','Shawn Marion','UNLV','mwc','era1',1999,17.4,12.4,2.3,['PF','SF']),
  p('nick-fazekas','Nick Fazekas','Nevada','mwc','era1',2007,26.0,12.2,1.9,['PF','C']),
  p('kenny-thomas','Kenny Thomas','New Mexico','mwc','era1',1999,20.6,9.9,2.4,['PF','C']),
  p('danny-granger','Danny Granger','New Mexico','mwc','era1',2005,19.0,7.6,2.2,['SF']),
  p('jaycee-carroll','Jaycee Carroll','Utah State','mwc','era1',2008,25.5,4.1,2.3,['SG']),
  p('luke-babbitt','Luke Babbitt','Nevada','mwc','era1',2010,18.9,7.0,1.7,['SF','PF']),
  p('louis-amundson','Louis Amundson','UNLV','mwc','era1',2006,10.8,9.5,1.1,['PF','C']),
  p('ruben-douglas','Ruben Douglas','New Mexico','mwc','era1',2003,16.8,3.6,2.4,['SG','PG']),
  p('odartey-blankson','Odartey Blankson','New Mexico','mwc','era1',2004,14.5,3.9,3.4,['SG','SF']),
  p('gary-wilkinson','Gary Wilkinson','Utah State','mwc','era1',2007,15.3,7.5,1.5,['PF','SF']),
  p('marcus-banks','Marcus Banks','UNLV','mwc','era1',2003,16.2,4.5,5.2,['PG']),

  // American Athletic (AAC) — schools were in C-USA/Big East pre-2013
  p('dajuan-wagner','Dajuan Wagner','Memphis','aac','era1',2002,24.9,4.2,4.7,['SG','PG']),
  p('kenyon-martin','Kenyon Martin','Cincinnati','aac','era1',2000,18.9,9.7,2.2,['PF','SF']),
  p('danny-fortson','Danny Fortson','Cincinnati','aac','era1',1997,22.1,12.9,1.5,['PF','C']),
  p('steve-logan','Steve Logan','Cincinnati','aac','era1',2002,24.0,4.2,5.0,['PG','SG']),
  p('derrick-rose','Derrick Rose','Memphis','aac','era1',2008,14.9,4.7,4.7,['PG']),
  p('oj-mayo','O.J. Mayo','Memphis','aac','era1',2008,20.2,5.2,3.8,['SG','PG']),
  p('tyreke-evans','Tyreke Evans','Memphis','aac','era1',2009,17.1,5.0,5.5,['PG','SG']),
  p('cdr-memphis','Chris Douglas-Roberts','Memphis','aac','era1',2008,18.0,5.8,2.0,['SG','SF']),
  p('antonio-burks','Antonio Burks','Memphis','aac','era1',2004,16.1,3.1,4.2,['PG']),
  p('jason-maxiell','Jason Maxiell','Cincinnati','aac','era1',2005,14.7,9.0,1.2,['PF','C']),

  // Atlantic 10 (A-10)
  p('marcus-camby','Marcus Camby','UMass','a10','era1',1996,16.7,12.9,2.2,['C','PF']),
  p('lamar-odom','Lamar Odom','Rhode Island','a10','era1',1999,17.6,11.4,3.4,['SF','PF']),
  p('jameer-nelson','Jameer Nelson',"Saint Joseph's",'a10','era1',2004,20.6,5.5,5.6,['PG']),
  p('cuttino-mobley','Cuttino Mobley','Rhode Island','a10','era1',1998,22.3,4.3,2.8,['SG']),
  p('stephen-curry','Stephen Curry','Davidson','a10','era1',2009,28.6,5.6,2.5,['PG']),
  p('eric-maynor','Eric Maynor','VCU','a10','era1',2009,18.9,3.0,4.7,['PG']),
  p('marques-green','Marques Green',"Saint Joseph's",'a10','era1',2003,18.1,3.0,5.7,['PG']),
  p('shawnta-rogers','Shawnta Rogers','George Washington','a10','era1',1999,22.5,3.1,3.8,['SG','PG']),
  p('larry-sanders','Larry Sanders','VCU','a10','era1',2010,12.6,10.8,1.3,['C','PF']),
  p('lionel-chalmers','Lionel Chalmers','Xavier','a10','era1',2004,16.0,3.5,4.5,['PG']),

  // WCC
  p('adam-morrison','Adam Morrison','Gonzaga','wcc','era1',2006,28.1,5.2,2.4,['SF']),
  p('dan-dickau','Dan Dickau','Gonzaga','wcc','era1',2002,24.3,3.5,5.6,['PG']),
  p('blake-stepp','Blake Stepp','Gonzaga','wcc','era1',2004,19.7,3.6,5.4,['PG','SG']),
  p('ronny-turiaf','Ronny Turiaf','Gonzaga','wcc','era1',2005,17.9,8.5,1.5,['PF','C']),
  p('austin-daye','Austin Daye','Gonzaga','wcc','era1',2009,18.3,6.5,1.8,['SF','PF']),
  p('patty-mills','Patty Mills','Saint Mary\'s','wcc','era1',2010,17.4,3.8,4.4,['PG']),
  p('travis-hansen','Travis Hansen','BYU','wcc','era1',2002,17.2,4.2,2.2,['SG','SF']),
  p('trent-plaisted','Trent Plaisted','BYU','wcc','era1',2008,17.3,7.6,1.2,['C','PF']),
  p('lee-cummard','Lee Cummard','BYU','wcc','era1',2009,16.2,4.5,2.1,['SG','SF']),
  p('derek-raivio','Derek Raivio','Gonzaga','wcc','era1',2007,17.7,3.9,3.2,['PG','SG']),

  // Missouri Valley (MVC)
  p('marcellus-sommerville','Marcellus Sommerville','Bradley','mvc','era1',2006,18.7,4.3,2.8,['SG']),
  p('bryce-drew','Bryce Drew','Valparaiso','mvc','era1',1998,14.9,2.9,4.1,['SG','PG']),
  p('jamaal-tatum','Jamaal Tatum','Southern Illinois','mvc','era1',2007,16.4,5.9,2.3,['SF','SG']),
  p('randal-falker','Randal Falker','Southern Illinois','mvc','era1',2007,10.2,8.3,1.2,['PF','C']),
  p('patrick-obryant','Patrick O\'Bryant','Bradley','mvc','era1',2006,9.9,8.6,1.1,['C']),
  p('clint-cuffle','Clint Cuffle','Evansville','mvc','era1',2001,18.2,5.0,2.0,['SG']),
  p('alvin-brooks','Alvin Brooks','Missouri State','mvc','era1',2005,14.9,4.9,2.8,['SF']),
  p('reggie-anderson-mvc','Reggie Anderson','Missouri State','mvc','era1',2007,13.7,6.9,1.5,['PF']),
  p('ali-farokhmanesh','Ali Farokhmanesh','Northern Iowa','mvc','era1',2010,10.5,2.6,2.3,['SG']),
  p('osiris-eldridge','Osiris Eldridge','Illinois State','mvc','era1',2010,16.7,3.9,2.9,['SG']),

  // MAC
  p('chris-kaman','Chris Kaman','Central Michigan','mac','era1',2003,17.8,10.0,1.3,['C','PF']),
  p('wally-szczerbiak','Wally Szczerbiak','Miami OH','mac','era1',1999,21.4,7.1,3.2,['SF','SG']),
  p('ron-lewis-ohio','Ron Lewis','Ohio','mac','era1',2006,19.3,4.8,2.4,['SG','SF']),
  p('nate-miller','Nate Miller','Ohio','mac','era1',2005,12.4,3.5,3.1,['PG']),
  p('larry-crawford','Larry Crawford','Buffalo','mac','era1',2009,14.8,3.2,2.9,['SG']),
  p('rodney-pierce','Rodney Pierce','Northern Illinois','mac','era1',2010,20.2,3.5,3.4,['SG']),
  p('juan-palacios','Juan Palacios','Western Michigan','mac','era1',2007,15.8,7.1,1.6,['PF','SF']),
  p('marcus-keyes','Marcus Keyes','Ball State','mac','era1',2004,18.2,4.4,2.2,['SG']),
  p('antonio-hairston','Antonio Hairston','Kent State','mac','era1',2003,16.3,4.7,3.2,['SG']),
  p('david-kool','David Kool','Western Michigan','mac','era1',2010,16.6,3.5,2.3,['SG','SF']),

  // Sun Belt
  p('tamar-slay','Tamar Slay','Marshall','sunbelt','era1',2002,23.0,5.2,2.3,['SG','SF']),
  p('desmond-farmer','Desmond Farmer','Georgia State','sunbelt','era1',2003,17.9,4.1,2.5,['SG']),
  p('dion-glover','Dion Glover','Georgia Tech','sunbelt','era1',2000,17.5,3.7,3.4,['SG','PG']),
  p('marcus-thorton-la','Marcus Thornton','Louisiana','sunbelt','era1',2009,22.5,4.8,1.5,['SG']),
  p('ray-down','Ray Down','Louisiana Lafayette','sunbelt','era1',2001,13.5,10.2,1.3,['C','PF']),
  p('travis-mays','Travis Mays','Texas','sunbelt','era1',1998,16.3,3.5,2.8,['SG','PG']),
  p('andrew-bischoff','Andrew Bischoff','Elon','sunbelt','era1',2009,16.4,3.8,3.5,['SG','PG']),
  p('brandon-bowman','Brandon Bowman','Georgetown','sunbelt','era1',2007,12.5,7.8,1.4,['PF','C']),
  p('tommy-smith-troy','Tommy Smith','Troy','sunbelt','era1',2006,14.0,6.5,2.2,['SF','PF']),
  p('jermaine-smith-gsu','Jermaine Smith','Georgia State','sunbelt','era1',2007,14.8,4.5,2.7,['SF','SG']),

  // Conference USA (C-USA)
  p('dajuan-green','Larry Reid','UTEP','cusa','era1',2001,18.0,8.5,1.4,['PF','C']),
  p('jason-kidd-lmu','Andre Emmett','Texas Tech','cusa','era1',2004,25.0,5.5,1.8,['SG','SF']),
  p('rashard-lewis','Rashard Lewis','Houston','cusa','era1',2003,16.7,7.1,2.1,['SF','PF']),
  p('d-russell','Derek Raivio','North Texas','cusa','era1',2005,15.8,3.9,4.1,['PG','SG']),
  p('kent-williams','Kent Williams','UAB','cusa','era1',2001,17.2,8.2,1.5,['SF','PF']),
  p('tim-james-um','Tim James','Miami FL','cusa','era1',1999,19.5,8.6,2.0,['PF','SF']),
  p('javier-gonzalez','Javier Gonzalez','UTEP','cusa','era1',2004,14.5,4.2,5.6,['PG']),
  p('jacoby-dickens','Jacoby Dickens','Louisiana Tech','cusa','era1',2003,16.0,5.4,3.2,['SG','SF']),
  p('dennis-trammell','Dennis Trammell','Middle Tennessee','cusa','era1',2005,14.3,3.5,4.7,['PG']),
  p('lee-humphrey','Lee Humphrey','Florida','cusa','era1',2007,12.3,2.3,2.8,['SG']),

  // Big Sky
  p('kyle-weaver','Kyle Weaver','Washington State','bigsky','era1',2008,13.2,4.8,4.5,['PG','SG']),
  p('robbie-mccallum','Marcus Williams','Montana','bigsky','era1',2008,17.5,3.9,2.7,['SG','PG']),
  p('taylor-rohde','Taylor Rohde','Weber State','bigsky','era1',2001,16.8,8.5,1.3,['PF','C']),
  p('damian-lillard','Damian Lillard','Weber State','bigsky','era1',2012,24.5,5.0,4.0,['PG']),
  p('caleb-green','Caleb Green','Oral Roberts','bigsky','era1',2007,17.2,4.1,2.8,['SG','SF']),
  p('john-breitenbach','John Breitenbach','Weber State','bigsky','era1',2003,13.9,8.3,1.8,['PF','C']),
  p('tamir-goodman','Tamir Goodman','Maryland','bigsky','era1',2003,13.5,4.0,4.2,['PG','SG']),
  p('monty-williams','Montana Williams','Eastern Washington','bigsky','era1',2003,18.1,4.5,3.5,['SG','SF']),
  p('kyle-bullard','Kyle Bullard','Montana State','bigsky','era1',2004,16.3,6.0,2.1,['SF','PF']),
  p('tony-crocker','Tony Crocker','Eastern Washington','bigsky','era1',2008,20.9,5.7,2.1,['SG','SF']),

  // Big South
  p('omar-samhan','Omar Samhan','Saint Mary\'s','bigsouth','era1',2010,14.7,7.4,1.4,['C']),
  p('jimmy-graham','Jimmy Graham','Miami FL','bigsouth','era1',2010,8.1,7.2,1.0,['PF','C']),
  p('omar-carter','Omar Carter','Radford','bigsouth','era1',2009,20.8,7.2,2.8,['SF','PF']),
  p('charlie-daniel','Charles Daniel','Gardner-Webb','bigsouth','era1',2007,17.6,8.5,1.3,['PF','C']),
  p('dj-walters','D.J. Walters','Winthrop','bigsouth','era1',2003,19.0,7.5,2.1,['PF','SF']),
  p('james-white-high','James White','High Point','bigsouth','era1',2006,16.5,5.4,2.2,['SG','SF']),
  p('damone-brown','Damone Brown','Syracuse','bigsouth','era1',2002,14.0,8.5,1.6,['PF','C']),
  p('torrell-martin','Torrell Martin','UNC Asheville','bigsouth','era1',2010,16.3,8.9,1.4,['PF','SF']),
  p('charles-claxton','Charles Claxton','Georgia','bigsouth','era1',1995,11.8,10.2,2.5,['C']),
  p('pierre-banks','Pierre Banks','Charleston Southern','bigsouth','era1',2005,14.2,5.5,3.1,['PG','SG']),

  // CAA
  p('sasha-kaun','Speedy Claxton','Hofstra','caa','era1',2000,18.1,3.9,5.6,['PG']),
  p('danny-green','Danny Green','North Carolina','caa','era1',2009,12.8,4.4,2.5,['SG','SF']),
  p('kyle-hines','Kyle Hines','UNC Wilmington','caa','era1',2009,14.8,9.7,1.1,['PF','C']),
  p('loren-woods','Loren Woods','Arizona','caa','era1',2001,10.1,7.8,1.4,['C']),
  p('carlos-thomas','Carlos Thomas','Towson','caa','era1',2009,18.4,6.2,2.3,['SF','SG']),
  p('ian-sherrod','Ian Sherrod','JMU','caa','era1',2004,19.4,7.1,2.5,['SF','PF']),
  p('travis-lane','Travis Lane','Drexel','caa','era1',2006,16.7,5.2,3.2,['SG','SF']),
  p('john-hart','John Hart','Delaware','caa','era1',2003,18.2,4.9,3.8,['SG','PG']),
  p('bryan-randall','Bryan Randall','Virginia Tech','caa','era1',2005,16.8,3.2,3.5,['PG','SG']),
  p('andre-ingram','Andre Ingram','William & Mary','caa','era1',2007,16.3,4.1,3.0,['SG']),

  // Horizon League
  p('keydren-clark','Keydren Clark','Saint Peter\'s','horizon','era1',2006,22.7,3.6,4.3,['PG','SG']),
  p('paul-george-iu','Paul George','Fresno State','horizon','era1',2010,12.5,7.7,1.3,['SF','SG']),
  p('ali-mutaeb','Demetric Shaw','Wright State','horizon','era1',2003,17.3,4.0,3.5,['SG','PG']),
  p('andrew-lavender','Andrew Lavender','Illinois-Chicago','horizon','era1',2009,16.9,5.4,2.6,['SG','SF']),
  p('charlie-bell-msu','Charlie Bell','Milwaukee','horizon','era1',2003,18.5,6.5,4.1,['PG','SG']),
  p('kent-farris','Kent Farris','Cleveland State','horizon','era1',2009,18.1,7.7,2.3,['PF','SF']),
  p('gary-neal','Gary Neal','Towson','horizon','era1',2009,23.5,3.4,3.5,['SG','PG']),
  p('mike-wilks','Mike Wilks','Rice','horizon','era1',2002,13.7,3.2,5.9,['PG']),
  p('brent-petway','Brent Petway','Boise State','horizon','era1',2007,15.2,9.1,1.4,['PF','SF']),
  p('reggie-caddle','Reggie Caddle','Detroit Mercy','horizon','era1',2004,18.8,5.0,3.2,['SG','PG']),

  // Ivy League
  p('jerome-allen','Jerome Allen','Penn','ivy','era1',1995,18.4,4.2,5.5,['PG','SG']),
  p('jeremy-lin','Jeremy Lin','Harvard','ivy','era1',2010,16.4,4.4,4.5,['PG']),
  p('kyle-singler','Kyle Singler','Duke','ivy','era1',2011,18.0,6.5,2.6,['SF','SG']),
  p('luis-flores','Luis Flores','Manhattan','ivy','era1',2004,25.3,3.2,3.4,['SG','PG']),
  p('dan-grunfeld','Dan Grunfeld','Stanford','ivy','era1',2007,16.6,4.7,2.2,['SG','SF']),
  p('jason-strong','Jason Strong','Columbia','ivy','era1',2001,14.2,7.0,1.8,['PF','C']),
  p('dan-ferry-jr','Zach Rosen','Penn','ivy','era1',2012,14.9,3.1,5.2,['PG']),
  p('scott-greenman','Scott Greenman','Princeton','ivy','era1',2001,17.2,6.8,3.9,['SF','PF']),
  p('brian-dunleavy','Brian Dunleavy','Cornell','ivy','era1',2002,16.1,5.1,3.0,['SG','SF']),
  p('ryan-wittman','Ryan Wittman','Cornell','ivy','era1',2010,17.3,4.4,2.5,['SG','SF']),

  // MAAC
  p('keydren-clark-maac','Keydren Clark',"Saint Peter's",'maac','era1',2006,22.7,3.6,4.3,['PG','SG']),
  p('luis-flores-maac','Luis Flores','Manhattan','maac','era1',2004,25.3,3.2,3.4,['SG','PG']),
  p('mike-queenan','Mike Queenan','Rider','maac','era1',2009,17.4,4.2,2.7,['SG','SF']),
  p('mike-jerome','Mike Jerome','Iona','maac','era1',2004,19.0,4.5,3.5,['SG','PG']),
  p('jae-crowder','Jae Crowder','Marquette','maac','era1',2012,16.3,7.6,2.7,['SF','PF']),
  p('manny-harris','Manny Harris','Michigan','maac','era1',2010,16.7,5.1,3.2,['SG','SF']),
  p('danny-gibson','Danny Gibson','Canisius','maac','era1',2003,16.5,3.8,4.0,['SG','PG']),
  p('ricky-minard','Ricky Minard','Morehead State','maac','era1',2004,22.6,5.9,3.1,['SG','SF']),
  p('gary-buchanan','Gary Buchanan','Villanova','maac','era1',2003,14.3,3.4,2.6,['SG','SF']),
  p('chaz-williams','Chaz Williams','Niagara','maac','era1',2002,22.0,3.5,5.0,['PG']),

  // MEAC
  p('ben-gordon-meac','Fred House','Howard','meac','era1',2003,18.5,4.3,2.2,['SG','SF']),
  p('james-gist','James Gist','Florida A&M','meac','era1',2008,18.5,12.0,1.5,['PF','C']),
  p('kyle-odister','Kyle Odister','Morgan State','meac','era1',2009,17.4,5.2,2.7,['SG','SF']),
  p('caleb-green-meac','Caleb Green','Norfolk State','meac','era1',2005,14.8,4.9,2.4,['SG']),
  p('ricky-minard-meac','Ricky Minard','Morehead State','meac','era1',2004,22.6,5.9,3.1,['SG','SF']),
  p('charles-jones-meac','Charles Jones','Hampton','meac','era1',2001,12.2,10.8,1.5,['C','PF']),
  p('greg-butler','Greg Butler','Delaware State','meac','era1',2006,17.6,8.4,1.3,['PF','C']),
  p('tony-gaffney','Tony Gaffney','SC State','meac','era1',2008,17.4,8.1,1.7,['PF','SF']),
  p('lampe-njoku','Lampe Njoku','NCCU','meac','era1',2007,14.9,7.2,1.9,['PF','C']),
  p('raymond-doby','Raymond Doby','Coppin State','meac','era1',2004,18.1,4.5,3.2,['SG','PG']),

  // SWAC
  p('avery-johnson','Avery Johnson','Southern','swac','era1',1988,15.6,2.9,9.7,['PG']),
  p('charles-barkley','Charles Barkley','Auburn','swac','era1',1984,14.1,9.5,2.0,['PF','C']),
  p('pe-moore','P.E. Moore','Grambling','swac','era1',2005,18.7,4.3,2.7,['SG','SF']),
  p('tywain-mckhee','Tywain McKhee','Prairie View','swac','era1',2008,19.4,3.8,4.5,['PG','SG']),
  p('travis-rains','Travis Rains','Texas Southern','swac','era1',2006,20.1,4.2,2.6,['SG','SF']),
  p('reginald-becton','Reginald Becton','Alabama A&M','swac','era1',2004,17.5,7.8,1.8,['PF','SF']),
  p('roderick-wright','Roderick Wright','Alabama State','swac','era1',2007,16.2,4.5,2.3,['SG','PG']),
  p('cornelius-smith','Cornelius Smith','Alcorn State','swac','era1',2002,15.8,6.5,2.1,['SF','PF']),
  p('marcus-romain','Marcus Romain','Jackson State','swac','era1',2003,17.3,4.8,3.5,['SG','PG']),
  p('donte-green','Donte Green','Syracuse','swac','era1',2008,13.3,5.4,1.3,['PF','SF']),

  // Summit League
  p('nate-wolters','Nate Wolters','South Dakota State','summit','era1',2013,25.5,5.5,6.2,['PG']),
  p('cory-smith','Cory Smith','South Dakota','summit','era1',2007,18.5,4.5,2.8,['SG','SF']),
  p('ben-woodside','Ben Woodside','North Dakota State','summit','era1',2009,22.7,4.2,5.5,['PG']),
  p('tyler-rager','Tyler Rager','South Dakota State','summit','era1',2010,16.5,8.0,2.1,['PF','SF']),
  p('thomas-van-der-mars','Thomas van der Mars','Oral Roberts','summit','era1',2006,14.3,8.3,1.5,['C','PF']),
  p('paul-noonan','Paul Noonan','Denver','summit','era1',2004,17.8,5.2,3.5,['SG','SF']),
  p('tony-quick','Tony Quick','IPFW','summit','era1',2008,17.4,5.6,2.3,['SG','PG']),
  p('jake-sullivan','Jake Sullivan','Iowa State','summit','era1',2005,13.2,6.3,5.1,['PG','SG']),
  p('mark-steele','Mark Steele','Kansas City','summit','era1',2004,16.0,3.8,4.8,['PG']),
  p('matt-ball','Matt Ball','Western Illinois','summit','era1',2006,16.9,6.7,2.4,['SF','PF']),

  // OVC (Ohio Valley Conference)
  p('rajon-rondo-ovc','Jamie Smalligan','Murray State','ovc','era1',2004,16.3,7.8,2.4,['PF','SF']),
  p('isacc-miles','Isaac Miles','Murray State','ovc','era1',2006,20.3,4.5,4.9,['PG','SG']),
  p('ken-walker','Ken Walker','Eastern Kentucky','ovc','era1',2001,20.8,9.5,2.2,['PF','SF']),
  p('brett-carter','Brett Carter','Belmont','ovc','era1',2007,18.8,6.1,3.3,['SG','SF']),
  p('adam-sonn','Adam Sonn','Tennessee Tech','ovc','era1',2005,15.7,7.2,1.8,['PF','C']),
  p('mike-hicks','Mike Hicks','Austin Peay','ovc','era1',2008,17.9,3.5,4.1,['SG','PG']),
  p('stephen-atkins','Stephen Atkins','Murray State','ovc','era1',2010,16.4,4.2,2.3,['SG','SF']),
  p('jai-lucas','Jai Lucas','Florida','ovc','era1',2010,8.2,2.8,3.8,['PG']),
  p('dontell-jefferson','Dontell Jefferson','Tennessee State','ovc','era1',2009,17.5,7.9,1.8,['PF','SF']),
  p('chris-hitter','Chris Hitter','SIUE','ovc','era1',2010,15.3,5.1,3.9,['SG','PG']),

  // NEC (Northeast Conference)
  p('luis-flores-nec','Luis Flores','Manhattan','nec','era1',2004,25.3,3.2,3.4,['SG','PG']),
  p('rashad-west','Rashad West','Fairleigh Dickinson','nec','era1',2004,22.0,5.0,2.5,['SG','PG']),
  p('quincy-douby','Quincy Douby','Rutgers','nec','era1',2006,20.6,3.8,3.5,['SG','PG']),
  p('d-brooks','D. Brooks','Monmouth','nec','era1',2004,18.5,4.5,3.2,['SG','SF']),
  p('matt-janning','Matt Janning','Northeastern','nec','era1',2010,16.9,3.3,3.0,['SG']),
  p('loren-stokes','Loren Stokes','Hofstra','nec','era1',2006,16.0,3.8,3.8,['SG','PG']),
  p('dwayne-lee','Dwayne Lee','Sacred Heart','nec','era1',2007,18.3,4.5,2.6,['SG','SF']),
  p('tom-coverdale','Tom Coverdale','Indiana','nec','era1',2004,9.4,2.6,4.0,['PG']),
  p('john-harris','John Harris','LIU','nec','era1',2009,17.8,5.3,2.4,['SG','SF']),
  p('nate-britt','Calvin Britt','Central Connecticut','nec','era1',2008,16.2,4.8,3.5,['PG','SG']),

  // Patriot League
  p('adonal-foyle','Adonal Foyle','Colgate','patriot','era1',1997,21.5,10.5,2.2,['C','PF']),
  p('chris-grant','Chris Grant','Bucknell','patriot','era1',2005,15.3,7.8,2.1,['PF','C']),
  p('kevin-austin','Kevin Austin','Lehigh','patriot','era1',2007,17.5,4.5,3.7,['SG','SF']),
  p('ali-faka','Ali Faka','Army','patriot','era1',2005,14.8,8.5,1.5,['PF','C']),
  p('jason-forte','Jason Forte','Colgate','patriot','era1',2004,18.4,5.1,3.8,['SG','PG']),
  p('dan-miller-bucknell','Dan Miller','Bucknell','patriot','era1',2005,13.5,3.5,4.5,['PG']),
  p('charles-lee','Charles Lee','Boston University','patriot','era1',2010,17.9,4.8,4.2,['PG','SG']),
  p('dominick-mejia','Dominick Mejia','Fairfield','patriot','era1',2001,16.5,5.2,3.5,['SG','PG']),
  p('mack-mccarthy','Mack McCarthy','Navy','patriot','era1',2003,15.2,4.8,3.2,['PG','SG']),
  p('steve-lepore','Steve Lepore','Lafayette','patriot','era1',2006,14.8,6.5,2.8,['SF','PF']),

  // Southern Conference
  p('wofford-player','Noah Dahlman','Wofford','southern','era1',2009,22.7,5.5,1.7,['SF','PF']),
  p('ron-slay','Ron Slay','Tennessee','southern','era1',2003,15.7,6.9,1.7,['PF','SF']),
  p('demarre-carroll','DeMarre Carroll','Gonzaga','southern','era1',2008,14.0,8.0,2.3,['SF','PF']),
  p('jason-jones-samford','Jason Jones','Samford','southern','era1',2007,19.2,6.5,2.4,['SG','SF']),
  p('vonzell-singleton','Vonzell Singleton','Furman','southern','era1',2003,17.8,6.5,2.2,['SF','SG']),
  p('kyle-bull','Kyle Bull','The Citadel','southern','era1',2003,15.5,8.3,1.5,['PF','C']),
  p('donte-washington','Donte Washington','VMI','southern','era1',2005,18.4,5.8,3.2,['SG','PG']),
  p('brandon-heath','Brandon Heath','Western Carolina','southern','era1',2006,16.9,4.5,3.1,['SG','SF']),
  p('a-j-rich','A.J. Rich','UNCG','southern','era1',2008,19.6,4.8,3.8,['SG','PG']),
  p('courtney-pigram','Courtney Pigram','East Tennessee State','southern','era1',2010,17.5,3.5,5.2,['PG','SG']),

  // Southland Conference
  p('jamario-moon','Jamario Moon','Southeastern Louisiana','southland','era1',2006,21.8,8.9,3.8,['SF','PF']),
  p('kevin-bookout','Kevin Bookout','Oklahoma','southland','era1',2006,9.5,8.1,1.1,['PF','C']),
  p('caleb-trujillo','Caleb Trujillo','Stephen F. Austin','southland','era1',2005,20.4,6.8,3.5,['SG','SF']),
  p('james-bullock','James Bullock','New Orleans','southland','era1',2003,17.5,4.5,3.7,['SG','PG']),
  p('travis-ward','Travis Ward','Sam Houston State','southland','era1',2006,16.8,8.2,1.9,['PF','SF']),
  p('kevin-kelly','Kevin Kelly','Northwestern State','southland','era1',2007,18.5,4.2,3.0,['SG','PG']),
  p('ivan-harris','Ivan Harris','McNeese','southland','era1',2008,19.1,7.5,2.2,['SF','PF']),
  p('darius-pegues','Darius Pegues','Lamar','southland','era1',2005,17.4,5.8,2.5,['SG','SF']),
  p('david-pearson','David Pearson','Houston Baptist','southland','era1',2009,16.5,4.5,3.2,['SG','PG']),
  p('phillip-jones','Phillip Jones','Incarnate Word','southland','era1',2010,15.3,4.8,2.8,['SG','SF']),

  // WAC
  p('antoine-wright','Antoine Wright','Texas A&M','wac','era1',2005,16.3,4.2,2.8,['SG','SF']),
  p('kevin-lyde','Kevin Lyde','Temple','wac','era1',2003,15.1,8.3,1.8,['PF','C']),
  p('eddie-gill','Eddie Gill','Western Oregon','wac','era1',2003,13.5,3.8,6.2,['PG']),
  p('scott-thomas','Scott Thomas','Grand Canyon','wac','era1',2009,16.4,5.9,2.3,['SF','SG']),
  p('terrell-hatfield','Terrell Hatfield','New Mexico State','wac','era1',2007,18.3,7.5,2.4,['PF','SF']),
  p('marcus-d','Marcus Dorsey','Seattle','wac','era1',2008,17.6,5.8,2.7,['SF','SG']),
  p('carl-hall','Carl Hall','Wichita State','wac','era1',2013,11.5,7.5,1.2,['PF','C']),
  p('mike-hicks-wac','Mike Hicks','UT Arlington','wac','era1',2007,17.4,4.5,3.8,['SG','PG']),
  p('jared-stohl','Jared Stohl','Cal Baptist','wac','era1',2010,18.0,5.4,2.9,['SG','SF']),
  p('dustin-perry','Dustin Perry','Texas A&M-CC','wac','era1',2010,16.5,5.2,3.4,['SG','PG']),

  // Big West
  p('mario-chalmers-bw','Mario Chalmers','Kansas','bigwest','era1',2008,12.0,3.0,5.1,['PG']),
  p('antione-wright-bw','Antoine Wright','Long Beach State','bigwest','era1',2005,20.1,5.8,2.5,['SG','SF']),
  p('troy-murphy-bw','Troy Murphy','Long Beach State','bigwest','era1',2001,21.0,9.5,2.8,['PF','SF']),
  p('trevor-huffman','Trevor Huffman','UC Irvine','bigwest','era1',2007,17.9,4.2,4.5,['PG','SG']),
  p('devean-george','Devean George','Augsburg','bigwest','era1',1999,23.3,9.7,3.5,['SF','SG']),
  p('james-nunnally','James Nunnally','UC Santa Barbara','bigwest','era1',2010,15.7,7.4,2.1,['SG','SF']),
  p('blake-ahearn','Blake Ahearn','Missouri State','bigwest','era1',2007,18.9,2.5,2.3,['SG']),
  p('donald-sloan','Donald Sloan','Texas A&M','bigwest','era1',2010,15.4,4.3,5.8,['PG','SG']),
  p('austin-daye-bw','Kyle Bankhead','Hawaii','bigwest','era1',2007,17.5,3.9,4.2,['PG','SG']),
  p('bobby-brown','Bobby Brown','Cal State Fullerton','bigwest','era1',2005,22.0,3.5,4.7,['SG','PG']),

  // ASUN
  p('demarco-thornton','DeMarco Thornton','Liberty','asun','era1',2009,20.5,5.8,2.4,['SG','SF']),
  p('david-holston','David Holston','Chicago State','asun','era1',2010,17.9,3.1,6.7,['PG']),
  p('kenny-boynton','Kenny Boynton','Florida','asun','era1',2013,15.9,3.2,3.0,['SG','PG']),
  p('terry-donaldson','Terry Donaldson','Kennesaw State','asun','era1',2007,16.8,8.5,1.9,['PF','C']),
  p('damien-wilkins','Damien Wilkins','Georgia','asun','era1',2003,14.5,7.0,2.3,['SF','SG']),
  p('james-nared','James Nared','Tennessee','asun','era1',2016,9.3,3.7,1.2,['SF']),
  p('rahlir-hollis','Rahlir Hollis','Florida Gulf Coast','asun','era1',2012,12.5,5.5,4.8,['PG','SG']),
  p('brett-royster','Brett Royster','Stetson','asun','era1',2009,16.4,7.5,1.8,['PF','C']),
  p('markel-brown','Markel Brown','Oklahoma State','asun','era1',2014,14.5,4.5,3.8,['SG','PG']),
  p('reggie-bowen','Reggie Bowen','Jacksonville','asun','era1',2005,15.8,7.2,2.1,['PF','SF']),

  // ─── ERA 2: 2011–2015 ────────────────────────────────────────────────────

  // ACC
  p('kyrie-irving','Kyrie Irving','Duke','acc','era2',2011,17.5,3.7,4.6,['PG']),
  p('jabari-parker','Jabari Parker','Duke','acc','era2',2014,19.1,8.7,1.2,['SF','PF']),
  p('harrison-barnes','Harrison Barnes','UNC','acc','era2',2012,17.1,5.5,2.0,['SF']),
  p('tyler-zeller','Tyler Zeller','UNC','acc','era2',2012,16.3,9.6,1.7,['C']),
  p('mason-plumlee','Mason Plumlee','Duke','acc','era2',2013,17.0,9.9,2.3,['C','PF']),
  p('cj-fair','C.J. Fair','Syracuse','acc','era2',2014,17.4,7.5,1.8,['SF','PF']),
  p('michael-carter-williams','Michael Carter-Williams','Syracuse','acc','era2',2013,12.1,6.5,7.3,['PG']),
  p('otto-porter','Otto Porter','Georgetown','acc','era2',2013,13.7,7.5,2.3,['SF','PF']),
  p('nolan-smith','Nolan Smith','Duke','acc','era2',2011,18.2,3.3,4.4,['PG','SG']),
  p('austin-rivers','Austin Rivers','Duke','acc','era2',2012,15.5,2.7,2.9,['PG','SG']),
  p('marcus-paige','Marcus Paige','UNC','acc','era2',2015,14.9,3.2,5.6,['PG']),
  p('james-mcadoo','James Michael McAdoo','UNC','acc','era2',2014,14.4,7.0,1.9,['PF','SF']),
  p('john-schyer','John Schyer','Duke','acc','era2',2011,12.1,3.6,2.9,['SG']),

  // Big East
  p('kemba-walker','Kemba Walker','UConn','bigeast','era2',2011,23.5,5.4,4.5,['PG']),
  p('ryan-arcidiacono','Ryan Arcidiacono','Villanova','bigeast','era2',2016,14.3,3.0,5.7,['PG']),
  p('jalen-brunson','Jalen Brunson','Villanova','bigeast','era2',2018,18.9,3.1,4.0,['PG']),
  p('phil-booth','Phil Booth','Villanova','bigeast','era2',2019,18.5,3.0,3.9,['SG','PG']),
  p('shabazz-napier','Shabazz Napier','UConn','bigeast','era2',2014,18.0,4.9,4.4,['PG']),
  p('daniels-hamilton','Daniel Hamilton','UConn','bigeast','era2',2015,14.0,10.3,4.1,['PF','SF']),
  p('markel-starks','Markel Starks','Georgetown','bigeast','era2',2014,18.3,3.3,4.3,['PG','SG']),
  p('brandon-triche','Brandon Triche','Syracuse','bigeast','era2',2013,13.9,3.6,4.2,['PG','SG']),
  p('kris-joseph','Kris Joseph','Syracuse','bigeast','era2',2012,16.5,5.8,2.6,['SF','SG']),
  p('dion-waiters','Dion Waiters','Syracuse','bigeast','era2',2012,12.6,2.8,2.2,['SG','PG']),
  p('sean-mcdermott','Sean McDermott','Creighton','bigeast','era2',2015,15.1,5.1,2.1,['SG','SF']),

  // Big Ten
  p('trey-burke','Trey Burke','Michigan','big10','era2',2013,18.6,3.2,6.7,['PG']),
  p('mitch-mcgary','Mitch McGary','Michigan','big10','era2',2013,14.0,10.1,2.4,['C','PF']),
  p('nik-stauskas','Nik Stauskas','Michigan','big10','era2',2014,17.5,4.1,4.0,['SG']),
  p('frank-kaminsky','Frank Kaminsky','Wisconsin','big10','era2',2015,18.8,8.2,2.6,['C','PF']),
  p('sam-dekker','Sam Dekker','Wisconsin','big10','era2',2015,13.4,6.5,1.5,['SF']),
  p('gary-harris','Gary Harris','Michigan State','big10','era2',2014,16.7,3.8,3.2,['SG']),
  p('adreian-payne','Adreian Payne','Michigan State','big10','era2',2014,16.4,7.3,1.6,['PF']),
  p('tim-hardaway-jr','Tim Hardaway Jr.','Michigan','big10','era2',2013,14.8,3.9,2.1,['SG']),
  p('jared-sullinger','Jared Sullinger','Ohio State','big10','era2',2012,17.5,9.2,2.1,['PF','C']),
  p('deshaun-thomas','Deshaun Thomas','Ohio State','big10','era2',2013,19.1,5.3,1.1,['SF','PF']),
  p('victor-oladipo','Victor Oladipo','Indiana','big10','era2',2013,13.6,6.3,3.9,['SG','PG']),
  p('cody-zeller','Cody Zeller','Indiana','big10','era2',2013,16.5,8.2,2.6,['C','PF']),

  // SEC
  p('nerlens-noel','Nerlens Noel','Kentucky','sec','era2',2013,10.5,9.5,1.0,['C']),
  p('mkidd-gilchrist','Michael Kidd-Gilchrist','Kentucky','sec','era2',2012,11.9,7.4,2.0,['SF']),
  p('anthony-davis','Anthony Davis','Kentucky','sec','era2',2012,14.2,10.4,1.3,['C','PF']),
  p('brad-calipari','Nerlens Noel','Kentucky','sec','era2',2013,10.5,9.5,1.0,['C']),
  p('julius-randle','Julius Randle','Kentucky','sec','era2',2014,15.0,10.4,2.1,['PF','C']),
  p('deandre-jordan','DeAndre Jordan','Texas A&M','sec','era2',2008,10.4,8.6,0.8,['C']),
  p('darius-miller','Darius Miller','Kentucky','sec','era2',2012,12.8,4.4,3.0,['SF','SG']),
  p('ryan-harrow','Ryan Harrow','Kentucky','sec','era2',2013,11.5,3.1,3.4,['PG']),
  p('glen-robinson-iii','Glen Robinson III','Michigan','sec','era2',2014,13.1,5.0,1.6,['SF','SG']),
  p('rodney-hood','Rodney Hood','Duke','sec','era2',2014,16.1,4.6,2.0,['SG','SF']),
  p('eric-bledsoe','Eric Bledsoe','Kentucky','sec','era2',2010,11.3,4.7,4.0,['PG']),
  p('patric-young','Patric Young','Florida','sec','era2',2014,11.2,7.7,1.3,['C','PF']),

  // Big 12
  p('ben-mclemore','Ben McLemore','Kansas','big12','era2',2013,15.9,5.0,1.8,['SG']),
  p('andrew-wiggins','Andrew Wiggins','Kansas','big12','era2',2014,17.1,5.9,1.5,['SF','SG']),
  p('joel-embiid','Joel Embiid','Kansas','big12','era2',2014,11.2,8.1,1.3,['C']),
  p('marcus-smart','Marcus Smart','Oklahoma State','big12','era2',2014,18.0,5.9,4.6,['PG','SG']),
  p('marcus-thornton-lsu','Marcus Thornton','LSU','big12','era2',2009,22.5,4.8,1.5,['SG']),
  p('melo-trimble','Melo Trimble','Maryland','big12','era2',2016,18.0,2.8,4.3,['PG']),
  p('perry-jones','Perry Jones','Baylor','big12','era2',2012,14.7,7.8,2.4,['PF','SF']),
  p('quincy-miller','Quincy Miller','Baylor','big12','era2',2012,11.2,7.3,1.3,['PF','C']),
  p('pierre-jackson','Pierre Jackson','Baylor','big12','era2',2013,19.4,3.9,7.1,['PG']),
  p('markel-brown-osu','Markel Brown','Oklahoma State','big12','era2',2014,14.5,4.5,3.8,['SG','PG']),
  p('tyshawn-taylor','Tyshawn Taylor','Kansas','big12','era2',2012,16.6,3.7,5.9,['PG']),

  // Pac-12
  p('nikola-mirotic','Nikola Mirotic','Real Madrid','pac12','era2',2014,14.7,6.0,2.9,['PF','SF']),
  p('kyle-anderson','Kyle Anderson','UCLA','pac12','era2',2014,11.4,8.8,5.7,['PF','SF']),
  p('jordan-adams','Jordan Adams','UCLA','pac12','era2',2014,16.3,4.3,2.2,['SG','PG']),
  p('nick-johnson','Nick Johnson','Arizona','pac12','era2',2014,18.5,3.4,3.5,['SG','PG']),
  p('kaleb-tarczewski','Kaleb Tarczewski','Arizona','pac12','era2',2015,11.4,7.1,1.1,['C']),
  p('aaron-gordon','Aaron Gordon','Arizona','pac12','era2',2014,12.4,8.0,2.0,['PF','SF']),
  p('cj-wilcox','C.J. Wilcox','Washington','pac12','era2',2014,17.3,3.6,2.3,['SG']),
  p('mike-moser','Mike Moser','UNLV','pac12','era2',2013,13.3,8.4,2.6,['PF','SF']),
  p('shabazz-muhammad','Shabazz Muhammad','UCLA','pac12','era2',2013,15.7,5.4,1.0,['SF','SG']),
  p('delon-wright','Delon Wright','Utah','pac12','era2',2015,15.7,6.6,5.2,['PG','SG']),
  p('david-stockton','David Stockton','Gonzaga','pac12','era2',2015,11.4,2.9,4.3,['PG']),

  // Mountain West
  p('kawhi-leonard','Kawhi Leonard','San Diego State','mwc','era2',2011,15.5,10.6,2.5,['SF','PF']),
  p('winston-shepherd','Winston Shepherd','San Diego State','mwc','era2',2015,13.3,4.2,1.8,['SG','SF']),
  p('d-j-gay','D.J. Gay','Nevada','mwc','era2',2011,18.4,4.2,4.1,['PG','SG']),
  p('deshawn-stevenson','DeShawn Stevenson','Utah State','mwc','era2',2000,16.3,4.5,2.8,['SG']),
  p('tony-snell','Tony Snell','New Mexico','mwc','era2',2013,15.2,5.0,2.3,['SG','SF']),
  p('drew-gordon','Drew Gordon','New Mexico','mwc','era2',2012,16.6,11.8,1.8,['PF','C']),
  p('kendall-williams','Kendall Williams','New Mexico','mwc','era2',2013,17.2,3.8,4.4,['PG','SG']),
  p('jalen-jamison','Jalen Jamison','UNLV','mwc','era2',2013,15.8,5.4,2.2,['SF','SG']),
  p('deshawn-jackson-bsu','DeShawn Jackson','Boise State','mwc','era2',2011,17.4,4.9,3.3,['SG','SF']),
  p('jacoby-shepherd','Jacoby Shepherd','Colorado State','mwc','era2',2013,16.8,4.2,3.5,['SG','PG']),

  // ─── ERA 3: 2016–2020 ────────────────────────────────────────────────────

  // ACC
  p('grayson-allen','Grayson Allen','Duke','acc','era3',2018,21.6,3.0,3.3,['SG','PG']),
  p('marvin-bagley','Marvin Bagley III','Duke','acc','era3',2018,21.0,11.1,1.0,['PF','C']),
  p('zion-williamson','Zion Williamson','Duke','acc','era3',2019,22.6,8.9,2.1,['PF','SF']),
  p('rj-barrett','RJ Barrett','Duke','acc','era3',2019,22.6,7.6,4.0,['SG','SF']),
  p('tre-jones','Tre Jones','Duke','acc','era3',2020,16.2,4.1,6.4,['PG']),
  p('joel-berry','Joel Berry II','UNC','acc','era3',2018,18.0,3.9,3.7,['PG']),
  p('theo-pinson','Theo Pinson','UNC','acc','era3',2018,10.9,6.2,4.8,['SF','SG']),
  p('buddy-boeheim','Buddy Boeheim','Syracuse','acc','era3',2021,19.0,3.0,1.9,['SG']),
  p('tyus-battle','Tyus Battle','Syracuse','acc','era3',2019,19.2,3.6,2.6,['SG','PG']),
  p('tacko-fall','Tacko Fall','UCF','acc','era3',2019,11.0,7.6,0.7,['C']),
  p('braxton-key','Braxton Key','Virginia','acc','era3',2020,10.3,6.5,1.4,['SF','PF']),
  p('de-andre-hunter','De\'Andre Hunter','Virginia','acc','era3',2019,15.2,5.1,2.0,['SF','SG']),

  // Big East
  p('jalen-brunson-be','Jalen Brunson','Villanova','bigeast','era3',2018,18.9,3.1,4.0,['PG']),
  p('mikal-bridges','Mikal Bridges','Villanova','bigeast','era3',2018,17.7,5.0,2.0,['SF','SG']),
  p('josh-hart','Josh Hart','Villanova','bigeast','era3',2017,18.7,6.4,3.1,['SG','SF']),
  p('kris-jenkins','Kris Jenkins','Villanova','bigeast','era3',2017,13.0,5.6,1.5,['SG','SF']),
  p('donte-divincenzo','Donte DiVincenzo','Villanova','bigeast','era3',2018,13.4,4.7,2.4,['SG']),
  p('christian-david','Christian David','UConn','bigeast','era3',2019,13.4,5.0,2.4,['PG','SG']),
  p('markus-howard','Markus Howard','Marquette','bigeast','era3',2020,27.8,3.5,3.4,['PG','SG']),
  p('ed-croswell','Ed Croswell','Providence','bigeast','era3',2020,12.0,9.6,1.3,['C','PF']),
  p('myles-powell','Myles Powell','Seton Hall','bigeast','era3',2020,21.0,3.1,2.0,['SG','PG']),
  p('quentin-grimes','Quentin Grimes','UConn','bigeast','era3',2021,19.2,4.2,3.3,['SG']),

  // Big Ten
  p('ayo-dosunmu','Ayo Dosunmu','Illinois','big10','era3',2021,20.1,6.3,5.3,['PG','SG']),
  p('kofi-cockburn','Kofi Cockburn','Illinois','big10','era3',2022,21.1,10.6,0.9,['C']),
  p('cassius-winston','Cassius Winston','Michigan State','big10','era3',2020,18.6,3.7,5.8,['PG']),
  p('xavier-tillman','Xavier Tillman','Michigan State','big10','era3',2020,13.1,10.0,3.7,['PF','C']),
  p('kaleb-wesson','Kaleb Wesson','Ohio State','big10','era3',2020,14.0,7.7,1.8,['C','PF']),
  p('lamar-stevens','Lamar Stevens','Penn State','big10','era3',2020,18.4,6.2,2.4,['SF','PF']),
  p('ethan-happ','Ethan Happ','Wisconsin','big10','era3',2019,17.5,10.4,4.4,['C','PF']),
  p('jordan-nwora','Jordan Nwora','Louisville','big10','era3',2020,18.0,7.7,1.4,['SF','PF']),
  p('jaedon-ledee','Isaiah Livers','Michigan','big10','era3',2021,13.1,5.2,2.0,['SF','PF']),
  p('franz-wagner','Franz Wagner','Michigan','big10','era3',2021,12.5,6.5,2.2,['SF','PF']),
  p('hunter-dickinson','Hunter Dickinson','Michigan','big10','era3',2022,18.6,8.6,2.7,['C']),

  // SEC
  p('devin-booker','Devin Booker','Kentucky','sec','era3',2015,10.0,2.0,1.4,['SG']),
  p('tyler-ulis','Tyler Ulis','Kentucky','sec','era3',2016,17.3,3.5,7.8,['PG']),
  p('malik-monk','Malik Monk','Kentucky','sec','era3',2017,19.8,3.1,2.7,['SG','PG']),
  p('jarred-vanderbilt','Jarred Vanderbilt','Kentucky','sec','era3',2018,7.8,8.4,1.8,['PF','SF']),
  p('shai-gilgeous-alexander','Shai Gilgeous-Alexander','Kentucky','sec','era3',2018,14.4,5.1,4.5,['PG','SG']),
  p('evan-fournier','Evan Fournier','Florida','sec','era3',2012,13.2,3.4,1.9,['SG','SF']),
  p('keyontae-johnson','Keyontae Johnson','Florida','sec','era3',2021,14.6,6.8,1.8,['SF','PF']),
  p('daniel-gafford','Daniel Gafford','Arkansas','sec','era3',2019,16.9,8.7,1.7,['C','PF']),
  p('nick-richard','Nick Richard','Florida State','sec','era3',2020,12.0,8.3,1.1,['C']),
  p('pascal-siakam','Pascal Siakam','New Mexico State','sec','era3',2016,16.5,10.8,1.4,['PF','C']),

  // Big 12
  p('frank-mason','Frank Mason III','Kansas','big12','era3',2017,20.9,4.4,5.2,['PG']),
  p('devonte-graham','Devonte Graham','Kansas','big12','era3',2018,17.3,3.9,7.4,['PG']),
  p('mitch-lightfoot','Mitch Lightfoot','Kansas','big12','era3',2020,7.1,5.5,0.9,['PF','C']),
  p('trae-young','Trae Young','Oklahoma','big12','era3',2018,27.4,3.9,8.7,['PG']),
  p('grant-sherfield','Grant Sherfield','Nevada','big12','era3',2022,19.2,4.5,6.2,['PG','SG']),
  p('udoka-azubuike','Udoka Azubuike','Kansas','big12','era3',2020,13.7,10.5,0.9,['C']),
  p('makai-mason','Makai Mason','Yale','big12','era3',2017,20.7,3.5,3.6,['PG','SG']),
  p('luka-garza','Luka Garza','Iowa','big12','era3',2021,24.1,8.7,1.8,['C','PF']),
  p('dedric-lawson','Dedric Lawson','Kansas','big12','era3',2019,19.4,10.3,2.0,['PF','SF']),
  p('jalen-smith','Jalen Smith','Maryland','big12','era3',2020,15.5,10.5,1.6,['C','PF']),

  // Pac-12
  p('lonzo-ball','Lonzo Ball','UCLA','pac12','era3',2017,14.6,6.0,7.6,['PG']),
  p('tn-fultz','Markelle Fultz','Washington','pac12','era3',2017,23.2,5.7,5.9,['PG','SG']),
  p('jaylen-brown','Jaylen Brown','California','pac12','era3',2016,14.6,5.4,2.0,['SF','SG']),
  p('lauri-markkanen','Lauri Markkanen','Arizona','pac12','era3',2017,15.6,7.2,1.4,['PF','C']),
  p('allonzo-trier','Allonzo Trier','Arizona','pac12','era3',2018,19.6,5.2,2.0,['SG']),
  p('deandre-ayton','DeAndre Ayton','Arizona','pac12','era3',2018,20.1,11.6,1.9,['C','PF']),
  p('bol-bol','Bol Bol','Oregon','pac12','era3',2019,21.0,9.6,2.0,['C','PF']),
  p('payton-pritchard','Payton Pritchard','Oregon','pac12','era3',2020,20.5,4.3,5.5,['PG']),
  p('miles-norris','Miles Norris','Oregon','pac12','era3',2019,13.2,7.8,1.7,['PF','SF']),

  // ─── ERA 4: 2021–2025 ────────────────────────────────────────────────────

  // ACC
  p('paolo-banchero','Paolo Banchero','Duke','acc','era4',2022,17.2,7.8,3.2,['PF','SF']),
  p('aj-griffin','A.J. Griffin','Duke','acc','era4',2022,10.4,4.0,1.0,['SF','SG']),
  p('trevor-keels','Trevor Keels','Duke','acc','era4',2022,13.5,4.0,2.7,['SG','PG']),
  p('armando-bacot','Armando Bacot','UNC','acc','era4',2022,16.3,13.1,1.1,['C']),
  p('brady-manek','Brady Manek','UNC','acc','era4',2022,15.6,6.3,1.8,['PF','SF']),
  p('caleb-love','Caleb Love','UNC','acc','era4',2022,15.5,3.0,3.0,['PG','SG']),
  p('wendell-moore-jr','Wendell Moore Jr.','Duke','acc','era4',2022,13.4,5.3,4.4,['SG','PG']),
  p('mark-mitchell','Mark Mitchell','Duke','acc','era4',2023,10.8,4.5,1.4,['SF','PF']),
  p('dereck-lively','Dereck Lively II','Duke','acc','era4',2023,8.4,6.3,1.9,['C']),
  p('cooper-flagg','Cooper Flagg','Duke','acc','era4',2025,19.2,8.0,4.2,['PF','SF']),

  // Big East
  p('collin-gillespie','Collin Gillespie','Villanova','bigeast','era4',2022,15.2,3.0,3.9,['PG','SG']),
  p('justin-moore','Justin Moore','Villanova','bigeast','era4',2022,14.8,4.8,2.6,['SG','SF']),
  p('tj-storr','T.J. Storr','Kansas','bigeast','era4',2025,16.5,7.2,1.3,['PF','C']),
  p('andre-jackson-jr','Andre Jackson Jr.','UConn','bigeast','era4',2023,6.5,4.2,2.4,['SG','SF']),
  p('tristen-newton','Tristen Newton','UConn','bigeast','era4',2023,14.4,5.5,7.2,['PG']),
  p('andre-drummond-uconn','Andre Drummond','UConn','bigeast','era4',2012,10.0,9.5,1.1,['C']),
  p('dan-hurley','Hassan Diarra','UConn','bigeast','era4',2024,11.9,3.5,5.1,['PG']),
  p('donovan-clingan','Donovan Clingan','UConn','bigeast','era4',2024,13.0,7.4,2.9,['C']),
  p('cam-spencer','Cam Spencer','UConn','bigeast','era4',2024,14.0,3.9,3.3,['SG','PG']),

  // Big Ten
  p('jaden-ivey','Jaden Ivey','Purdue','big10','era4',2022,17.3,4.9,4.9,['PG','SG']),
  p('zach-edey','Zach Edey','Purdue','big10','era4',2024,25.2,12.2,2.0,['C']),
  p('trevion-williams','Trevion Williams','Purdue','big10','era4',2022,15.0,9.1,3.5,['C','PF']),
  p('keegan-murray','Keegan Murray','Iowa','big10','era4',2022,23.5,8.7,1.4,['SF','PF']),
  p('luka-garza-b10','Luka Garza','Iowa','big10','era4',2022,24.1,8.7,1.8,['C','PF']),
  p('aj-storr','A.J. Storr','Wisconsin','big10','era4',2024,15.9,4.4,1.4,['SG','SF']),
  p('max-christie','Max Christie','Michigan State','big10','era4',2022,9.4,3.4,1.7,['SG','SF']),
  p('pierre-brooks','Pierre Brooks II','Michigan State','big10','era4',2023,13.2,4.1,1.5,['SG','SF']),
  p('malik-hall','Malik Hall','Michigan State','big10','era4',2023,12.3,5.9,1.7,['SF','PF']),
  p('terrence-shannon','Terrence Shannon Jr.','Illinois','big10','era4',2024,23.1,4.5,3.3,['SG','PG']),

  // SEC
  p('oscar-tshiebwe','Oscar Tshiebwe','Kentucky','sec','era4',2022,17.4,15.1,1.6,['C','PF']),
  p('tyty-washington','TyTy Washington Jr.','Kentucky','sec','era4',2022,12.5,3.7,3.4,['PG']),
  p('shaedon-sharpe','Shaedon Sharpe','Kentucky','sec','era4',2022,0.0,0.0,0.0,['SG']),
  p('jabari-smith-jr','Jabari Smith Jr.','Auburn','sec','era4',2022,16.9,7.4,2.0,['PF','SF']),
  p('walker-kessler','Walker Kessler','Auburn','sec','era4',2022,11.0,8.3,1.3,['C']),
  p('scotty-pippen-jr','Scotty Pippen Jr.','Vanderbilt','sec','era4',2022,20.8,4.5,4.6,['PG','SG']),
  p('keldon-johnson','Keldon Johnson','Kentucky','sec','era4',2019,13.5,5.9,1.7,['SF','SG']),
  p('mark-sears','Mark Sears','Alabama','sec','era4',2024,21.5,4.3,4.4,['PG','SG']),
  p('devin-carter','Devin Carter','Providence','sec','era4',2024,20.2,6.1,3.5,['SG','SF']),
  p('grant-nelson','Grant Nelson','Alabama','sec','era4',2024,13.7,7.8,2.8,['PF','C']),

  // Big 12
  p('ochai-agbaji','Ochai Agbaji','Kansas','big12','era4',2022,18.8,5.1,1.7,['SG','SF']),
  p('remy-martin','Remy Martin','Kansas','big12','era4',2022,8.8,2.3,3.1,['PG']),
  p('david-mccormack','David McCormack','Kansas','big12','era4',2022,10.5,6.1,0.8,['C','PF']),
  p('cason-wallace','Cason Wallace','Kentucky','big12','era4',2023,11.7,4.8,3.9,['PG','SG']),
  p('bj-boston','B.J. Boston','Kentucky','big12','era4',2021,10.8,4.3,1.8,['SG','SF']),
  p('isaiah-collier','Isaiah Collier','USC','big12','era4',2024,16.0,4.7,5.3,['PG']),
  p('tre-mitchell','Tre Mitchell','Texas','big12','era4',2022,14.6,6.8,2.5,['PF','C']),
  p('adam-flagler','Adam Flagler','Presbyterian','big12','era4',2024,17.5,4.0,3.8,['SG','PG']),
  p('ja-quincy-hadley','RJ Davis','UNC','big12','era4',2024,21.0,4.0,3.8,['SG','PG']),
  p('hunter-sallis','Hunter Sallis','Gonzaga','big12','era4',2024,17.6,4.5,3.9,['PG','SG']),

  // Pac-12
  p('evan-mobley','Evan Mobley','USC','pac12','era4',2021,16.4,8.7,2.4,['C','PF']),
  p('jalen-green-pj','Jalen Green','G League Ignite','pac12','era4',2021,0.0,0.0,0.0,['SG']),
  p('jaden-springer','Jaden Springer','Tennessee','pac12','era4',2021,11.1,3.5,2.2,['SG','PG']),
  p('bennedict-mathurin','Bennedict Mathurin','Arizona','pac12','era4',2022,17.7,5.7,2.2,['SG','SF']),
  p('dalen-terry','Dalen Terry','Arizona','pac12','era4',2022,7.3,5.5,3.1,['SF','SG']),
  p('azuolas-tubelis','Azuolas Tubelis','Arizona','pac12','era4',2023,20.1,8.8,3.0,['PF','C']),
  p('kerr-kriisa','Kerr Kriisa','Arizona','pac12','era4',2023,11.4,2.8,5.9,['PG']),
  p('will-richardson','Will Richardson','Oregon','pac12','era4',2022,14.8,3.5,4.4,['PG','SG']),
  p('nba-nolan-hickman','Nolan Hickman','Washington','pac12','era4',2024,14.2,3.3,5.3,['PG']),
  p('tre-cassel','Tre Cassel','Stanford','pac12','era4',2023,12.0,4.5,4.1,['PG','SG']),

  // Mountain West (era4)
  p('max-agbonkpolo','Max Agbonkpolo','USC','mwc','era4',2022,11.0,4.5,1.4,['SF','PF']),
  p('matt-bradley','Matt Bradley','San Diego State','mwc','era4',2022,16.9,4.9,2.0,['SG']),
  p('lamont-butler','Lamont Butler','San Diego State','mwc','era4',2023,14.6,3.7,4.1,['PG','SG']),
  p('micah-parrish','Micah Parrish','San Diego State','mwc','era4',2022,11.2,4.1,1.2,['SF','SG']),
  p('nathan-mensah','Nathan Mensah','San Diego State','mwc','era4',2023,9.0,7.5,1.3,['C','PF']),
  p('jaelen-house','Jaelen House','New Mexico','mwc','era4',2024,17.8,3.5,4.2,['PG','SG']),
  p('grant-sherfield-nv','Grant Sherfield','Nevada','mwc','era4',2022,19.2,4.5,6.2,['PG','SG']),
  p('will-baker','Will Baker','Nevada','mwc','era4',2023,14.5,6.5,1.8,['C','PF']),
  p('graham-ike','Graham Ike','Wyoming','mwc','era4',2023,21.5,10.6,1.3,['C','PF']),
  p('cody-williams','Cody Williams','Colorado','mwc','era4',2024,13.1,5.8,2.6,['SF','PF']),

  // ─── ERA 2: 2011–2015 (additional conferences) ──────────────────────────────

  // WCC
  p('tyler-haws','Tyler Haws','BYU','wcc','era2',2014,23.2,3.8,1.5,['SG']),
  p('kelly-olynyk','Kelly Olynyk','Gonzaga','wcc','era2',2013,17.8,7.3,1.7,['PF','C']),
  p('kyle-wiltjer-e2','Kyle Wiltjer','Gonzaga','wcc','era2',2015,16.8,6.2,1.9,['PF','SF']),
  p('matthew-dellavedova','Matthew Dellavedova',"Saint Mary's",'wcc','era2',2013,15.8,3.4,6.4,['PG']),
  p('elias-harris','Elias Harris','Gonzaga','wcc','era2',2013,14.6,7.4,1.6,['SF']),
  p('kevin-pangos-e2','Kevin Pangos','Gonzaga','wcc','era2',2013,11.9,2.7,3.3,['PG']),

  // A-10
  p('andrew-nicholson','Andrew Nicholson','St. Bonaventure','a10','era2',2011,20.8,7.3,1.0,['PF','C']),
  p('tu-holloway','Tu Holloway','Xavier','a10','era2',2012,19.5,3.8,4.9,['PG','SG']),
  p('langston-galloway','Langston Galloway',"Saint Joseph's",'a10','era2',2015,19.0,4.7,2.8,['PG','SG']),
  p('ramone-moore','Ramone Moore','Temple','a10','era2',2013,18.2,5.3,2.8,['SG','SF']),
  p('jordan-sibert','Jordan Sibert','Dayton','a10','era2',2015,14.7,4.7,2.6,['SG','SF']),
  p('jio-fontan','Jio Fontan','Rhode Island','a10','era2',2013,15.8,3.2,4.4,['PG','SG']),

  // AAC (formed 2013–14)
  p('shabazz-napier-aac','Shabazz Napier','UConn','aac','era2',2014,18.0,5.9,4.9,['PG']),
  p('sean-kilpatrick','Sean Kilpatrick','Cincinnati','aac','era2',2014,21.8,4.2,2.4,['SG','SF']),
  p('russ-smith-lou','Russ Smith','Louisville','aac','era2',2014,18.3,3.8,4.7,['PG','SG']),
  p('joe-jackson-mem','Joe Jackson','Memphis','aac','era2',2015,15.2,3.8,4.0,['PG']),
  p('austin-nichols','Austin Nichols','Memphis','aac','era2',2015,14.0,8.1,1.8,['PF','C']),

  // MVC
  p('fred-vanvleet-mvc','Fred VanVleet','Wichita State','mvc','era2',2015,13.6,4.5,5.2,['PG']),
  p('cleanthony-early','Cleanthony Early','Wichita State','mvc','era2',2014,18.1,7.2,1.5,['SF','PF']),
  p('ron-baker-e2','Ron Baker','Wichita State','mvc','era2',2015,14.4,4.3,4.1,['SG','PG']),
  p('darius-carter-mvc2','Darius Carter','Loyola Chicago','mvc','era2',2015,15.8,7.3,1.4,['PF','SF']),
  p('stephen-hurt','Stephen Hurt','Indiana State','mvc','era2',2014,17.4,8.2,1.5,['PF','C']),

  // MAC
  p('dj-cooper','D.J. Cooper','Ohio','mac','era2',2013,14.7,4.4,8.5,['PG']),
  p('david-kool','David Kool','Western Michigan','mac','era2',2012,18.1,3.8,2.5,['SG','PG']),
  p('matt-tiby','Matt Tiby','Akron','mac','era2',2013,14.2,7.1,1.2,['PF','C']),
  p('quincy-diggs','Quincy Diggs','Akron','mac','era2',2015,13.8,4.5,2.2,['SG','PG']),
  p('jake-odum','Jake Odum','Indiana State','mac','era2',2014,13.2,3.6,6.3,['PG']),

  // Big Sky
  p('damian-lillard','Damian Lillard','Weber State','bigsky','era2',2012,24.5,5.0,4.0,['PG']),
  p('joel-bolomboy','Joel Bolomboy','Weber State','bigsky','era2',2014,14.8,11.3,1.4,['PF','C']),
  p('jordan-veasy','Jordan Veasy','Sacramento State','bigsky','era2',2014,18.2,4.0,2.5,['SG','SF']),
  p('tyler-harvey','Tyler Harvey','Eastern Washington','bigsky','era2',2015,23.0,3.8,3.5,['SG','PG']),
  p('shawn-potts','Shawn Potts','Idaho','bigsky','era2',2013,16.8,4.8,3.2,['PG','SG']),

  // Big South
  p('dj-burns-bs','D.J. Burns','Campbell','bigsouth','era2',2015,17.5,9.2,2.1,['PF','C']),
  p('corey-walden','Corey Walden','Liberty','bigsouth','era2',2014,16.3,5.1,3.2,['SG','PG']),
  p('prentiss-hubb','Prentiss Hubb','North Carolina A&T','bigsouth','era2',2015,14.2,4.3,4.8,['PG']),
  p('kyle-collinsworth-bs','Kyle Collinsworth','ETSU','bigsouth','era2',2013,15.6,7.8,5.1,['SF','PG']),
  p('marcus-madison','Marcus Madison','High Point','bigsouth','era2',2014,18.5,5.2,2.3,['SG','SF']),

  // CAA
  p('jalen-lindsey','Jalen Lindsey','Northeastern','caa','era2',2014,18.5,5.8,2.4,['SG','SF']),
  p('tj-crockett','T.J. Crockett','James Madison','caa','era2',2013,16.4,7.2,1.8,['PF','C']),
  p('devontae-cacok','Devontae Cacok','UNCW','caa','era2',2015,16.8,9.8,1.4,['PF','C']),
  p('marcus-thornton-caa','Marcus Thornton','William & Mary','caa','era2',2013,17.3,5.5,2.1,['SG','PG']),
  p('darius-theus','Darius Theus','VCU','caa','era2',2013,14.4,4.1,5.8,['PG']),

  // Horizon
  p('ron-hunter','Ron Hunter','IUPUI','horizon','era2',2012,17.5,5.6,3.0,['SG','PG']),
  p('paris-bass','Paris Bass','Oakland','horizon','era2',2014,16.0,8.3,1.5,['PF','SF']),
  p('jordan-swing','Jordan Swing','Milwaukee','horizon','era2',2013,16.3,4.8,3.1,['SG','PG']),
  p('omar-prewitt','Omar Prewitt','Green Bay','horizon','era2',2014,14.6,4.3,2.1,['SG','SF']),
  p('travis-bader','Travis Bader','Oakland','horizon','era2',2014,22.3,3.8,2.0,['SG','PG']),

  // Ivy
  p('michael-grace','Michael Grace','Princeton','ivy','era2',2014,19.6,4.5,3.8,['PG','SG']),
  p('yale-hooker','Austin Morgan','Yale','ivy','era2',2013,18.2,4.5,3.1,['SG','PG']),
  p('max-rothschild','Max Rothschild','Cornell','ivy','era2',2012,14.8,6.3,3.1,['SG','PG']),
  p('oliver-mcnally','Oliver McNally','Harvard','ivy','era2',2012,12.5,4.2,4.6,['PG']),
  p('thomas-malone','Thomas Malone','Brown','ivy','era2',2015,15.6,5.8,2.4,['PF','SF']),

  // MAAC
  p('seth-pinkney','Seth Pinkney','Fairfield','maac','era2',2013,16.3,9.1,1.4,['PF','C']),
  p('mouhamed-faye','Mouhamed Faye','Iona','maac','era2',2014,17.5,8.2,1.3,['PF','C']),
  p('alfonzo-mckinnie','Alfonzo McKinnie','Chicago State','maac','era2',2015,17.3,8.5,1.8,['SF','PF']),
  p('mike-glover','Mike Glover','Iona','maac','era2',2012,21.0,13.5,1.5,['PF','C']),
  p('lamont-jones','Lamont Jones','Iona','maac','era2',2012,20.4,4.2,3.6,['PG','SG']),

  // MEAC
  p('warren-ward','Warren Ward','Hampton','meac','era2',2013,19.5,8.6,1.6,['SF','PF']),
  p('darius-watson','Darius Watson','Norfolk State','meac','era2',2012,18.8,6.2,3.2,['SG','SF']),
  p('brandon-mobley','Brandon Mobley','Howard','meac','era2',2014,17.3,8.4,1.5,['PF','C']),
  p('kyle-gaillard','Kyle Gaillard','Bethune-Cookman','meac','era2',2013,16.5,5.8,2.6,['SG','PG']),
  p('david-holston','David Holston','Chicago State','meac','era2',2012,15.6,4.0,6.4,['PG']),

  // SWAC
  p('marcus-young','Marcus Young','MVSU','swac','era2',2012,20.5,4.6,5.8,['PG','SG']),
  p('travis-taylor','Travis Taylor','Alcorn State','swac','era2',2013,19.5,8.2,2.5,['PF','C']),
  p('cameron-clark-swac','Cameron Clark','Prairie View','swac','era2',2014,18.4,5.3,2.8,['SG','SF']),
  p('devonte-mathis','Devonte Mathis','Alabama State','swac','era2',2015,16.8,5.5,2.1,['SG','PG']),
  p('william-lee-swac','William Lee','Alabama A&M','swac','era2',2014,15.5,9.3,1.2,['PF','C']),

  // Summit League
  p('gage-gilmore','Gage Gilmore','IPFW','summit','era2',2014,22.5,6.8,3.5,['SG','SF']),
  p('thomas-gipson','Thomas Gipson','Kansas City','summit','era2',2015,18.3,9.5,1.8,['PF','C']),
  p('ben-murdock','Ben Murdock','Western Illinois','summit','era2',2013,19.8,4.6,3.4,['PG','SG']),
  p('tyler-ankrum','Tyler Ankrum','IUPUI','summit','era2',2014,18.5,5.2,2.2,['SG','PG']),
  p('josh-gasser','Josh Gasser','Wisconsin','summit','era2',2015,7.8,3.0,2.3,['PG','SG']),

  // OVC
  p('cj-mccollum','C.J. McCollum','Lehigh','ovc','era2',2013,23.9,5.8,3.2,['SG','PG']),
  p('josh-hagins','Josh Hagins','Arkansas-Little Rock','ovc','era2',2015,17.2,5.2,5.8,['PG','SG']),
  p('mike-mcgill','Mike McGill','Morehead State','ovc','era2',2012,18.5,8.2,2.3,['PF','C']),
  p('jacquise-terry','JaQuan Lyle','Austin Peay','ovc','era2',2014,17.4,4.6,3.5,['PG','SG']),
  p('robert-covington','Robert Covington','Tennessee State','ovc','era2',2013,18.0,8.4,2.5,['SF','PF']),

  // NEC
  p('ej-anosike','E.J. Anosike','Saint Francis PA','nec','era2',2012,17.5,12.6,1.0,['PF','C']),
  p('jamal-shead-nec','Jamal Mayers','Long Island','nec','era2',2015,18.3,4.2,3.7,['SG','PG']),
  p('myles-mack','Myles Mack','Robert Morris','nec','era2',2013,18.5,4.3,5.6,['PG','SG']),
  p('amile-jefferson-nec','Brian Benson','Quinnipiac','nec','era2',2014,14.5,8.6,1.2,['PF','C']),
  p('zaid-hearst','Zaid Hearst','FDU','nec','era2',2015,17.8,5.3,2.6,['SG','SF']),

  // Patriot League
  p('cj-mccollum-pat','C.J. McCollum','Lehigh','patriot','era2',2013,23.9,5.8,3.2,['SG','PG']),
  p('steven-stewart','Steven Stewart','Colgate','patriot','era2',2012,19.2,6.8,2.1,['PG','SG']),
  p('kj-sherrill','K.J. Sherrill','American','patriot','era2',2014,18.5,6.2,2.8,['SG','SF']),
  p('adam-folker','Adam Folker','Army','patriot','era2',2015,16.8,9.3,1.5,['PF','C']),
  p('matt-marshall','Matt Marshall','Holy Cross','patriot','era2',2013,18.3,4.5,2.5,['SG','PG']),

  // Southern Conference
  p('fletcher-magee','Fletcher Magee','Wofford','southern','era2',2015,16.5,3.8,1.8,['SG','PG']),
  p('mike-kingdom','Mike Kingdom','Furman','southern','era2',2013,18.5,5.2,2.8,['SG','PG']),
  p('kameron-shaheed','Kameron Shaheed','Western Carolina','southern','era2',2014,20.5,5.8,3.2,['SG','SF']),
  p('thomas-mann','Thomas Mann','Chattanooga','southern','era2',2015,17.3,4.8,2.5,['PG','SG']),
  p('jordon-crawford','Jordon Crawford','Samford','southern','era2',2013,18.8,4.2,3.5,['PG','SG']),

  // Southland
  p('marcus-lewis-slu','Marcus Lewis','Stephen F. Austin','southland','era2',2014,19.5,4.2,2.8,['SG','PG']),
  p('kris-joseph-sl','Kris Joseph','Lamar','southland','era2',2013,16.8,7.8,2.4,['SF','PF']),
  p('brian-williams-sl','Brian Williams','Central Arkansas','southland','era2',2015,17.2,6.5,2.1,['SF','PF']),
  p('devontae-jackson','Devontae Jackson','Northwestern State','southland','era2',2014,18.5,5.4,2.6,['SG','SF']),
  p('darius-miller-sl','Darius Miller','Texas A&M-Corpus Christi','southland','era2',2015,16.3,6.8,2.2,['SF','PF']),

  // WAC
  p('trevor-lacey','Trevor Lacey','New Mexico State','wac','era2',2015,20.7,4.6,3.8,['SG','PG']),
  p('sim-bhullar','Sim Bhullar','New Mexico State','wac','era2',2014,14.1,8.2,1.2,['C']),
  p('jalen-jones-wac','Jalen Jones','SMU','wac','era2',2015,14.5,5.8,2.3,['SF','SG']),
  p('pascal-siakam-wac','Pascal Siakam','New Mexico State','wac','era2',2016,16.5,10.8,1.4,['PF','C']),
  p('daniel-mullings','Daniel Mullings','New Mexico State','wac','era2',2015,18.4,4.2,3.8,['PG','SG']),

  // Big West
  p('giddy-potts','Giddy Potts','MTSU','bigwest','era2',2015,16.8,5.5,3.8,['SG','PG']),
  p('tj-Robinson','T.J. Robinson','Long Beach State','bigwest','era2',2013,18.5,8.6,2.1,['PF','SF']),
  p('casper-ware','Casper Ware','Long Beach State','bigwest','era2',2012,22.0,4.8,5.5,['PG','SG']),
  p('kyle-fogg','Kyle Fogg','UC Santa Barbara','bigwest','era2',2012,15.3,6.2,4.5,['SF','PG']),
  p('james-ennis-iii','James Ennis III','Long Beach State','bigwest','era2',2013,22.2,6.5,2.0,['SF','SG']),

  // ASUN
  p('kenny-boynton-asun','Kenny Boynton','Florida Gulf Coast','asun','era2',2014,17.8,4.5,3.0,['SG','PG']),
  p('bernard-thompson','Bernard Thompson','Florida Gulf Coast','asun','era2',2014,16.5,6.8,2.5,['SF','SG']),
  p('sherwood-brown','Sherwood Brown','Florida Gulf Coast','asun','era2',2013,20.5,8.2,2.5,['SF','PF']),
  p('brett-comer','Brett Comer','Florida Gulf Coast','asun','era2',2013,9.0,4.5,10.8,['PG']),
  p('marc-davis-asun','Marc Davis','Mercer','asun','era2',2014,21.0,5.5,3.2,['PG','SG']),

  // Sun Belt
  p('rj-hunter','R.J. Hunter','Georgia State','sunbelt','era2',2015,19.7,4.4,3.3,['SG','SF']),
  p('elfrid-payton','Elfrid Payton','Louisiana Lafayette','sunbelt','era2',2014,15.4,8.8,6.6,['PG']),
  p('marcus-thornton-sb','Marcus Thornton','Arkansas State','sunbelt','era2',2012,16.8,5.3,2.2,['SG','SF']),
  p('bo-zeigler','Bo Zeigler','Little Rock','sunbelt','era2',2015,19.5,4.8,4.2,['PG','SG']),
  p('wes-wilkinson','Wes Wilkinson','South Alabama','sunbelt','era2',2014,16.2,7.3,2.1,['PF','SF']),

  // C-USA
  p('nick-mast','Nick Mast','Middle Tennessee','cusa','era2',2013,15.5,7.2,2.2,['PF','C']),
  p('dominique-jones','Dominique Jones','South Florida','cusa','era2',2011,17.8,5.3,4.9,['SG','PG']),
  p('jamaal-franklin','Jamaal Franklin','San Diego State','cusa','era2',2013,17.2,9.5,2.8,['SF','SG']),
  p('edgar-sosa','Edgar Sosa','UTEP','cusa','era2',2012,20.8,3.5,3.8,['PG','SG']),
  p('ray-mcallum','Ray McCallum','Detroit','cusa','era2',2013,17.5,4.8,4.5,['PG','SG']),

  // ─── ERA 3: 2016–2020 (additional conferences) ──────────────────────────────

  // WCC
  p('kyle-wiltjer-e3','Kyle Wiltjer','Gonzaga','wcc','era3',2016,20.4,6.3,1.5,['PF','SF']),
  p('domantas-sabonis','Domantas Sabonis','Gonzaga','wcc','era3',2016,17.6,11.8,1.8,['PF','C']),
  p('nigel-williams-goss','Nigel Williams-Goss','Gonzaga','wcc','era3',2017,16.8,6.0,4.7,['PG']),
  p('rui-hachimura','Rui Hachimura','Gonzaga','wcc','era3',2019,19.7,6.5,1.5,['SF','PF']),
  p('yoeli-childs','Yoeli Childs','BYU','wcc','era3',2020,22.2,9.0,2.0,['PF']),
  p('jordan-ford','Jordan Ford',"Saint Mary's",'wcc','era3',2020,21.0,3.7,4.6,['PG','SG']),
  p('filip-petrusev','Filip Petrusev','Gonzaga','wcc','era3',2020,17.5,7.9,1.3,['PF','C']),

  // A-10
  p('obi-toppin','Obi Toppin','Dayton','a10','era3',2020,20.0,7.5,2.2,['PF']),
  p('jaylen-adams','Jaylen Adams','St. Bonaventure','a10','era3',2017,20.6,3.7,6.5,['PG']),
  p('luwane-pipkins','Luwane Pipkins','UMass','a10','era3',2019,22.9,4.6,4.5,['PG','SG']),
  p('josh-cunningham','Josh Cunningham','Dayton','a10','era3',2019,16.7,9.1,1.3,['PF','C']),
  p('marcus-santos-silva','Marcus Santos-Silva','VCU','a10','era3',2020,13.7,10.6,0.9,['PF','C']),
  p('david-skara','David Skara','St. Bonaventure','a10','era3',2020,16.0,5.8,4.1,['SG','SF']),

  // AAC
  p('dedric-lawson-aac','Dedric Lawson','Memphis','aac','era3',2017,19.2,9.9,3.3,['PF','C']),
  p('jeremiah-martin','Jeremiah Martin','Memphis','aac','era3',2019,19.7,4.3,4.4,['PG','SG']),
  p('landry-shamet-aac','Landry Shamet','Wichita State','aac','era3',2018,14.9,3.2,5.2,['PG','SG']),
  p('precious-achiuwa','Precious Achiuwa','Memphis','aac','era3',2020,15.8,10.8,1.0,['PF','C']),
  p('rob-gray','Rob Gray','Houston','aac','era3',2018,15.9,4.3,3.1,['PG','SG']),
  p('corey-davis-jr','Corey Davis Jr.','Houston','aac','era3',2019,17.0,4.8,3.2,['SG','PG']),

  // Mountain West
  p('malachi-flynn','Malachi Flynn','San Diego State','mwc','era3',2020,17.6,4.5,5.1,['PG']),
  p('sam-merrill-mwc','Sam Merrill','Utah State','mwc','era3',2019,20.9,3.9,4.2,['SG','PG']),
  p('jordan-caroline','Jordan Caroline','Nevada','mwc','era3',2018,17.7,8.6,2.2,['PF','SF']),
  p('caleb-martin-nv','Caleb Martin','Nevada','mwc','era3',2019,18.9,7.4,2.9,['SF','SG']),
  p('cody-martin-nv','Cody Martin','Nevada','mwc','era3',2019,14.5,6.6,5.0,['PG','SF']),

  // MVC
  p('landry-shamet-mvc','Landry Shamet','Wichita State','mvc','era3',2017,11.4,2.8,3.3,['PG','SG']),
  p('ron-baker-e3','Ron Baker','Wichita State','mvc','era3',2016,16.4,4.3,4.1,['SG','PG']),
  p('clayton-custer','Clayton Custer','Loyola Chicago','mvc','era3',2018,13.2,2.5,4.2,['PG']),
  p('cameron-krutwig-e3','Cameron Krutwig','Loyola Chicago','mvc','era3',2019,14.2,7.4,2.3,['C','PF']),
  p('darius-thompson','Darius Thompson','Northern Iowa','mvc','era3',2017,14.2,3.7,4.4,['PG','SG']),

  // MAC
  p('cj-massinburg','C.J. Massinburg','Buffalo','mac','era3',2019,18.2,6.5,3.0,['SG','SF']),
  p('jeremy-harris-mac','Jeremy Harris','Buffalo','mac','era3',2019,16.6,6.2,3.9,['SG','SF']),
  p('nick-perkins','Nick Perkins','Buffalo','mac','era3',2019,14.3,9.8,1.3,['PF','C']),
  p('dwayne-lagg','Dwayne Lautier-Ogunleye','Akron','mac','era3',2018,18.1,5.3,2.1,['SG','SF']),
  p('xeyrius-williams','Xeyrius Williams','Kent State','mac','era3',2017,18.3,5.8,2.4,['SG','SF']),

  // Big Sky
  p('jerrick-harding','Jerrick Harding','Weber State','bigsky','era3',2020,17.4,5.1,3.2,['SG','PG']),
  p('mikey-dread','Mikey Dread','Sacramento State','bigsky','era3',2018,17.5,5.8,3.0,['SG','SF']),
  p('kim-aiken-jr','Kim Aiken Jr.','Portland State','bigsky','era3',2020,18.5,5.4,2.2,['SG','PG']),
  p('jack-henderson','Jack Henderson','Northern Colorado','bigsky','era3',2019,19.2,4.5,4.8,['PG','SG']),
  p('tyler-lydon','Tyler Lydon','Syracuse','bigsky','era3',2017,14.6,7.1,1.5,['PF','SF']),

  // Big South
  p('caleb-homesley','Caleb Homesley','Liberty','bigsouth','era3',2019,18.6,5.4,3.4,['SG','SF']),
  p('dj-burns-bs3','D.J. Burns','Campbell','bigsouth','era3',2020,17.8,8.2,1.8,['PF','C']),
  p('isaiah-crawley','Isaiah Crawley','Winthrop','bigsouth','era3',2018,18.5,4.2,3.8,['PG','SG']),
  p('malik-berry','Malik Berry','High Point','bigsouth','era3',2019,21.0,7.8,2.5,['PG','SG']),
  p('jalen-crutcher','Jalen Crutcher','Tennessee Tech','bigsouth','era3',2019,19.6,4.8,4.5,['PG','SG']),

  // CAA
  p('devontae-cacok-e3','Devontae Cacok','UNCW','caa','era3',2019,17.7,12.0,1.2,['PF','C']),
  p('marial-shayok','Marial Shayok','Virginia','caa','era3',2019,19.5,5.6,2.1,['SG','SF']),
  p('mike-rhoades','Austin Tilghman','College of Charleston','caa','era3',2019,18.0,5.5,4.2,['PG','SG']),
  p('jaquil-taylor','JaQuel Taylor','James Madison','caa','era3',2018,17.2,7.8,2.1,['PF','SF']),
  p('desean-murray','DeSean Murray','Northeastern','caa','era3',2018,17.8,5.0,3.2,['SG','SF']),

  // Horizon
  p('luke-kennard-hor','Darius Garland','Vanderbilt','horizon','era3',2020,16.2,3.5,4.5,['PG','SG']),
  p('rienk-mast','Rienk Mast','Valparaiso','horizon','era3',2017,20.0,9.5,1.8,['PF','C']),
  p('luke-fischer','Luke Fischer','Marquette','horizon','era3',2016,14.0,8.2,1.0,['C','PF']),
  p('kendall-stephens','Kendall Stephens','Purdue Fort Wayne','horizon','era3',2018,23.8,4.5,2.2,['SG','PG']),
  p('xavier-moon','Xavier Moon','IUPUI','horizon','era3',2017,21.5,5.5,4.5,['PG','SG']),

  // Ivy
  p('makai-mason-e3','Makai Mason','Yale','ivy','era3',2017,20.7,3.5,3.6,['PG','SG']),
  p('christian-dawkins','Christian Dawkins','Michigan State','ivy','era3',2019,16.5,4.0,3.0,['PG','SG']),
  p('aidan-sherwood','Seth Towns','Harvard','ivy','era3',2018,15.3,6.2,2.5,['SF','PF']),
  p('chris-aniekwe','Chris Aniekwe','Yale','ivy','era3',2020,14.5,7.3,1.5,['PF','C']),
  p('ike-nwamu','Ike Nwamu','Iona','ivy','era3',2017,18.4,4.5,2.0,['SG','SF']),

  // MAAC
  p('quinton-rose','Quinton Rose','Temple','maac','era3',2019,18.5,5.8,2.1,['SF','SG']),
  p('jordan-washington-maac','Jordan Washington','Fairfield','maac','era3',2019,18.8,10.3,1.2,['PF','C']),
  p('marcus-posso','Marcus Posso','Manhattan','maac','era3',2020,18.8,5.6,4.3,['SG','PG']),
  p('isaiah-washington','Isaiah Washington','Iona','maac','era3',2020,20.5,3.8,5.2,['PG','SG']),
  p('lee-robinson','Lee Robinson','Niagara','maac','era3',2018,22.5,4.2,2.8,['SG','PG']),

  // MEAC
  p('jakari-spence','Jakari Spence','Norfolk State','meac','era3',2017,20.5,6.2,3.5,['SG','PG']),
  p('reggie-becton','Reggie Becton','Bethune-Cookman','meac','era3',2018,19.4,6.8,2.5,['SF','SG']),
  p('jason-harris-meac','Jason Harris','Coppin State','meac','era3',2020,16.4,5.5,3.2,['SG','PG']),
  p('cj-fulton','C.J. Fulton','Delaware State','meac','era3',2019,18.5,4.2,2.8,['SG','PG']),
  p('prince-osei','Prince Osei','Morgan State','meac','era3',2020,17.8,8.2,2.1,['PF','SF']),

  // SWAC
  p('john-walker-iii','John Walker III','Grambling','swac','era3',2019,22.5,6.5,3.8,['SG','PG']),
  p('tevin-calhoun','Tevin Calhoun','Alabama A&M','swac','era3',2018,21.5,8.2,2.2,['SF','PF']),
  p('marlon-smith-swac','Marlon Smith','Alcorn State','swac','era3',2020,18.4,6.8,2.5,['SF','SG']),
  p('travis-taylor-e3','Travis Taylor','Southern','swac','era3',2016,20.8,9.5,1.8,['PF','C']),
  p('de-von-pridgett','Devon Pridgett','Southern','swac','era3',2019,16.8,5.2,4.5,['PG','SG']),

  // Summit
  p('ade-murkey','Ade Murkey','North Dakota State','summit','era3',2019,19.4,5.2,2.2,['SG','SF']),
  p('vinnie-shahid','Vinnie Shahid','Western Illinois','summit','era3',2018,22.5,5.8,3.2,['SG','PG']),
  p('dj-schultz','D.J. Schultz','South Dakota','summit','era3',2019,20.5,5.2,2.8,['PF','SF']),
  p('matt-cartwright','Matt Cartwright','Oral Roberts','summit','era3',2020,18.7,10.5,1.5,['PF','C']),
  p('sam-freeman','Sam Freeman','Kansas City','summit','era3',2017,17.8,5.5,3.2,['SG','PG']),

  // OVC
  p('belmont-reeves','Dylan Windler','Belmont','ovc','era3',2019,19.5,10.5,3.5,['SF','PF']),
  p('austin-peay-e3','Terry Taylor','Austin Peay','ovc','era3',2020,18.8,11.0,2.3,['PF','C']),
  p('darius-thompson-e3','Darius Thompson','Lipscomb','ovc','era3',2018,18.2,5.8,5.0,['PG','SG']),
  p('ba-walker','Tray Boyd','Tennessee-Martin','ovc','era3',2020,22.5,4.8,5.2,['PG','SG']),
  p('de-shuntas-short','Shaun Kirk','Southeast Missouri State','ovc','era3',2019,19.8,6.2,2.4,['SG','SF']),

  // NEC
  p('isaiah-whaley','Isaiah Whaley','Connecticut','nec','era3',2022,14.5,9.0,2.0,['PF','C']),
  p('kevon-harris-nec','Kevon Harris','Stephen F. Austin','nec','era3',2018,23.8,8.5,2.0,['SF','PF']),
  p('de-shawn-jackson-nec','DeShawn Jackson','LIU','nec','era3',2018,21.5,6.5,3.5,['SG','SF']),
  p('alex-harris-nec','Alex Harris','Saint Francis PA','nec','era3',2019,22.8,4.8,2.8,['SG','PG']),
  p('omar-mascarinas','Omar Mascarinas','Bryant','nec','era3',2020,18.4,4.5,3.2,['SG','PG']),

  // Patriot League
  p('cj-mccollum-pat3','Nathan Stover','Army','patriot','era3',2018,18.5,5.8,2.5,['SG','PG']),
  p('colgate-rauch','Rapolas Ivanauskas','Colgate','patriot','era3',2019,15.5,7.8,2.2,['PF','C']),
  p('austin-hill','Austin Hill','Army','patriot','era3',2020,18.3,4.8,3.2,['SG','PG']),
  p('jack-gibbs','Jack Gibbs','Davidson','patriot','era3',2017,22.2,4.5,5.0,['PG','SG']),
  p('alex-nicholson','Alex Nicholson','Holy Cross','patriot','era3',2019,17.5,6.8,3.5,['SF','PF']),

  // Southern Conference
  p('fletcher-magee-e3','Fletcher Magee','Wofford','southern','era3',2019,21.0,3.5,1.8,['SG']),
  p('storm-murphy','Storm Murphy','Samford','southern','era3',2020,17.8,3.5,5.5,['PG','SG']),
  p('jordan-lyons','Jordan Lyons','Furman','southern','era3',2020,18.5,4.8,4.5,['PG','SG']),
  p('billy-thomas-soc','Billy Thomas','UNCG','southern','era3',2020,17.5,5.8,2.5,['SG','SF']),
  p('christian-jones','Christian Jones','East Tennessee State','southern','era3',2019,16.8,8.2,2.8,['PF','SF']),

  // Southland
  p('tj-holyfield','T.J. Holyfield','Stephen F. Austin','southland','era3',2019,15.4,10.5,1.8,['PF','C']),
  p('devontae-jackson-e3','Devontae Jackson','New Orleans','southland','era3',2017,20.5,5.8,3.5,['SG','SF']),
  p('cobe-durant','Cobe Durant','Southeastern Louisiana','southland','era3',2020,19.8,5.2,3.5,['SG','SF']),
  p('kevon-harris-sl','Kevon Harris','Stephen F. Austin','southland','era3',2018,23.8,8.5,2.0,['SF','PF']),
  p('jaylen-allen','Jaylen Allen','Abilene Christian','southland','era3',2019,16.5,6.5,3.8,['SF','SG']),

  // WAC
  p('eric-mika','Eric Mika','BYU','wac','era3',2017,17.6,9.8,1.5,['PF','C']),
  p('zach-kocur','Zach Kocur','Grand Canyon','wac','era3',2018,19.2,4.5,3.5,['SG','PG']),
  p('carlos-johnson-wac','Carlos Johnson','New Mexico State','wac','era3',2019,17.8,5.8,4.2,['PF','SF']),
  p('trevelin-queen','Trevelin Queen','New Mexico State','wac','era3',2020,16.5,5.5,3.5,['SG','SF']),
  p('cody-john','Cody John','Utah Valley','wac','era3',2019,18.3,4.2,4.8,['PG','SG']),

  // Big West
  p('joe-panfil','Joe Panfil','Long Beach State','bigwest','era3',2017,15.5,7.5,2.0,['PF','C']),
  p('alex-hamilton','Alex Hamilton','UC Davis','bigwest','era3',2017,19.5,5.8,3.5,['SG','PG']),
  p('max-heidegger','Max Heidegger','UC Santa Barbara','bigwest','era3',2020,15.8,5.5,5.8,['PG','SG']),
  p('duane-washington','Duane Washington Jr.','Ohio State','bigwest','era3',2020,14.4,3.8,2.1,['SG','PG']),
  p('lamine-diane','Lamine Diane','CSU Northridge','bigwest','era3',2019,23.5,8.5,2.5,['SF','PF']),

  // ASUN
  p('caleb-homesley-asun','Caleb Homesley','Liberty','asun','era3',2020,18.6,5.4,3.4,['SG','SF']),
  p('terrin-ector','Terrin Ector','Jacksonville','asun','era3',2017,18.5,5.5,3.0,['SG','PG']),
  p('jv-webb','J.V. Webb','North Florida','asun','era3',2019,19.8,4.2,4.5,['PG','SG']),
  p('derek-st-hilaire','Derek St. Hilaire','Stetson','asun','era3',2020,16.4,6.5,2.5,['SF','SG']),
  p('alex-hamilton-asun','Alex Hamilton','FGCU','asun','era3',2020,16.5,4.8,3.2,['SG','PG']),

  // Sun Belt
  p('kassius-robertson','Kassius Robertson','Missouri','sunbelt','era3',2018,19.3,3.5,3.0,['SG','PG']),
  p('grayson-murphy','Grayson Murphy','Arkansas-Little Rock','sunbelt','era3',2017,17.8,4.5,5.5,['PG','SG']),
  p('kevin-carter-jr','Kevin Carter Jr.','Texas State','sunbelt','era3',2019,17.5,4.8,2.8,['SG','SF']),
  p('kareem-merritt','Kareem Merritt','Appalachian State','sunbelt','era3',2018,17.2,4.5,5.8,['PG','SG']),
  p('christian-jones-sb','Christian Jones','Louisiana Lafayette','sunbelt','era3',2020,16.8,9.8,1.5,['PF','C']),

  // C-USA
  p('la-marr-woodyard','LaMarr Woodyard','North Texas','cusa','era3',2019,18.8,6.5,3.5,['SF','PF']),
  p('darius-perkins','Darius Perkins','UTEP','cusa','era3',2020,20.8,5.5,4.2,['PG','SG']),
  p('derrick-griffin','Derrick Griffin','Louisiana Tech','cusa','era3',2017,16.5,10.8,1.5,['PF','C']),
  p('amanze-ngumezi','Amanze Ngumezi','Rice','cusa','era3',2020,15.8,7.8,2.8,['SF','PF']),
  p('will-wade-cusa','Michael Flowers','WKU','cusa','era3',2018,17.5,5.5,3.2,['SG','SF']),

  // ─── ERA 4: 2021–2025 (additional conferences) ──────────────────────────────

  // WCC
  p('drew-timme','Drew Timme','Gonzaga','wcc','era4',2023,21.2,7.5,3.2,['PF','C']),
  p('chet-holmgren','Chet Holmgren','Gonzaga','wcc','era4',2022,14.1,9.9,1.9,['C']),
  p('jalen-suggs','Jalen Suggs','Gonzaga','wcc','era4',2021,14.4,5.3,4.5,['PG','SG']),
  p('andrew-nembhard','Andrew Nembhard','Gonzaga','wcc','era4',2022,11.9,3.9,5.9,['PG']),
  p('jalen-williams-scu','Jalen Williams','Santa Clara','wcc','era4',2022,18.0,4.1,5.3,['SG','SF']),
  p('julian-strawther','Julian Strawther','Gonzaga','wcc','era4',2023,15.9,5.5,1.9,['SG','SF']),

  // A-10
  p('blake-francis','Blake Francis','Richmond','a10','era4',2022,18.1,4.9,3.5,['SG']),
  p('nathan-cayo','Nathan Cayo','Richmond','a10','era4',2022,16.1,7.5,1.5,['PF','C']),
  p('tyler-burton','Tyler Burton','Richmond','a10','era4',2022,12.9,5.3,3.8,['SF','PF']),
  p('uchenna-iroegbu','Uchenna Iroegbu','Saint Louis','a10','era4',2023,20.0,3.5,4.1,['PG','SG']),
  p('noah-fernandes','Noah Fernandes','UMass','a10','era4',2023,14.7,4.3,5.8,['PG']),
  p('dan-friday','Dan Friday','Fordham','a10','era4',2022,17.5,4.8,3.2,['SG','PG']),

  // AAC
  p('quentin-grimes-aac','Quentin Grimes','Houston','aac','era4',2021,17.8,5.7,2.0,['SG']),
  p('kendric-davis-aac','Kendric Davis','Memphis','aac','era4',2023,21.9,3.7,5.4,['PG','SG']),
  p('marcus-sasser','Marcus Sasser','Houston','aac','era4',2023,16.8,2.8,3.1,['SG','PG']),
  p('dejon-jarreau','DeJon Jarreau','Houston','aac','era4',2021,10.8,5.4,4.3,['PG','SG']),
  p('jamal-shead-aac','Jamal Shead','Houston','aac','era4',2024,11.6,3.7,6.6,['PG']),
  p('kendric-davis-smu','Kendric Davis','SMU','aac','era4',2022,19.4,3.8,4.4,['PG','SG']),

  // MVC
  p('isiaih-mosley','Isiaih Mosley','Missouri State','mvc','era4',2022,20.4,6.2,2.3,['SG','SF']),
  p('cameron-krutwig-e4','Cameron Krutwig','Loyola Chicago','mvc','era4',2022,14.6,8.3,2.9,['C','PF']),
  p('lucas-williamson','Lucas Williamson','Loyola Chicago','mvc','era4',2022,13.8,4.5,4.0,['PG','SG']),
  p('evan-gilyard-mvc','Evan Gilyard','UTEP','mvc','era4',2022,14.8,4.5,3.5,['PG','SG']),
  p('dalton-knecht','Dalton Knecht','Northern Colorado','mvc','era4',2023,18.3,4.8,2.5,['SG','SF']),

  // MAC
  p('jaelan-sanford','Jaelan Sanford','Toledo','mac','era4',2022,24.5,4.4,3.2,['PG','SG']),
  p('darius-wade-mac','Darius Wade','Ball State','mac','era4',2022,18.8,5.5,3.8,['PG','SG']),
  p('oscar-da-silva','Oscar Da Silva','Stanford','mac','era4',2021,15.0,6.3,1.6,['PF','C']),
  p('xavier-wyatt','Xavier Wyatt','Bowling Green','mac','era4',2021,16.4,5.8,2.5,['SF','SG']),
  p('luke-loewe','Luke Loewe','William & Mary','mac','era4',2022,18.5,4.2,3.5,['SG','PG']),

  // Big Sky
  p('dillon-jones','Dillon Jones','Weber State','bigsky','era4',2023,16.2,10.2,5.4,['PF','SF']),
  p('jerrick-harding-e4','Jerrick Harding','Weber State','bigsky','era4',2022,17.5,5.2,3.5,['SG','PG']),
  p('dylan-darling','Dylan Darling','Montana State','bigsky','era4',2023,17.8,4.5,2.5,['SG','PG']),
  p('sam-lecholat','Sam Lecholat','Northern Colorado','bigsky','era4',2022,16.5,7.5,2.8,['PF','SF']),
  p('dj-horne','D.J. Horne','Nevada','bigsky','era4',2022,18.8,4.5,4.5,['PG','SG']),

  // Big South
  p('dj-burns-e4','D.J. Burns Jr.','NC State','bigsouth','era4',2024,18.4,5.4,2.4,['PF','C']),
  p('jay-heath-bs','Jay Heath','NC State','bigsouth','era4',2022,15.5,4.5,3.0,['SG','PG']),
  p('quentin-post','Quentin Post','Liberty','bigsouth','era4',2023,16.8,10.5,2.0,['C','PF']),
  p('joe-venzant','Joe Bryant Jr.','Winthrop','bigsouth','era4',2022,18.5,5.8,3.5,['SG','SF']),
  p('dj-horne-bs','D.J. Horne','High Point','bigsouth','era4',2022,20.5,4.2,3.8,['PG','SG']),

  // CAA
  p('devontae-cacok-e4','Devontae Cacok','UNCW','caa','era4',2022,17.0,10.5,1.0,['PF','C']),
  p('keshawn-justice','Keshawn Justice','College of Charleston','caa','era4',2022,16.5,5.5,3.5,['SG','SF']),
  p('raequan-battle','Raequan Battle','Towson','caa','era4',2023,17.8,5.8,2.8,['SF','SG']),
  p('cam-hayes','Cam Hayes','North Carolina A&T','caa','era4',2022,14.5,4.0,7.5,['PG']),
  p('amir-wright','Amir Wright','Northeastern','caa','era4',2022,15.5,8.5,1.5,['PF','C']),

  // Horizon
  p('damari-milstead','Damari Milstead','Cleveland State','horizon','era4',2022,20.8,5.5,3.5,['SG','PG']),
  p('michael-bradley','Michael Bradley','Milwaukee','horizon','era4',2022,16.8,9.5,1.8,['PF','C']),
  p('geno-crandall','Geno Crandall','Wright State','horizon','era4',2023,18.5,4.5,5.0,['PG','SG']),
  p('isaiah-miranda','Isaiah Miranda','IUPUI','horizon','era4',2022,15.8,10.8,1.5,['C','PF']),
  p('darius-quisenberry','Darius Quisenberry','Purdue Fort Wayne','horizon','era4',2022,23.5,4.8,4.2,['PG','SG']),

  // Ivy
  p('tommy-amaker-jr','Tommy Amaker Jr.','Harvard','ivy','era4',2022,15.8,4.5,3.8,['PG','SG']),
  p('matt-knowling','Matt Knowling','Yale','ivy','era4',2023,15.2,8.8,1.5,['C','PF']),
  p('brooklyn-bean','Brooklyn Bean','Penn','ivy','era4',2022,17.5,5.2,3.5,['SG','SF']),
  p('luke-mccaffrey','Luke McCaffrey','Princeton','ivy','era4',2022,17.5,3.5,6.5,['PG']),
  p('sam-hutcheson','Sam Hutcheson','Cornell','ivy','era4',2023,18.5,5.5,2.8,['SG','PG']),

  // MAAC
  p('taj-watson','Taj Watson','Manhattan','maac','era4',2022,16.5,4.5,3.5,['SG','PG']),
  p('nana-akenten','Nana Akenten','Iona','maac','era4',2022,16.8,4.2,3.8,['SG','PG']),
  p('shavar-reynolds','Shavar Reynolds Jr.','Iona','maac','era4',2022,16.5,3.5,3.5,['PG','SG']),
  p('jahvon-quinerly-maac','Jahvon Quinerly','Alabama','maac','era4',2022,13.8,4.8,5.2,['PG','SG']),
  p('victor-brazil','Victor Brazil','Fairfield','maac','era4',2022,20.5,8.5,1.5,['PF','C']),

  // MEAC
  p('cj-fulton-e4','C.J. Fulton','Delaware State','meac','era4',2022,17.5,4.5,3.0,['SG','PG']),
  p('shyquan-gibbs','Shyquan Gibbs','Coppin State','meac','era4',2022,18.0,5.5,3.5,['SG','PG']),
  p('nasiem-holloway','Nasiem Holloway','Morgan State','meac','era4',2023,19.5,5.8,3.5,['SG','SF']),
  p('cameron-wells','Cameron Wells','Howard','meac','era4',2022,18.5,4.2,3.5,['SG','PG']),
  p('elijah-brooks','Elijah Brooks','Hampton','meac','era4',2022,17.0,8.0,2.5,['PF','C']),

  // SWAC
  p('alvin-stredic','Alvin Stredic Jr.','Texas Southern','swac','era4',2022,22.8,7.5,2.5,['SF','PF']),
  p('john-walker-e4','John Walker III','Grambling','swac','era4',2022,19.5,6.5,4.2,['SG','PG']),
  p('jaylen-blakes','Jaylen Blakes','Prairie View','swac','era4',2023,18.5,5.5,4.5,['PG','SG']),
  p('tristan-washington','Tristan Washington','Alabama State','swac','era4',2022,18.0,5.8,3.2,['SG','SF']),
  p('michael-christmas-swac','Michael Christmas','Southern','swac','era4',2022,16.5,5.8,3.5,['SF','SG']),

  // Summit League
  p('bison-dele','Max Abmas','Oral Roberts','summit','era4',2022,27.7,4.2,3.8,['PG','SG']),
  p('ayo-akinwole','Ayo Akinwole','North Dakota State','summit','era4',2022,19.5,6.8,2.5,['SF','PF']),
  p('callie-brown','A.J. Walker','Kansas City','summit','era4',2022,20.5,5.2,3.5,['SG','PG']),
  p('matt-otto','Matt Otto','Western Illinois','summit','era4',2022,18.5,5.8,3.5,['PG','SG']),
  p('deondre-burns','Deondre Burns','South Dakota','summit','era4',2022,16.5,4.5,3.0,['SG','PG']),

  // OVC
  p('terry-taylor','Terry Taylor','Austin Peay','ovc','era4',2022,19.8,11.0,2.5,['PF','C']),
  p('dylan-windler-e4','Dylan Windler','Belmont','ovc','era4',2022,19.2,10.5,3.2,['SF','PF']),
  p('charles-bassey-ovc','Charles Bassey','WKU','ovc','era4',2022,17.5,11.5,1.5,['C','PF']),
  p('tray-boyd-e4','Tray Boyd III','Tennessee-Martin','ovc','era4',2022,22.5,4.8,5.2,['PG','SG']),
  p('jaylen-hoard-ovc','Jaylen Hoard','Wake Forest','ovc','era4',2022,14.5,9.5,1.5,['PF','C']),

  // NEC
  p('de-shawn-jackson-e4','De\'Shawn Jackson','LIU','nec','era4',2022,19.5,6.5,3.0,['SG','SF']),
  p('alex-gilkes','Alex Gilkes','Merrimack','nec','era4',2022,19.5,5.5,2.5,['SG','PG']),
  p('akuwovo-oghenekaro','Akuwovo Oghenekaro','Central Connecticut','nec','era4',2022,17.5,9.5,1.8,['PF','C']),
  p('michael-warren','Michael Warren II','FDU','nec','era4',2023,20.8,4.5,3.0,['PG','SG']),
  p('grant-stene','Grant Stene','Bryant','nec','era4',2022,15.5,5.0,2.5,['SG','SF']),

  // Patriot League
  p('colgate-walker','Nelly Cummings','Colgate','patriot','era4',2022,18.5,4.5,4.5,['PG']),
  p('austin-hill-e4','Austin Hill','Army','patriot','era4',2022,19.5,5.5,3.5,['SG','PG']),
  p('james-karnik','James Karnik','Lehigh','patriot','era4',2022,16.5,9.5,1.5,['C','PF']),
  p('boston-cross','Boston Cross','Bucknell','patriot','era4',2022,18.5,5.8,3.0,['SG','SF']),
  p('amer-hrustanovic','Amer Hrustanovic','Holy Cross','patriot','era4',2022,17.5,4.5,3.5,['PG','SG']),

  // Southern Conference
  p('malachi-smith','Malachi Smith','Chattanooga','southern','era4',2022,21.5,4.5,4.5,['PG','SG']),
  p('hunter-mcintosh','Hunter McIntosh','ETSU','southern','era4',2022,15.5,4.5,6.5,['PG']),
  p('trevor-john','Trevor John','Western Carolina','southern','era4',2023,18.5,5.5,3.5,['SG','SF']),
  p('jacob-grandison-soc','Jacob Grandison','VMI','southern','era4',2022,16.5,5.5,2.5,['SF','SG']),
  p('vance-jackson','Vance Jackson','Furman','southern','era4',2023,17.5,5.5,2.5,['SF','SG']),

  // Southland
  p('cobe-durant-e4','Cobe Durant','Southeastern Louisiana','southland','era4',2022,22.0,5.5,3.5,['SG','SF']),
  p('reggie-miller-sl','Reggie Miller Jr.','Lamar','southland','era4',2022,18.5,5.5,3.5,['SG','PG']),
  p('jabari-rice','Jabari Rice','New Mexico State','southland','era4',2022,16.5,5.5,3.5,['SG','SF']),
  p('jayden-epps-sl','Jayden Epps','McNeese','southland','era4',2022,17.5,4.5,4.5,['PG','SG']),
  p('ray-harrison','Ray Harrison','Incarnate Word','southland','era4',2022,18.0,5.0,2.5,['SG','PG']),

  // WAC
  p('max-abmas-wac','Max Abmas','Oral Roberts','wac','era4',2022,27.7,4.2,3.8,['PG','SG']),
  p('marvin-coleman','Marvin Coleman','CSU Bakersfield','wac','era4',2022,18.5,8.5,2.5,['PF','C']),
  p('carlos-johnson-wac4','Carlos Johnson','New Mexico State','wac','era4',2022,17.8,5.8,4.2,['PF','SF']),
  p('rahyme-johnson','Rahyme Johnson','Tarleton State','wac','era4',2023,20.5,5.5,3.5,['SG','SF']),
  p('george-polk','George Polk','Utah Valley','wac','era4',2022,17.5,4.8,3.5,['SG','PG']),

  // Big West
  p('lamine-diane-e4','Lamine Diane','CSU Northridge','bigwest','era4',2022,19.5,8.0,2.5,['SF','PF']),
  p('max-heidegger-e4','Max Heidegger','UC Santa Barbara','bigwest','era4',2022,15.5,5.5,5.5,['PG','SG']),
  p('chance-mcnaughton','Chance McNaughton','Cal Poly','bigwest','era4',2022,16.5,8.5,2.0,['PF','C']),
  p('matty-hurt','Matty Hurt','UC Riverside','bigwest','era4',2023,18.5,4.5,2.5,['SF','SG']),
  p('david-singleton','David Singleton','Long Beach State','bigwest','era4',2022,15.5,3.5,4.5,['PG','SG']),

  // ASUN
  p('terry-roberts-asun','Terry Roberts','North Alabama','asun','era4',2022,18.5,5.5,5.5,['PG','SG']),
  p('dj-gordon','D.J. Gordon','Kennesaw State','asun','era4',2023,20.5,4.5,3.5,['SG','SF']),
  p('quentin-post-asun','Quentin Post','Liberty','asun','era4',2023,16.8,10.5,2.0,['C','PF']),
  p('rob-robinson-asun','Rob Robinson','Eastern Kentucky','asun','era4',2022,19.5,5.5,3.5,['SG','SF']),
  p('derek-young','Derek Young','North Florida','asun','era4',2022,16.5,4.5,4.5,['PG','SG']),

  // Sun Belt
  p('izaiah-arenas','Izaiah Arenas','Louisiana Lafayette','sunbelt','era4',2022,18.5,4.5,5.5,['PG','SG']),
  p('michael-green','Michael Green III','UAB','sunbelt','era4',2022,18.0,4.5,3.5,['SG','SF']),
  p('annor-boateng','Annor Boateng','Coastal Carolina','sunbelt','era4',2022,17.5,9.5,1.5,['PF','C']),
  p('tyrell-ward','Tyrell Ward','Georgia State','sunbelt','era4',2022,16.5,6.5,2.5,['SF','PF']),
  p('jay-sheppard','Jay Sheppard','Arkansas State','sunbelt','era4',2023,19.5,4.5,3.5,['SG','PG']),

  // C-USA
  p('kevin-cross-cusa','Kevin Cross','LA Tech','cusa','era4',2022,14.5,9.5,1.5,['PF','C']),
  p('darius-perkins-e4','Darius Perkins','UTEP','cusa','era4',2022,17.5,5.5,4.5,['PG','SG']),
  p('donnie-toney','Donnie Toney','Middle Tennessee','cusa','era4',2022,17.5,6.5,2.5,['SF','PF']),
  p('keshawn-williams','Keshawn Williams','Marshall','cusa','era4',2022,16.5,5.5,2.5,['SG','SF']),
  p('michael-flowers-cusa','Michael Flowers','WKU','cusa','era4',2022,17.5,5.5,3.5,['SG','SF']),

  // ─── ERA 2 additional depth ───────────────────────────────────────────────

  // ACC era2
  p('seth-curry','Seth Curry','Duke','acc','era2',2013,17.5,3.4,3.0,['SG','PG']),
  p('rasheed-sulaimon','Rasheed Sulaimon','Duke','acc','era2',2015,13.3,3.9,2.7,['SG','PG']),
  p('rondae-hollis-jefferson','Rondae Hollis-Jefferson','Arizona','acc','era2',2015,12.3,7.2,2.0,['SF','PF']),
  p('lamar-patterson','Lamar Patterson','Pittsburgh','acc','era2',2014,17.0,5.0,4.1,['SG','PG']),
  p('marcus-georges-hunt','Marcus Georges-Hunt','Georgia Tech','acc','era2',2015,16.7,4.3,2.5,['SG','SF']),
  p('joe-harris','Joe Harris','Virginia','acc','era2',2014,15.6,4.7,2.5,['SG','SF']),

  // Big East era2
  p('idris-taqqee','Idris Taqqee','Seton Hall','bigeast','era2',2014,14.5,4.5,2.8,['SG','SF']),
  p('angel-delgado','Angel Delgado','Seton Hall','bigeast','era2',2018,14.5,13.4,1.4,['C','PF']),
  p('kene-nwuba','Kene Nwuba','Xavier','bigeast','era2',2013,11.2,8.3,1.1,['C','PF']),
  p('myles-mack-be','Myles Mack','Rutgers','bigeast','era2',2015,14.5,4.2,4.8,['PG','SG']),
  p('geron-johnson','Geron Johnson','Memphis','bigeast','era2',2014,12.3,5.2,3.8,['SG','PG']),

  // Big Ten era2
  p('yogi-ferrell','Yogi Ferrell','Indiana','big10','era2',2016,18.0,3.0,5.0,['PG']),
  p('troy-williams-ind','Troy Williams','Indiana','big10','era2',2016,12.5,7.1,2.0,['SF','PF']),
  p('bryn-forbes','Bryn Forbes','Michigan State','big10','era2',2016,17.0,3.3,3.5,['SG','PG']),
  p('denzel-valentine','Denzel Valentine','Michigan State','big10','era2',2016,19.2,7.5,7.8,['SF','SG']),
  p('rasheed-thurston','Rasheed Thurston','Wright State','big10','era2',2013,17.5,3.5,3.8,['PG','SG']),
  p('nigel-hayes','Nigel Hayes','Wisconsin','big10','era2',2017,15.8,6.0,2.5,['PF','SF']),
  p('jordan-morgan','Jordan Morgan','Michigan','big10','era2',2013,8.8,6.5,1.1,['C','PF']),

  // SEC era2
  p('james-blackmon-jr','James Blackmon Jr.','Indiana','sec','era2',2015,15.4,4.0,2.2,['SG','PG']),
  p('darius-miller-sec2','Darius Miller','Kentucky','sec','era2',2012,12.8,4.4,3.0,['SF','SG']),
  p('james-young-uk','James Young','Kentucky','sec','era2',2014,14.0,5.8,1.5,['SG','SF']),
  p('willie-cauley-stein','Willie Cauley-Stein','Kentucky','sec','era2',2015,8.9,7.0,0.9,['C']),
  p('terrance-jones','Terrance Jones','Kentucky','sec','era2',2012,11.5,8.3,1.7,['PF','SF']),
  p('nick-king','Nick King','Middle Tennessee','sec','era2',2013,17.8,8.5,1.5,['SF','PF']),
  p('patric-young-e2','Patric Young','Florida','sec','era2',2014,11.2,7.7,1.3,['C','PF']),

  // Big 12 era2
  p('wayne-selden','Wayne Selden Jr.','Kansas','big12','era2',2015,12.3,3.0,2.0,['SG','SF']),
  p('jamari-traylor','Jamari Traylor','Kansas','big12','era2',2015,5.9,6.2,1.0,['PF','C']),
  p('le-bryan-nash','LeBryan Nash','Oklahoma State','big12','era2',2014,15.6,5.9,2.4,['SF','PF']),
  p('keiton-page','Keiton Page','Oklahoma State','big12','era2',2012,17.3,3.2,2.8,['PG','SG']),
  p('melvin-ejim','Melvin Ejim','Iowa State','big12','era2',2014,18.3,8.9,1.9,['SF','PF']),
  p('monte-morris','Monte Morris','Iowa State','big12','era2',2017,13.4,5.1,5.5,['PG']),
  p('dustin-hogue','Dustin Hogue','Iowa State','big12','era2',2015,12.3,9.8,1.1,['PF','SF']),

  // Pac-12 era2
  p('kyle-wiltjer-pac','Kyle Wiltjer','Gonzaga','pac12','era2',2015,16.8,6.2,1.9,['PF','SF']),
  p('kameron-rooks','Kameron Rooks','Colorado','pac12','era2',2014,12.2,9.1,1.2,['C','PF']),
  p('jalen-adams-pac','Jalen Adams','UConn','pac12','era2',2018,17.6,3.5,4.0,['PG','SG']),
  p('isaiah-thomas-pac','Isaiah Thomas','Washington','pac12','era2',2011,17.3,3.0,4.6,['PG']),
  p('ryan-kelly-duke','Ryan Kelly','Duke','pac12','era2',2013,12.9,4.8,2.2,['SF','PF']),
  p('jorge-gutierrez','Jorge Gutierrez','Cal','pac12','era2',2012,13.6,3.5,5.5,['PG']),

  // ─── ERA 3 additional depth ───────────────────────────────────────────────

  // ACC era3
  p('ty-jerome','Ty Jerome','Virginia','acc','era3',2019,13.6,4.2,5.0,['PG','SG']),
  p('kyle-guy','Kyle Guy','Virginia','acc','era3',2019,13.1,3.0,2.5,['SG','PG']),
  p('garrison-brooks','Garrison Brooks','UNC','acc','era3',2020,16.8,8.5,1.7,['PF','C']),
  p('eric-ayala','Eric Ayala','Maryland','acc','era3',2021,15.3,3.5,3.5,['SG','PG']),
  p('terence-davis-ole','Terence Davis II','Ole Miss','acc','era3',2019,15.3,5.8,2.5,['SG','SF']),
  p('matthew-hurt-acc3','Matthew Hurt','Duke','acc','era3',2021,15.3,5.8,1.7,['PF','SF']),
  p('torrence-watson','Torrence Watson','Marquette','acc','era3',2020,11.0,4.5,3.5,['SG','PG']),

  // Big East era3
  p('eric-paschall','Eric Paschall','Villanova','bigeast','era3',2019,17.1,6.7,1.5,['PF','SF']),
  p('saddiq-bey','Saddiq Bey','Villanova','bigeast','era3',2020,16.1,5.0,2.3,['SF','SG']),
  p('collin-gillespie','Collin Gillespie','Villanova','bigeast','era3',2021,14.6,3.0,4.2,['PG','SG']),
  p('rj-cole','R.J. Cole','UConn','bigeast','era3',2020,14.5,3.8,4.5,['PG','SG']),
  p('kofi-cockburn-e3','Kofi Cockburn','Illinois','bigeast','era3',2022,21.1,10.6,0.9,['C']),
  p('creighton-ballock','Ryan Hawkins','Creighton','bigeast','era3',2021,13.5,7.5,1.5,['PF','SF']),

  // Big Ten era3
  p('zavier-simpson','Zavier Simpson','Michigan','big10','era3',2020,11.3,4.3,6.1,['PG']),
  p('jon-teske','Jon Teske','Michigan','big10','era3',2020,10.9,7.5,1.6,['C']),
  p('immanuel-quickley-b10','Immanuel Quickley','Kentucky','big10','era3',2020,16.1,3.3,2.8,['SG','PG']),
  p('trent-frazier','Trent Frazier','Illinois','big10','era3',2021,11.0,3.0,3.3,['PG','SG']),
  p('yogi-ferrell-b10','Yogi Ferrell','Indiana','big10','era3',2016,18.0,3.0,5.0,['PG']),
  p('bryn-forbes-b10','Bryn Forbes','Michigan State','big10','era3',2016,17.0,3.3,3.5,['SG','PG']),
  p('denzel-valentine','Denzel Valentine','Michigan State','big10','era3',2016,19.2,7.5,7.8,['SF','SG']),

  // SEC era3
  p('immanuel-quickley','Immanuel Quickley','Kentucky','sec','era3',2020,16.1,3.3,2.8,['SG','PG']),
  p('keion-brooks','Keion Brooks Jr.','Kentucky','sec','era3',2022,14.1,6.6,1.8,['SF','PF']),
  p('armando-bacot-e3','Armando Bacot','UNC','sec','era3',2021,12.0,9.1,0.8,['C','PF']),
  p('jd-notae','JD Notae','Arkansas','sec','era3',2022,18.6,4.6,3.8,['SG','PG']),
  p('darious-hall','Darious Hall','Georgia','sec','era3',2021,12.5,7.5,1.5,['PF','SF']),
  p('jeremiah-tilmon','Jeremiah Tilmon','Missouri','sec','era3',2020,12.2,6.6,0.8,['C','PF']),

  // Big 12 era3
  p('devon-dotson','Devon Dotson','Kansas','big12','era3',2020,18.1,4.0,3.9,['PG']),
  p('cade-cunningham','Cade Cunningham','Oklahoma State','big12','era3',2021,20.1,6.2,3.5,['PG','SF']),
  p('monte-morris-e3','Monte Morris','Iowa State','big12','era3',2017,13.4,5.1,5.5,['PG']),
  p('matthew-mayer','Matthew Mayer','Baylor','big12','era3',2020,9.0,5.5,1.0,['SF','PF']),
  p('jalen-suggs-big12','Jalen Suggs','Gonzaga','big12','era3',2021,14.4,5.3,4.5,['PG','SG']),
  p('rj-hampton','RJ Hampton','New Zealand Breakers','big12','era3',2020,0.0,0.0,0.0,['PG','SG']),

  // Pac-12 era3
  p('caleb-martin-pac','Caleb Martin','Nevada','pac12','era3',2019,18.9,7.4,2.9,['SF','SG']),
  p('matisse-thybulle','Matisse Thybulle','Washington','pac12','era3',2019,10.4,5.4,2.9,['SF','SG']),
  p('eli-nilsson','Onyeka Okongwu','USC','pac12','era3',2020,16.2,8.6,2.1,['C','PF']),
  p('sabrina-ionescu-bro','LJ Figueroa','Oregon','pac12','era3',2020,17.6,6.4,2.5,['SF','SG']),
  p('chris-boucher','Chris Boucher','Oregon','pac12','era3',2016,10.8,7.8,0.8,['PF','C']),
  p('jarrod-uthoff','Jordan Bell','Oregon','pac12','era3',2017,7.1,7.2,2.5,['PF','C']),

  // ─── ERA 4 additional depth ───────────────────────────────────────────────

  // ACC era4
  p('kyle-filipowski','Kyle Filipowski','Duke','acc','era4',2024,16.4,8.8,3.2,['PF','C']),
  p('mark-williams-d','Mark Williams','Duke','acc','era4',2022,13.0,8.1,0.8,['C']),
  p('matthew-hurt-e4','Matthew Hurt','Duke','acc','era4',2021,15.3,5.8,1.7,['PF','SF']),
  p('brice-sensabaugh','Brice Sensabaugh','Ohio State','acc','era4',2023,16.3,4.5,1.5,['SF','SG']),
  p('rj-davis-unc','RJ Davis','UNC','acc','era4',2024,21.0,4.0,3.8,['SG','PG']),
  p('garrison-brooks-e4','Garrison Brooks','UNC','acc','era4',2022,11.2,6.8,1.3,['PF','C']),
  p('pj-hall-clem','PJ Hall','Clemson','acc','era4',2024,18.6,6.5,2.3,['PF','C']),

  // Big East era4
  p('eric-dixon','Eric Dixon','Villanova','bigeast','era4',2024,20.5,8.2,1.9,['PF','C']),
  p('jordan-longino','Jordan Longino','Villanova','bigeast','era4',2024,15.6,4.8,3.5,['SG','SF']),
  p('marcus-foster','Marcus Foster','Creighton','bigeast','era4',2021,18.3,4.1,2.5,['SG','PG']),
  p('ryan-kalkbrenner','Ryan Kalkbrenner','Creighton','bigeast','era4',2023,13.5,7.2,1.3,['C']),
  p('al-durr','Al Durham','Providence','bigeast','era4',2022,12.3,4.5,3.2,['SG','PG']),

  // Big Ten era4
  p('trayce-jackson-davis','Trayce Jackson-Davis','Indiana','big10','era4',2023,20.1,10.7,3.0,['C','PF']),
  p('ej-liddell','E.J. Liddell','Ohio State','big10','era4',2022,19.4,7.9,2.6,['PF','SF']),
  p('ron-harper-jr','Ron Harper Jr.','Rutgers','big10','era4',2022,15.8,5.5,3.1,['SG','SF']),
  p('dylan-harper','Dylan Harper','Rutgers','big10','era4',2025,19.2,4.2,5.3,['PG','SG']),
  p('ace-bailey','Ace Bailey','Rutgers','big10','era4',2025,16.9,7.3,1.8,['SF','PF']),
  p('braden-smith','Braden Smith','Purdue','big10','era4',2024,11.0,5.8,7.6,['PG']),
  p('aj-hoggard','A.J. Hoggard','Michigan State','big10','era4',2023,12.5,3.5,6.2,['PG']),

  // SEC era4
  p('brandon-miller-ala','Brandon Miller','Alabama','sec','era4',2023,18.8,8.2,2.1,['SF','SG']),
  p('johni-broome','Johni Broome','Auburn','sec','era4',2025,18.6,10.5,2.0,['C','PF']),
  p('reed-sheppard','Reed Sheppard','Kentucky','sec','era4',2024,14.1,4.8,4.5,['SG','PG']),
  p('jd-notae-e4','JD Notae','Arkansas','sec','era4',2022,18.6,4.6,3.8,['SG','PG']),
  p('keyontae-johnson-ksu','Keyontae Johnson','Kansas State','sec','era4',2023,17.0,8.1,2.3,['SF','PF']),
  p('nick-honor','Nick Honor','Clemson','sec','era4',2022,13.8,3.5,4.5,['PG','SG']),
  p('jt-thor','J.T. Thor','Auburn','sec','era4',2022,10.3,5.7,1.3,['PF','SF']),

  // Big 12 era4
  p('hunter-dickinson-ku','Hunter Dickinson','Kansas','big12','era4',2024,17.9,10.5,1.7,['C','PF']),
  p('lj-cryer','L.J. Cryer','Houston','big12','era4',2024,18.1,2.9,2.1,['SG','PG']),
  p('cade-cunningham-e4','Cade Cunningham','Oklahoma State','big12','era4',2021,20.1,6.2,3.5,['PG','SF']),
  p('kevin-mccullar','Kevin McCullar Jr.','Kansas','big12','era4',2023,12.0,5.3,3.2,['SG','SF']),
  p('jalen-wilson-ku','Jalen Wilson','Kansas','big12','era4',2023,20.1,8.3,3.2,['SF','PF']),

  // Pac-12 era4
  p('caleb-love-ariz','Caleb Love','Arizona','pac12','era4',2023,19.1,4.0,2.9,['SG','PG']),
  p('kyle-filipowski-pac','Kyle Filipowski','Duke','pac12','era4',2024,16.4,8.8,3.2,['PF','C']),
  p('amari-bailey','Amari Bailey','UCLA','pac12','era4',2023,12.1,4.0,2.6,['SG','SF']),
  p('lonnie-walker-iv','Lonnie Walker IV','Texas','pac12','era4',2021,13.2,3.5,1.7,['SG','SF']),
  p('onyeka-okongwu','Onyeka Okongwu','USC','pac12','era4',2021,16.2,8.6,2.1,['C','PF']),
]

export function getPlayers(conferenceId, eraId) {
  return ALL_PLAYERS.filter(player => player.conference === conferenceId && player.era === eraId)
}
