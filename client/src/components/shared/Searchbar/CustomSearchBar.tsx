import { InputAdornment } from '@mui/material';
import  SearchTextField  from "./SearchTextField";
import SearchIcon from '@mui/icons-material/Search';
import  NeumorphicBox from "../containers/NeumorphicBox";
import { CustomSearchProps } from "./types";
import CustomButton from "../Buttons/CustomButton"
import Tooltip from '@mui/material/Tooltip';

const CustomSearchBar: React.FC<CustomSearchProps>  = (
  { icon = false ,
    width="100%"
  }
) => {
  return <>
        <NeumorphicBox containerType="inwards" width="w-fit" borderRadius="50px" padding="2px">
        <SearchTextField
          id="outlined-basic"
          label="Search Events" 
          variant="outlined" 
          size="small"
          color="primary" 
          sx={{width:width}}
          InputProps={{
            endAdornment: (icon?
              <InputAdornment position="end">
                <SearchIcon color="primary"/>
              </InputAdornment>:null
    ),
  }}
        />
       </NeumorphicBox>
       </>
     ;   
};

export default CustomSearchBar;



 