"use client";
import * as React from 'react';
import { Slider, SliderProps } from '@mui/material';
import { alpha } from '@mui/material/styles';

interface FilterSliderProps extends Omit<SliderProps, 'sx'> {
    sx?: any;
}
const FilterSlider: React.FC<FilterSliderProps> = (props) => {

    const { sx, ...rest } = props;
        return (
             <Slider
                {...rest}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => value.toString()}
                sx={{
                mt: 0.35,
                color: (theme: any) => theme.palette.primary.main,
                '& .MuiSlider-track': { height: 1.4, borderRadius: 1.2, border: 'none' },
                '& .MuiSlider-thumb': {
                height: 9,
                width: 9,
                backgroundColor: (theme: any) => theme.palette.primary.main,
                border: 'none',
                },
                '& .MuiSlider-rail': { height: 1.4, backgroundColor: (theme: any) => theme.palette.grey[400] },
                   ...(sx || {}),
   }}
     />
   );

};

export default FilterSlider;