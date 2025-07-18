import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Sharing from 'expo-sharing';
import { Alert, Platform } from 'react-native';

const CDB_KEY = 'data.cdb.json';
const STORAGE_KEY = 'sessionCSV';
const MAX_ROWS = 200;

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

// Save a new session to the REDCap database
export async function saveREDCapSession(recordID: string, rate: string, time: string, taps: string): Promise<void> {
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

// Saves measurement to csvexport function saveSessionToCSV(rrate: string, tapSequence: string, timestamp: string) {
export function saveSessionToCSV(rrate: string, tapSequence: string, timestamp: string) {
  try {
    let csv = '';
    let record_id = 1;

    let existing = localStorage.getItem(STORAGE_KEY) || '';
    const lines = existing.trim() ? existing.trim().split('\n') : [];

    if (lines.length >= MAX_ROWS) {
      console.log('You can only store up to 200 results.');
      return;
    }

    record_id = lines.length + 1;

    if (lines.length === 0) {
      csv = 'record_id,rrate,tapSequence,timestamp\n';
    } else {
      csv = existing + '\n';
    }

    csv += `${record_id},${rrate},"${tapSequence}",${timestamp}`;

    localStorage.setItem(STORAGE_KEY, csv.trim());
    console.log('Session saved to local storage.');
  } catch (error) {
    console.error('Failed to save session:', error);
  }
}

// Export as CSV
export function exportCSV() {
  try {
    const csv = localStorage.getItem(STORAGE_KEY);
    if (!csv) {
      console.log('No saved sessions to export.');
      return;
    }

    if (Platform.OS === 'web') {
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `RRateData-${new Date().toISOString()}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      clearCSVStorage();
    } else {
      console.log('CSV export is only supported on web.');
    }
  } catch (error) {
    console.error('Failed to export CSV:', error);
  }
}

// Clear saved sessions
export function clearCSVStorage() {
  localStorage.removeItem(STORAGE_KEY);
  console.log('CSV storage cleared.');
}

// Check if there are any stored data 
export function storedDataExists() {
  let existing = localStorage.getItem(STORAGE_KEY) || '';
  const lines = existing.trim() ? existing.trim().split('\n') : [];
  if (lines.length === 0) {
    return false;
  }
  return true;
}

