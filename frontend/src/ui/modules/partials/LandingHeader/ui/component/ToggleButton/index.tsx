import * as React from 'react';
import { useColorScheme } from '@mui/material/styles';
import LightModeIcon from '@mui/icons-material/LightMode';
import { IconButton } from '@mui/material';

export function ToggleScheme() {
  const { mode, setMode } = useColorScheme();

  React.useEffect(() => {
    if (mode !== 'system') {
      setMode('system');
    }
  });

  if (!mode) {
    return null;
  }

  return (
    <IconButton 
      onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}
    >
      <LightModeIcon />
    </IconButton>
  );
}
