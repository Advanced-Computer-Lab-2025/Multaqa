import { styled } from "@mui/system";

export const StyledWrapper = styled("div")`
  .container-btn-file {
    display: flex;
    position: relative;
    justify-content: center;
    align-items: center;
    background-color: #4caf50;
    color: #fff;
    border-style: none;
    padding: 0.75em 1.1em;
    border-radius: 0.5em;
    overflow: hidden;
    z-index: 1;
    transition: all 250ms;
    cursor: pointer; /* Added cursor pointer */
  }

  /* This CSS rule was for the hidden input, so it's no longer needed.
    I've removed it.
  */
  /*
  .container-btn-file input[type="file"] {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
  }
  */

  .container-btn-file > svg {
    margin-right: 1em;
  }
  .container-btn-file::before {
    content: "";
    position: absolute;
    height: 100%;
    width: 0;
    border-radius: 0.5em;
    background-color: #469b61;
    z-index: -1;
    transition: all 350ms;
  }
  .container-btn-file:hover::before {
    width: 100%;
  }
`;
