import CustomButton from "@/components/shared/Buttons/CustomButton";
import DeleteButton from "@/components/shared/Buttons/DeleteButton";
import CustomSearchBar from "@/components/shared/Searchbar/CustomSearchBar";
import CustomIcon from "@/components/shared/Icons/CustomIcon";

export default function HomePage() {
  return (
    <div className=" min-h-screen flex items-center justify-center gap-5 flex-col">
      <div className="flex items-center justify-center gap-5">
        <CustomButton
          variant="outlined"
          size="small"
          disableElevation
          label="Save"
        />
        <CustomButton
          variant="contained"
          size="small"
          disableElevation
          label="Submit"
        />
        <DeleteButton size="small" variant="contained" color="error" />
      </div>
      <CustomSearchBar icon={false} width="450px" type="outwards" />
      <CustomIcon icon="delete" size="small" containerType="inwards" />
      <CustomIcon icon="edit" size="large" containerType="outwards" border={false} />
    </div>
  );
}