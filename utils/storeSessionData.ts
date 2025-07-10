import AsyncStorage from '@react-native-async-storage/async-storage';

const CDB_KEY = 'data.cdb.json';

type Session = {
  record_id: string;
  rr_rate: string;
  rr_time: string;
  rr_taps: string;
};

type RRateDatabase = {
  [recordID: string]: Session[];
};

// Load from AsyncStorage or return an empty object
export async function loadDatabase(): Promise<RRateDatabase> {
  try {
    const data = await AsyncStorage.getItem(CDB_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Failed to load database:', error);
    return {};
  }
}

// Save entire database object to AsyncStorage
export async function saveDatabase(db: RRateDatabase): Promise<void> {
  try {
    const json = JSON.stringify(db, null, 2);
    await AsyncStorage.setItem(CDB_KEY, json);
  } catch (error) {
    console.error('Failed to save database:', error);
  }
}

// Save a new session to the database
export async function saveSession(recordID: string, rate: string, time: string, taps: string): Promise<void> {
  const db = await loadDatabase();

  const newSession: Session = {
    record_id: recordID,
    rr_rate: rate,
    rr_time: time,
    rr_taps: taps,
  };

  const existingSessions = db[recordID] ?? [];
  db[recordID] = [...existingSessions, newSession];

  const result = await saveDatabase(db);
}

// Delete the entire database from AsyncStorage
export async function deleteDatabase(): Promise<void> {
  try {
    const exists = await AsyncStorage.getItem(CDB_KEY);
    if (exists !== null) {
      await AsyncStorage.removeItem(CDB_KEY);
      console.log('Database deleted.');
    } else {
      console.log('No database found to delete.');
    }
  } catch (error) {
    console.error('Failed to delete database:', error);
  }
}
