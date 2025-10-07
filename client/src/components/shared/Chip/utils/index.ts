import { alpha } from '@mui/material/styles';
import { Theme } from '@mui/material';

export const getLiftedShadowString = (theme: Theme) => {
    const lightShadowColor = '#FAFBFF';
    const darkShadowColor = alpha(theme.palette.common.black, 0.1);
    return `-3px -3px 6px 0 ${lightShadowColor}, 3px 3px 6px 0 ${darkShadowColor}`;
};

export const getSubtlePressedShadow = (theme: Theme) => {
    const lightShadowColor = theme.palette.mode === 'light' ? '#FAFBFF' : alpha(theme.palette.common.white, 0.06);
    const darkShadowColor = alpha(theme.palette.common.black, 0.15);
    return `inset 1px 1px 2px 0 ${darkShadowColor}, inset -1px -1px 2px 0 ${lightShadowColor}`;
};