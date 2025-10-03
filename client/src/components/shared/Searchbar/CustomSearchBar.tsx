import { InputAdornment } from '@mui/material';
import  SearchTextField  from "./SearchTextField";
import SearchIcon from '@mui/icons-material/Search';
import  NeumorphicBox from "../containers/NeumorphicBox";
import { CustomSearchProps } from "./types";
import CustomIcon from '../Icons/CustomIcon';


const CustomSearchBar: React.FC<CustomSearchProps>  = (
  { icon = false ,
    width="100%",
    type="inwards",
  }
) => {
  return (
    <div style={{ display: "flex", flexDirection: "row", gap: "20px" }}>
      <NeumorphicBox
        containerType={type}
        width="w-fit"
        borderRadius="50px"
        padding="2px"
      >
        <SearchTextField
          id="outlined-basic"
          label="Search Events"
          variant="outlined"
          size="small"
          color="primary"
          sx={{ width: width }}
          InputProps={{
            endAdornment: icon ? (
              <InputAdornment position="end">
                <SearchIcon color="primary" />
              </InputAdornment>
            ) : null,
          }}
        />
      </NeumorphicBox>
      <CustomIcon icon="search" size="medium" containerType={type} />
    </div>
  );   
};

export default CustomSearchBar;



 