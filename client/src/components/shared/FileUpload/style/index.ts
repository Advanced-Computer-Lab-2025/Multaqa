import { styled } from "@mui/system";
import theme from "@/themes/lightTheme";

export const StyledWrapper = styled("div")<{
  containerWidth?: number | string;
  uploadStatus?: "idle" | "uploading" | "success" | "error";
}>(
  ({ containerWidth = 300 }) => `
  width: 100%;
  max-width: ${
    typeof containerWidth === "number" ? `${containerWidth}px` : containerWidth
  };
  cursor: pointer;

  @keyframes borderDraw {
    0% { stroke-dashoffset: 2000; }
    100% { stroke-dashoffset: 0; }
  }

  @keyframes borderProgress {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  .container {
    --transition: 350ms;
    --folder-W: 50%; 
    
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    padding: 10px;
    background: #ffffff;
    border-radius: 15px;
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
    
    aspect-ratio: 1.6; 
    width: 100%;
    
    position: relative;
    transition: transform var(--transition), border var(--transition);
    border: 2px dashed transparent;
  }

  .container.uploading {
    border: 2px solid transparent;
    position: relative;
  }

  .container.uploading::before {
    content: '';
    position: absolute;
    inset: -3px;
    border-radius: 15px;
    border: 2px solid ${theme.palette.primary.main};
    background: linear-gradient(90deg, 
      transparent 0%, 
      transparent 50%, 
      ${theme.palette.primary.main} 50%, 
      ${theme.palette.primary.main} 100%
    );
    background-size: 200% 100%;
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    padding: 2px;
    animation: borderProgress 2s linear infinite;
  }

  .container.success { border: 2px solid #24ad51ff; }
  .container.error { border: 2px solid ${theme.palette.error.main}; }

  .container:hover {
    transform: scale(1.02);
    border-color: ${theme.palette.primary.main};
  }

  /* --- FOLDER LOGIC --- */
  .folder {
    position: absolute;
    top: -10%;
    left: 25%; 
    width: var(--folder-W);
    aspect-ratio: 3/2;
    transition: transform var(--transition) ease;
  }

  .folder .front-side,
  .folder .back-side {
    position: absolute;
    transition: transform var(--transition);
    transform-origin: bottom center;
    width: 100%;
    height: 100%;
  }

  .folder .back-side::before,
  .folder .back-side::after {
    content: "";
    display: block;
    background-color: white;
    opacity: 0.5;
    width: 100%;
    height: 100%;
    position: absolute;
    transform-origin: bottom center;
    border-radius: 15px;
    transition: transform 350ms;
    z-index: 0;
  }

  .container:hover .back-side::before { transform: rotateX(-5deg) skewX(5deg); }
  .container:hover .back-side::after { transform: rotateX(-15deg) skewX(12deg); }

  .folder .front-side { z-index: 1; }

  .container:hover .front-side { transform: rotateX(-40deg) skewX(15deg); }

  .folder .tip {
    background: linear-gradient(135deg, #ff9a56, #ff6f56);
    width: 50%;
    height: 20%;
    border-radius: 12px 12px 0 0;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    position: absolute;
    top: -15%;
    z-index: 2;
  }

  .folder .cover {
    background: linear-gradient(135deg, #ffe563, #ffc663);
    width: 100%;
    height: 100%;
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
    border-radius: 10px;
  }

  /* --- BUTTON --- */
  .custom-file-upload {
    font-size: 1.1em;
    color: #000;
    text-align: center;
    background: rgba(255, 255, 255, 0.2);
    border: none;
    border-radius: 10px;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: background var(--transition) ease;
    display: inline-block;
    width: 100%;
    padding: 10px 0;
    position: relative;
    z-index: 10;
  }

  .custom-file-upload:hover { background: rgba(255, 255, 255, 0.4); }
  .custom-file-upload input[type="file"] { display: none; }

  /* --- TAX CARD VARIANT --- */
  .tax-card {
    position: absolute;
    top: -10%;
    left: 25%;
    width: var(--folder-W);
    aspect-ratio: 3/2;
    
    background: linear-gradient(135deg, ${
      theme.palette.primary.main
    }, #0a265fff);
    border-radius: 10px;
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
    transition: transform var(--transition) ease;
    display: flex;
    flex-direction: column;
    padding: 5%;
    overflow: hidden;
  }

  /* Chip */
  .tax-card::before {
    content: "";
    position: absolute;
    top: 10%;
    left: 8%;
    width: 22%;
    height: 20%;
    background: linear-gradient(135deg, #ffd89b, #f9ca24);
    border-radius: 4px;
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  /* Card number lines */
  .tax-card::after {
    content: "";
    position: absolute;
    /* CHANGED: Increased from 20% to 40% to move lines up */
    bottom: 40%; 
    left: 8%;
    width: 70%;
    height: 4%;
    background: rgba(255, 255, 255, 0.6);
    border-radius: 2px;
    box-shadow: 0 0.8em 0 rgba(255, 255, 255, 0.4), 0 1.6em 0 rgba(255, 255, 255, 0.3);
  }

  .container:hover .tax-card { transform: rotateY(10deg) rotateX(5deg); }

  /* --- LOGO VARIANT --- */
  .logo {
    position: absolute;
    top: -10%;
    left: 25%;
    width: var(--folder-W);
    aspect-ratio: 3/2;

    background: #ffffff;
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
    border: 1px solid #2c529eff;
    border-radius: 5%;
    transition: all var(--transition) ease;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8%;
    padding: 5%;
  }

  .logo-icon {
    width: 30%;
    height: 45%;
    background: linear-gradient(135deg, ${
      theme.palette.primary.main
    }, #0a265fff);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: clamp(12px, 2vw, 20px); 
    font-weight: bold;
  }

  .logo-text {
    font-family: 'Arial', sans-serif;
    font-size: clamp(10px, 1.5vw, 14px);
    font-weight: 700;
    color: #0a265fff;
    letter-spacing: 2px;
  }
`
);
