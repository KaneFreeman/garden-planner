import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Box, Tabs as MuiTabs, Theme, SxProps } from '@mui/material';
import Tab from './Tab';

export interface TabType {
  label: string;
  disabled?: boolean;
}

export interface TabsProps {
  children: TabType | TabType[];
  sxRoot?: SxProps<Theme> | undefined;
  sxWrapper?: SxProps<Theme> | undefined;
  sxTabs?: SxProps<Theme> | undefined;
  ariaLabel: string;
  endAdornment?: React.ReactNode;
  onChange?: (tab: number) => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unnecessary-type-constraint
const Tabs = ({ children, ariaLabel, sxRoot = {}, sxWrapper = {}, sxTabs = {}, endAdornment, onChange }: TabsProps) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const queryTab = Number(searchParams.get('tab') ?? 0);
  const [tab, setTab] = useState(0);
  useEffect(() => {
    if (!Number.isNaN(queryTab) && queryTab !== tab) {
      setTab(queryTab);
      if (onChange) {
        onChange(queryTab);
      }
    }
  }, [onChange, queryTab, tab]);

  const handleTabChange = useCallback(
    (_: React.SyntheticEvent<Element, Event>, newTab: number) => {
      if (tab === newTab) {
        return;
      }
      if (onChange) {
        onChange(newTab);
      }
      navigate(`${pathname}?tab=${newTab}`);
    },
    [tab, onChange, navigate, pathname]
  );

  const tabs = useMemo(() => {
    return !Array.isArray(children) ? [children] : children;
  }, [children]);

  return (
    <Box
      sx={{
        position: 'sticky',
        background: 'rgb(38, 38, 38)',
        zIndex: 100,
        ...sxRoot
      }}
    >
      <Box
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          ...sxWrapper
        }}
      >
        <MuiTabs value={tab} onChange={handleTabChange} aria-label={ariaLabel} sx={sxTabs}>
          {tabs.map((child, index) => (
            <Tab
              key={`tab-${child.label}`}
              label={child.label}
              index={index}
              disabled={Boolean(child.disabled)}
            />
          ))}
        </MuiTabs>
        {endAdornment}
      </Box>
    </Box>
  );
};

export default Tabs;
