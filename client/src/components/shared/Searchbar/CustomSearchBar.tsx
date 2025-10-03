import { InputAdornment } from '@mui/material';
import  SearchTextField  from "./SearchTextField";
import SearchIcon from '@mui/icons-material/Search';
import  NeumorphicBox from "../containers/NeumorphicBox";
import { CustomSearchProps } from "./types";
import { IconButton } from '../mui';


const CustomSearchBar: React.FC<CustomSearchProps>  = (
  { icon = false ,
    width="100%",
    type="inwards",
  }
) => {
  return <div style={{display:"flex", flexDirection:"row", gap:"20px"}}>
        <NeumorphicBox containerType={type} width="w-fit" borderRadius="50px" padding="2px">
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
                      }}/>
       </NeumorphicBox>
       <NeumorphicBox containerType={type} sx={{display:"flex", alignItems:"center", justifyContent:"center", borderRadius:"50%" ,width:"50px", height:"50px", padding:"2px" }}>
               <IconButton aria-label="search" size="medium" sx={{padding:"10px", border:"1px solid #b6b7ba",  '&:hover': {
          borderColor: '#7950db', 
          borderWidth: '2px',
          transition: "all 0.3 ease-in-out"
        },
      }}>
                 <SearchIcon fontSize="inherit" color="primary" />
               </IconButton>
       </NeumorphicBox>
       
       </div >
     ;   
};

export default CustomSearchBar;



 