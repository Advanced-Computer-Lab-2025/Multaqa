import { InputAdornment } from '@mui/material';
import  SearchTextField  from "./SearchTextField";
import SearchIcon from '@mui/icons-material/Search';
import  NeumorphicBox from "../containers/NeumorphicBox";
import { CustomSearchProps } from "./types";
import CustomIcon from '../Icons/CustomIcon';
import theme from '@/themes/lightTheme';


const CustomSearchBar: React.FC<CustomSearchProps>  = (
  { icon = false ,
    width="100%",
    type="inwards",
    label="Search Events...",
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
          label={label}
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
      {icon && (
        <CustomIcon icon="search" size="medium" containerType={type} sx={{color:theme.palette.primary.main, borderColor:" rgba(0, 0, 0, 0.3);",  '&:hover': {
          borderColor:theme.palette.primary.main, // New border color on hover
        },}} />
      )}
    </div>
  );   
};

export default CustomSearchBar;



 