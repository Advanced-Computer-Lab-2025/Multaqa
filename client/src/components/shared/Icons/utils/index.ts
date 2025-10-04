import { IconType } from "../styles";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import PublishIcon from "@mui/icons-material/Publish";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import SearchIcon from '@mui/icons-material/Search';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';
import HelpIcon from '@mui/icons-material/Help';

export const iconComponents: Record<IconType, React.ElementType> = {
  close: CloseIcon,
  delete: DeleteIcon,
  edit: EditIcon,
  add: AddIcon,
  save: SaveIcon,
  submit: PublishIcon,
  bookmark: BookmarkBorderIcon,
  search: SearchIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  success: CheckCircleIcon,
  info: InfoIcon,
  help: HelpIcon,
};
