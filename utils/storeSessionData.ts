import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';

const CDB_KEY = 'data.cdb.json';
const STORAGE_KEY = 'sessionCSV';
const MAX_ROWS = 1;

type Session = {
  record_id: string;
  rr_rate: string;
  rr_time: string;
  rr_taps: string;
};

type RRateDatabase = {
  [recordID: string]: Session[];
};

// Load REDCap database from AsyncStorage or return an empty object
export async function loadREDCapDatabase(): Promise<RRateDatabase> {
  try {
    const data = await AsyncStorage.getItem(CDB_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Failed to load database:', error);
    return {};
  }
}

// Save entire REDCap database object to AsyncStorage
export async function saveREDCapDatabase(db: RRateDatabase): Promise<void> {
  try {
    const json = JSON.stringify(db, null, 2);
    await AsyncStorage.setItem(CDB_KEY, json);
  } catch (error) {
    console.error('Failed to save database:', error);
  }
}

// Check if there are more than 200 saved sessions in the REDCap database
export async function hasTooManySessions(): Promise<boolean> {
  try {
    const db = await loadREDCapDatabase();
    let totalSessions = 0;

    for (const sessions of Object.values(db)) {
      totalSessions += sessions.length;
      if (totalSessions > 200) return true; // early exit
    }

    return false;
  } catch (error) {
    console.error('Failed to count REDCap sessions:', error);
    return false;
  }
}

// Save a new session to the REDCap database
export async function saveREDCapSession(recordID: string, rate: string, time: string, taps: string): Promise<void> {
  if (await hasTooManySessions()) {
    throw new Error('You can only store up to 200 results. Please export csv to clear storage.');
  }

  const db = await loadREDCapDatabase();

  const newSession: Session = {
    record_id: recordID,
    rr_rate: rate,
    rr_time: time,
    rr_taps: taps,
  };

  const existingSessions = db[recordID] ?? [];
  db[recordID] = [...existingSessions, newSession];

  await saveREDCapDatabase(db);
}

// Delete the entire REDCap database from AsyncStorage
export async function deleteREDCapDatabase(): Promise<void> {
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

// Check if there are any stored data for REDCap export
export async function storedREDCapDataExists(): Promise<boolean> {
  try {
    const data = await AsyncStorage.getItem(CDB_KEY);
    console.log(data);
    return data !== null;
  } catch (error) {
    console.error('Error checking REDCap data existence:', error);
    return false;
  }
}

// Save measurement for future upload to CSV; use localStorage for web and AsyncStorage for mobile
export async function saveSessionToCSV(recordId: string, rrate: string, tapSequence: string, timestamp: string) {
  try {
    const newLine = `${recordId},${rrate},"${tapSequence}",${timestamp}`;
    const header = 'recordId,rrate,tapSequence,timestamp';

    if (Platform.OS === 'web') {
      let existing = localStorage.getItem(STORAGE_KEY) || '';
      const lines = existing.trim() ? existing.trim().split('\n') : [];

      if (lines.length >= MAX_ROWS + 1) throw new Error('You can only store up to 200 results.');

      const csv = lines.length === 0
        ? `${header}\n${newLine}`
        : `${existing.trim()}\n${newLine}`;

      localStorage.setItem(STORAGE_KEY, csv);
    } else {
      let existing = await AsyncStorage.getItem(STORAGE_KEY) || '';
      const lines = existing.trim() ? existing.trim().split('\n') : [];

      if (lines.length >= MAX_ROWS + 1) throw new Error('You can only store up to 200 results.');

      const csv = lines.length === 0
        ? `${header}\n${newLine}`
        : `${existing.trim()}\n${newLine}`;

      await AsyncStorage.setItem(STORAGE_KEY, csv);
    }

    console.log('Session saved to storage.');
  } catch (error) {
    console.error('Failed to save session:', error);
  }
}


// Export as CSV to local device storage using Blob for web or FileSystem for mobile
export async function exportCSV() {
  const csv =
    Platform.OS === 'web'
      ? localStorage.getItem(STORAGE_KEY)
      : await AsyncStorage.getItem(STORAGE_KEY);

  if (!csv) throw new Error('No saved sessions to export.');

  const startDate = new Date();
  const formattedDate = `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}-${String(startDate.getDate()).padStart(2, '0')}_${String(startDate.getHours()).padStart(2, '0')}-${String(startDate.getMinutes()).padStart(2, '0')}`;
  const fileName = `RRateData-${formattedDate}.csv`;

  try {
    if (Platform.OS === 'web') {
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      const fileUri = FileSystem.documentDirectory + fileName;
      await FileSystem.writeAsStringAsync(fileUri, csv, {
        encoding: FileSystem.EncodingType.UTF8,
      });
      // Trigger notification for user to select where to save (ie. Files on IOS)
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
      } else {
        alert("Sharing not available");
      }
      console.log('CSV saved at:', fileUri);
    }

    await clearCSVStorage();
  } catch (error) {
    console.error('Failed to export CSV:', error);
  }
}


// Clear saved sessions
export async function clearCSVStorage() {
  if (Platform.OS === 'web') {
    localStorage.removeItem(STORAGE_KEY);
  } else {
    await AsyncStorage.removeItem(STORAGE_KEY);
  }
  console.log('CSV storage cleared.');
}

// Check if there are any stored data for export 
export async function storedDataExists(): Promise<boolean> {
  const data =
    Platform.OS === 'web'
      ? localStorage.getItem(STORAGE_KEY)
      : await AsyncStorage.getItem(STORAGE_KEY);

  const lines = data?.trim() ? data.trim().split('\n') : [];
  return lines.length > 1; // >1 because of header
}


