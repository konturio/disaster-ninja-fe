import { useEffect } from 'react';
import { uploadPrompt, downloadPrompt } from './fileManager';

const triggerModes = {
  DownloadMode: downloadPrompt,
  UploadMode: uploadPrompt,
};

const _triggerNames = Object.keys(triggerModes);

function getTrigger(
  mode: string | undefined,
): (data, options) => Promise<any> | null {
  return (data, options) => {
    if (mode) {
      const trigger = triggerModes[mode];
      if (trigger) return trigger(data, options);
    }
    return null;
  };
}

function isTriggerMode(mode) {
  return _triggerNames.includes(mode);
}

export function useTriggers(mode, data, setData, options = undefined) {
  useEffect(() => {
    const trigger = getTrigger(mode)(data, options);
    if (trigger !== null) {
      trigger.then((newData) => {
        setData(newData);
      });
      return;
    }
  }, [mode]);

  return isTriggerMode;
}
