// Uploads new record to REDCap
export async function uploadRecordToREDCap({
  apiUrl,
  apiToken,
  recordData,
  recordID,
  event = '',
  repeatableEvent,
  repeatInstrument = '',
}: {
  apiUrl: string;
  apiToken: string;
  recordData: any[];
  recordID: string;
  event?: string;
  repeatableEvent?: boolean;
  repeatInstrument?: string;
}): Promise<string> {
  const formData = new FormData();

  // Modify record data if repeatable instruments, repeated events or longitudinal project is enabled
  const finalData = await Promise.all(
    recordData.map(async (record) => {
      // CASE 1: Repeating Instrument (possibly longitudinal)
      if (repeatInstrument) {
        const repeatInstance = await getNextRepeatInstance({
          apiUrl,
          apiToken,
          recordID,
          event,
          repeatInstrument,
        });

        return {
          ...record,
          redcap_repeat_instrument: repeatInstrument,
          redcap_repeat_instance: repeatInstance,
          ...(event && { redcap_event_name: event }),
        };
      }

      // CASE 2: Repeating Event (no repeatable instrument)
      if (repeatableEvent && event) {
        const repeatInstance = await getNextRepeatInstance({
          apiUrl,
          apiToken,
          recordID,
          event,
        });

        return {
          ...record,
          redcap_event_name: event,
          redcap_repeat_instance: repeatInstance,
        };
      }

      // CASE 3: Longitudinal only (no repeatable instrument)
      if (event) {
        return {
          ...record,
          redcap_event_name: event,
        };
      }

      // CASE 4: Classic, no longitudinal or repeatable instruments 
      return record;
    })
  );

  // Fields taken from BCCHR REDCap API documentation for "Import Records" endpoint
  formData.append('token', apiToken);
  formData.append('content', 'record');
  formData.append('format', 'json');
  formData.append('type', 'flat');
  formData.append('overwriteBehavior', 'normal');
  formData.append('forceAutoNumber', 'false');
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

    const instances = data
      .map((r: any) => parseInt(r.redcap_repeat_instance, 10))
      .filter(i => !isNaN(i));

    if (instances.length === 0) {
      console.warn("No repeat instances found — defaulting to 1.");
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

