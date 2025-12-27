'use client';

import { memo, useMemo } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { Brightness4 as DarkModeIcon, Brightness7 as LightModeIcon } from '@mui/icons-material';
import { useThemeMode } from '@/app/providers';
import { getThemeToggleTooltip } from './DarkModeToggle.utils';
import { styles } from './DarkModeToggle.sx';

function DarkModeToggleComponent() {
  const { mode, toggleMode } = useThemeMode();

  const tooltipTitle = useMemo(() => getThemeToggleTooltip(mode), [mode]);

  return (
    <Tooltip title={tooltipTitle}>
      <IconButton onClick={toggleMode} sx={styles.iconButton} size="small">
        {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
      </IconButton>
    </Tooltip>
  );
}

export const DarkModeToggle = memo(DarkModeToggleComponent);

