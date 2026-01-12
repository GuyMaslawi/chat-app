import { Theme, CSSObject } from '@mui/material/styles';

export const globalStyles = (theme: Theme): CSSObject => ({
  '*': {
    boxSizing: 'border-box',
  },
  html: {
    width: '100%',
    height: '100%',
    margin: 0,
    padding: 0,
    WebkitTextSizeAdjust: '100%',
    msTextSizeAdjust: '100%',
  },
  body: {
    width: '100%',
    minHeight: '100dvh',
    margin: 0,
    padding: 0,
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.primary,
  },
  '#__next': {
    width: '100%',
    minHeight: '100dvh',
  },
});

