import { FacultyMember } from '../types';

export const FACULTY_MEMBERS: FacultyMember[] = [
  {
    codeName: 'MEH',
    name: 'Dr. Md. Elias Hossain',
    designation: 'Professor',
    department: 'Department of Economics',
    courses: ['ECO 1101', 'ECO 1102'],
    primaryRoom: 'Room 810 / 811',
    email: 'elias.hossain@dept.edu',
    phone: '01730406516'
  },
  {
    codeName: 'AGO',
    name: 'Md. Ataul Gani Osmani',
    designation: 'Professor',
    department: 'Department of Economics',
    courses: ['ECO 1102'],
    primaryRoom: 'Room 810 / 811',
    email: 'ataul.osmani@dept.edu',
    phone: '01719193787'
  },
  {
    codeName: 'RI',
    name: 'Md. Rakibul Islam',
    designation: 'Lecturer',
    department: 'Department of Economics',
    courses: ['ECO 1101'],
    primaryRoom: 'Room 504 / 908',
    email: 'rakibul.islam@dept.edu',
    phone: '01723543683'
  },
  {
    codeName: 'MAS',
    name: 'Md. Abdus Sobhan',
    designation: 'Associate Professor',
    department: 'Department of Economics',
    courses: ['ECO 1104', 'ECO 1105'],
    primaryRoom: 'Room 908 / 909',
    email: 'abdus.sobhan@dept.edu',
    phone: '01751362310'
  },
  {
    codeName: 'WU',
    name: 'Wazahat Ullah',
    designation: 'Lecturer',
    department: 'Department of Economics',
    courses: ['ECO 1103', 'ECO 1104'],
    primaryRoom: 'Room 504 / 909',
    email: 'wazahat.ullah@dept.edu',
    phone: '01813872032'
  },
  {
    codeName: 'SA',
    name: 'Md. Shamsul Alam',
    designation: 'Associate Professor',
    department: 'Department of Economics',
    courses: ['ECO 1105'],
    primaryRoom: 'Room 909',
    email: 'shamsul.alam@dept.edu',
    phone: '01303482612'
  },
  {
    codeName: 'HIA',
    name: 'Hasin Israque Aornob',
    designation: 'Lecturer',
    department: 'Department of Economics',
    courses: ['ECO 1101', 'ECO 1103'],
    primaryRoom: 'Room 504 / 810',
    email: 'hasin.aornob@dept.edu',
    phone: '01701005539'
  },
  {
    codeName: 'NHB',
    name: 'Mst. Nur Hasna Banu',
    designation: 'Assistant Professor',
    department: 'Department of Economics',
    courses: ['ECO 1103'],
    primaryRoom: 'Room 504 / 908',
    email: 'nur.hasna@dept.edu',
    phone: '01785281505'
  }
];

export const TEACHER_CODENAMES: Record<string, string> = {
  'Dr. Md. Elias Hossain': 'MEH',
  'Md. Elias Hossain': 'MEH',
  'Elias Hossain': 'MEH',
  'Md. Ataul Gani Osmani': 'AGO',
  'Ataul Gani Osmani': 'AGO',
  'Md. Rakibul Islam': 'RI',
  'Rakibul Islam': 'RI',
  'Md. Abdus Sobhan': 'MAS',
  'Abdus Sobhan': 'MAS',
  'Wazahat Ullah': 'WU',
  'Md. Shamsul Alam': 'SA',
  'Shamsul Alam': 'SA',
  'Hasin Israque Aornob': 'HIA',
  'Hasin Israque': 'HIA',
  'Mst. Nur Hasna Banu': 'NHB',
  'Nur Hasna Banu': 'NHB',
  'Md. Asduzzaman Kiron': 'MAK',
  'Asduzzaman Kiron': 'MAK',
};

export function getTeacherShortName(name: string): string {
  if (!name) return '';
  const trimmed = name.trim();
  if (TEACHER_CODENAMES[trimmed]) return TEACHER_CODENAMES[trimmed];
  
  // Case-insensitive lookup
  for (const [fullName, code] of Object.entries(TEACHER_CODENAMES)) {
    if (trimmed.toLowerCase() === fullName.toLowerCase()) {
      return code;
    }
  }

  // Partial substring matching
  for (const [fullName, code] of Object.entries(TEACHER_CODENAMES)) {
    if (trimmed.toLowerCase().includes(fullName.toLowerCase()) || fullName.toLowerCase().includes(trimmed.toLowerCase())) {
      return code;
    }
  }

  // Match from FACULTY_MEMBERS list
  const foundFac = FACULTY_MEMBERS.find(f => 
    f.name.toLowerCase().includes(trimmed.toLowerCase()) || 
    trimmed.toLowerCase().includes(f.name.toLowerCase()) ||
    f.codeName.toLowerCase() === trimmed.toLowerCase()
  );
  if (foundFac) return foundFac.codeName;

  return trimmed;
}

export interface RoomGuide {
  roomNumber: string;
  floor: string;
  building: string;
  wing: string;
  capacity: string;
  notes: string;
}

export const ROOM_GUIDE: Record<string, RoomGuide> = {
  '504': {
    roomNumber: '504',
    floor: '5th Floor',
    building: 'Academic Building 1',
    wing: 'West Wing',
    capacity: '60 seats',
    notes: 'Used for Sunday ECO 1103 & ECO 1101 classes.'
  },
  '810': {
    roomNumber: '810',
    floor: '8th Floor',
    building: 'Academic Building 1',
    wing: 'East Wing',
    capacity: '50 seats',
    notes: 'Used for Thursday ECO 1102 Macroeconomics I class.'
  },
  '811': {
    roomNumber: '811',
    floor: '8th Floor',
    building: 'Academic Building 1',
    wing: 'East Wing',
    capacity: '55 seats',
    notes: 'Used for Wednesday ECO 1102 Macroeconomics I class.'
  },
  '908': {
    roomNumber: '908',
    floor: '9th Floor',
    building: 'Academic Building 1',
    wing: 'Central Wing',
    capacity: '65 seats',
    notes: 'Used for Monday ECO 1103, Tuesday ECO 1101, Thursday ECO 1104.'
  },
  '909': {
    roomNumber: '909',
    floor: '9th Floor',
    building: 'Academic Building 1',
    wing: 'Central Wing',
    capacity: '65 seats',
    notes: 'Used for Monday ECO 1104, Tuesday & Wednesday ECO 1105.'
  }
};
