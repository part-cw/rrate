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