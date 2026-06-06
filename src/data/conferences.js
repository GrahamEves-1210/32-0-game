export const ERAS = [
  { id: 'era1', label: '2005–2010', short: '05–10', start: 2005, end: 2010, static: true },
  { id: 'era2', label: '2011–2015', short: '11–15', start: 2011, end: 2015, static: true },
  { id: 'era3', label: '2016–2020', short: '16–20', start: 2016, end: 2020, static: true },
  { id: 'era4', label: '2021–2024', short: '21–24', start: 2021, end: 2024, static: true },
  { id: 'era5', label: '2025–2026', short: '25–26', start: 2025, end: 2026, static: false },
]

// A = major (blue) · B = mid-major (green) · C = low-major (gold)
export const GRADE_COLORS = { A: '#103de0', B: '#22c55e', C: '#e0a800' }
export const GRADE_MULTIPLIERS = { A: 1.0, B: 0.92, C: 0.84 }

export function getGradeColor(grade) {
  return GRADE_COLORS[grade] || '#888888'
}

export const CONFERENCES = [
  {
    id: 'acc', name: 'ACC', fullName: 'Atlantic Coast Conference', grade: 'A', color: '#003087',
    schools: ['Duke','North Carolina','NC State','Virginia','Virginia Tech','Syracuse','Miami FL','Florida State','Georgia Tech','Wake Forest','Clemson','Louisville','Pittsburgh','Boston College','Notre Dame'],
  },
  {
    id: 'bigeast', name: 'Big East', fullName: 'Big East Conference', grade: 'A', color: '#002147',
    schools: ['UConn','Villanova','Georgetown','Marquette','St. John\'s','Seton Hall','Creighton','Providence','Xavier','Butler','DePaul'],
  },
  {
    id: 'big10', name: 'Big Ten', fullName: 'Big Ten Conference', grade: 'A', color: '#0066cc',
    schools: ['Michigan','Michigan State','Indiana','Illinois','Ohio State','Purdue','Wisconsin','Iowa','Minnesota','Northwestern','Penn State','Nebraska','Maryland','Rutgers','UCLA','USC'],
  },
  {
    id: 'sec', name: 'SEC', fullName: 'Southeastern Conference', grade: 'A', color: '#003399',
    schools: ['Kentucky','Tennessee','Florida','LSU','Alabama','Auburn','Arkansas','Georgia','Mississippi State','Ole Miss','South Carolina','Missouri','Vanderbilt','Texas A&M','Texas'],
  },
  {
    id: 'big12', name: 'Big 12', fullName: 'Big 12 Conference', grade: 'A', color: '#003366',
    schools: ['Kansas','Baylor','Oklahoma','Texas','Texas Tech','Oklahoma State','Iowa State','Kansas State','TCU','West Virginia','Houston','Cincinnati'],
  },
  {
    id: 'pac12', name: 'Pac-12', fullName: 'Pac-12 Conference', grade: 'A', color: '#1a5276',
    schools: ['UCLA','Arizona','Oregon','Washington','USC','Stanford','Utah','Arizona State','Oregon State','Colorado','Washington State','Cal'],
  },
  {
    id: 'mwc', name: 'Mountain West', fullName: 'Mountain West Conference', grade: 'B', color: '#003087',
    schools: ['San Diego State','UNLV','Utah State','Nevada','Boise State','New Mexico','Colorado State','Wyoming','Fresno State','Air Force','Hawaii','San Jose State'],
  },
  {
    id: 'aac', name: 'American', fullName: 'American Athletic Conference', grade: 'B', color: '#002d72',
    schools: ['Memphis','Houston','Cincinnati','UCF','Wichita State','Temple','Tulsa','South Florida','Tulane','East Carolina','Rice'],
  },
  {
    id: 'a10', name: 'Atlantic 10', fullName: 'Atlantic 10 Conference', grade: 'B', color: '#003087',
    schools: ['Dayton','VCU','Saint Louis','Richmond','George Mason','Davidson','UMass','Rhode Island','Fordham','George Washington','La Salle','Saint Joseph\'s','Duquesne'],
  },
  {
    id: 'wcc', name: 'WCC', fullName: 'West Coast Conference', grade: 'B', color: '#003087',
    schools: ['Gonzaga','BYU','Saint Mary\'s','San Francisco','Loyola Marymount','Santa Clara','Portland','Pacific','Pepperdine'],
  },
  {
    id: 'mvc', name: 'Missouri Valley', fullName: 'Missouri Valley Conference', grade: 'B', color: '#003087',
    schools: ['Illinois State','Loyola Chicago','Drake','Bradley','Indiana State','Northern Iowa','Missouri State','Valparaiso','Southern Illinois','Evansville'],
  },
  {
    id: 'ivy', name: 'Ivy League', fullName: 'Ivy League', grade: 'B', color: '#8B0000',
    schools: ['Princeton','Penn','Yale','Harvard','Columbia','Cornell','Dartmouth','Brown'],
  },
  {
    id: 'mac', name: 'MAC', fullName: 'Mid-American Conference', grade: 'C', color: '#003087',
    schools: ['Toledo','Ball State','Western Michigan','Bowling Green','Ohio','Miami OH','Kent State','Northern Illinois','Central Michigan','Eastern Michigan','Akron','Buffalo'],
  },
  {
    id: 'sunbelt', name: 'Sun Belt', fullName: 'Sun Belt Conference', grade: 'C', color: '#003087',
    schools: ['Louisiana','Arkansas State','South Alabama','Georgia Southern','Troy','App State','Georgia State','Old Dominion','Marshall','Southern Miss','Texas State'],
  },
  {
    id: 'cusa', name: 'C-USA', fullName: 'Conference USA', grade: 'C', color: '#003087',
    schools: ['UTEP','UAB','Louisiana Tech','North Texas','Rice','FIU','Middle Tennessee','Western Kentucky','Charlotte','Marshall'],
  },
  {
    id: 'bigsky', name: 'Big Sky', fullName: 'Big Sky Conference', grade: 'C', color: '#003087',
    schools: ['Montana','Montana State','Weber State','Eastern Washington','Northern Arizona','Idaho','Idaho State','Portland State','Northern Colorado','Sacramento State','Southern Utah'],
  },
  {
    id: 'bigsouth', name: 'Big South', fullName: 'Big South Conference', grade: 'C', color: '#003087',
    schools: ['Winthrop','Gardner-Webb','High Point','Presbyterian','Radford','Longwood','UNC Asheville','Charleston Southern','Campbell','Bryant'],
  },
  {
    id: 'caa', name: 'CAA', fullName: 'Coastal Athletic Association', grade: 'C', color: '#003087',
    schools: ['William & Mary','Delaware','Drexel','Hofstra','JMU','Northeastern','UNCW','Towson','Elon','Hampton','Monmouth','Stony Brook'],
  },
  {
    id: 'horizon', name: 'Horizon', fullName: 'Horizon League', grade: 'C', color: '#003087',
    schools: ['Wright State','Cleveland State','Detroit Mercy','Green Bay','Illinois-Chicago','IUPUI','Milwaukee','Oakland','Youngstown State','Robert Morris','Northern Kentucky'],
  },
  {
    id: 'maac', name: 'MAAC', fullName: 'Metro Atlantic Athletic Conference', grade: 'C', color: '#003087',
    schools: ['Iona','Rider','Fairfield','Canisius','Niagara','Quinnipiac','Manhattan','St. Peter\'s','Monmouth','Siena'],
  },
  {
    id: 'meac', name: 'MEAC', fullName: 'Mid-Eastern Athletic Conference', grade: 'C', color: '#003087',
    schools: ['Howard','Morgan State','Hampton','Bethune-Cookman','Delaware State','Florida A&M','NCCU','Norfolk State','SC State','Coppin State'],
  },
  {
    id: 'swac', name: 'SWAC', fullName: 'Southwestern Athletic Conference', grade: 'C', color: '#003087',
    schools: ['Grambling','Southern','Prairie View A&M','Texas Southern','Alabama A&M','Alabama State','Alcorn State','Arkansas-Pine Bluff','Jackson State','Mississippi Valley State'],
  },
  {
    id: 'summit', name: 'Summit', fullName: 'Summit League', grade: 'C', color: '#003087',
    schools: ['South Dakota State','South Dakota','North Dakota State','North Dakota','Denver','Oral Roberts','Omaha','Kansas City','Western Illinois','St. Thomas'],
  },
  {
    id: 'ovc', name: 'Ohio Valley', fullName: 'Ohio Valley Conference', grade: 'C', color: '#003087',
    schools: ['Murray State','Belmont','Tennessee Tech','Austin Peay','SIUE','Southern Indiana','Tennessee State','Eastern Illinois','Morehead State','Tennessee-Martin'],
  },
  {
    id: 'nec', name: 'NEC', fullName: 'Northeast Conference', grade: 'C', color: '#003087',
    schools: ['Bryant','Central Connecticut','Fairleigh Dickinson','LIU','Merrimack','Sacred Heart','St. Francis PA','Wagner','Mount St. Mary\'s'],
  },
  {
    id: 'patriot', name: 'Patriot', fullName: 'Patriot League', grade: 'C', color: '#003087',
    schools: ['Lehigh','Bucknell','Lafayette','Colgate','Army','Navy','Boston University','American','Holy Cross','Loyola MD'],
  },
  {
    id: 'southern', name: 'Southern', fullName: 'Southern Conference', grade: 'C', color: '#003087',
    schools: ['Furman','Wofford','Mercer','The Citadel','Samford','VMI','Western Carolina','East Tennessee State','UNC Greensboro','ETSU'],
  },
  {
    id: 'southland', name: 'Southland', fullName: 'Southland Conference', grade: 'C', color: '#003087',
    schools: ['Stephen F. Austin','Sam Houston State','Northwestern State','Lamar','McNeese','New Orleans','Southeastern Louisiana','Houston Baptist','Incarnate Word'],
  },
  {
    id: 'wac', name: 'WAC', fullName: 'Western Athletic Conference', grade: 'C', color: '#003087',
    schools: ['Grand Canyon','Utah Valley','New Mexico State','Seattle','Cal Baptist','Tarleton State','UT Arlington','Sam Houston','Southern Utah','Texas A&M-CC'],
  },
  {
    id: 'bigwest', name: 'Big West', fullName: 'Big West Conference', grade: 'C', color: '#003087',
    schools: ['Long Beach State','UC Irvine','UC Santa Barbara','Hawaii','Cal Poly','UC Davis','Cal State Fullerton','Cal State Northridge','UC San Diego','UC Riverside'],
  },
  {
    id: 'asun', name: 'ASUN', fullName: 'ASUN Conference', grade: 'C', color: '#003087',
    schools: ['Liberty','Bellarmine','Eastern Kentucky','Florida Gulf Coast','Jacksonville','Kennesaw State','Lipscomb','North Alabama','Northern Kentucky','Queens','Stetson','UNF','Austin Peay'],
  },
]
