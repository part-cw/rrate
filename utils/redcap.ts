// Uploads new record to REDCap
export async function uploadRecordToREDCap({
  apiUrl,
  apiToken,
  recordData,
  recordID,
  event = '',
  repeatInstrument = '',
}: {
  apiUrl: string;
  apiToken: string;
  recordData: any[];
  recordID: string;
  event?: string;
  repeatInstrument?: string;
}): Promise<string> {
  const formData = new FormData();

  // Modify record data if a repeat instrument is specified
  const finalData = recordData.map(record => {
    if (repeatInstrument) {
      const repeatInstance = getNextRepeatInstance({ apiUrl, apiToken, recordID, event, repeatInstrument });
      return {
        ...record,
        redcap_repeat_instrument: repeatInstrument,
        redcap_repeat_instance: repeatInstance,
        ...(event && { redcap_event_name: event }),
      };
    } else if (event) {
      return {
        ...record,
        redcap_event_name: event,
      };
    }
    return record;
  });


  // Fields taken from BCCHR REDCap API documentation for "Import Records" endpoint
  formData.append('token', apiToken);
  formData.append('content', 'record');
  formData.append('format', 'json');
  formData.append('type', 'flat');
  formData.append('overwriteBehavior', 'normal');
  formData.append('forceAutoNumber', 'true');
  formData.append('returnFormat', 'json');
  formData.append('data', JSON.stringify(finalData));

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

// Retrieves the next repeatable instance index for a given record in REDCap
export async function getNextRepeatInstance({
  apiUrl,
  apiToken,
  recordID,
  event = '',
  repeatInstrument = '',
}: {
  apiUrl: string;
  apiToken: string;
  recordID: string;
  event?: string;
  repeatInstrument?: string;
}): Promise<number> {
  try {
    const params: Record<string, string> = {
      token: apiToken,
      content: 'record',
      format: 'json',
      type: 'eav',
      fields: 'redcap_repeat_instance',
      records: recordID,
      returnFormat: 'json',
    };

    if (repeatInstrument) {
      params.forms = repeatInstrument;
    }

    if (event) {
      params.events = event;
    }

    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(params).toString(),
    });

    const data = await res.json();

    if (!Array.isArray(data) || data.length === 0) {
      console.warn("No REDCap entry currently exists; instance will begin at 1.");
      return 1;
    }

    // Filter for only records with a repeat instance
    const instances = data
      .map((r: any) => parseInt(r.value, 10))
      .filter(i => !isNaN(i));

    if (instances.length === 0) {
      console.error("This REDCap entry is not repeatable.");
      return 1;
    }

    const maxInstance = Math.max(...instances);
    return maxInstance + 1;

  } catch (error) {
    console.error('Failed to fetch next repeat instance index:', error);
    throw error;
  }
}


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

