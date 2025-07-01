import * as FileSystem from 'expo-file-system';

const CDB_PATH = FileSystem.documentDirectory + 'data.cdb.json';

type Session = {
  rr_rate: string;
  rr_time: string;
  rr_taps: string;
};

type RRateDatabase = {
  [recordNo: string]: Session[];
};

// Load from file or return empty object
export async function loadDatabase(): Promise<RRateDatabase> {
  try {
    const data = await FileSystem.readAsStringAsync(CDB_PATH);
    return JSON.parse(data);
  } catch (error) {
    return {};
  }
}

// Save database object to file
export async function saveDatabase(db: RRateDatabase): Promise<void> {
  const json = JSON.stringify(db, null, 2);
  await FileSystem.writeAsStringAsync(CDB_PATH, json);
}

// Save session data in the database
export async function saveSession(recordNo: string, rate: string, time: string, taps: string) {
  const db = await loadDatabase();

  const newSession: Session = {
    rr_rate: rate,
    rr_time: time,
    rr_taps: taps,
  };

  const existingSessions = db[recordNo] ?? [];
  db[recordNo] = [...existingSessions, newSession];

  await saveDatabase(db);
}

// Delete temporary database file
export async function deleteDatabase(): Promise<void> {
  const fileInfo = await FileSystem.getInfoAsync(CDB_PATH);
  if (fileInfo.exists) {
    await FileSystem.deleteAsync(CDB_PATH);
    console.log('Database file deleted.');
  } else {
    console.log('No database file found to delete.');
  }
}