// Uploads new record to REDCap
export async function uploadRecordToREDCap({
  apiUrl,
  apiToken,
  recordData,
  event = '',
}: {
  apiUrl: string;
  apiToken: string;
  recordData: any[];
  event?: string;
}): Promise<string> {
  const formData = new FormData();

  // Fields taken from BCCHR REDCap API documentation for "Import Records" endpoint
  formData.append('token', apiToken);
  formData.append('content', 'record');
  formData.append('format', 'json');
  formData.append('type', 'flat');
  formData.append('overwriteBehavior', 'normal');
  formData.append('forceAutoNumber', 'true');
  formData.append('returnFormat', 'json');
  if (event) {
    formData.append('event', event);
  }
  formData.append('data', JSON.stringify(recordData));

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      body: formData,
    });

    const text = await response.text();
    if (!response.ok) {
      console.error('Upload failed with status:', response.status);
      throw new Error(text);
    }

    return text;
  } catch (error) {
    console.error('REDCap upload failed:', error);
    throw error;
  }
}

// How to use: 
// const result = await uploadRecordToREDCap({
//         apiUrl: url,
//         apiToken: token,
//         recordData: record,
//       });


// Retrieves last record ID from REDCap and returns the next available record ID
export async function getNextRecordID({
  apiUrl,
  apiToken
}: {
  apiUrl: string;
  apiToken: string;
}): Promise<string> {

  try {
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        token: apiToken,
        content: 'record',
        format: 'json',
        type: 'flat',
        fields: 'record_id',
      }).toString(),
    });

    const existingRecords = await res.json();

    // Get the max record_id
    const maxId = existingRecords.reduce((max: number, r: any) => {
      const id = parseInt(r.record_id, 10);
      return isNaN(id) ? max : Math.max(max, id);
    }, 0);

    return (maxId + 1).toString();

  } catch (error) {
    throw new Error("Failed to fetch next record ID. Error: " + error);
  }
};

