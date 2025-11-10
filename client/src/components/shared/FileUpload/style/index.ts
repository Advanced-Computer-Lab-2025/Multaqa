import { styled } from "@mui/system";
import theme from "@/themes/lightTheme";

export const StyledWrapper = styled("div")<{
  containerWidth?: number | string;
  uploadStatus?: "idle" | "uploading" | "success" | "error";
}>(
  ({ containerWidth = 300 }) => `
  width: ${
    typeof containerWidth === "number" ? `${containerWidth}px` : containerWidth
  };
  max-width: 100%;
  cursor: pointer;

  @keyframes borderDraw {
    0% {
      stroke-dashoffset: 1000;
    }
    100% {
      stroke-dashoffset: 0;
    }
  }

  .container {
    --transition: 350ms;
    --folder-W: 150px;
    --folder-H: 100px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    padding: 10px;
    background: #ffffff;
    border-radius: 15px;
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
    height:  ${
      typeof containerWidth === "number"
        ? `${containerWidth * 0.6}px`
        : 0.6 * Number(containerWidth.replace("px", "")) + "px"
    };
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
    top: -3px;
    left: -3px;
    right: -3px;
    bottom: -3px;
    border-radius: 15px;
    border: 2px solid ${theme.palette.primary.main};
    animation: borderDraw 2s linear infinite;
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

  @keyframes borderProgress {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }

  .container.success {
    border: 2px solid #24ad51ff;
  }

  .container.error {
    border: 2px solid ${theme.palette.error.main};
  }

  .container:hover {
    transform: scale(1.05);
    border-color: ${theme.palette.primary.main};
  }

  .folder {
    position: absolute;
    top: -20px;
    left: calc(50% - 75px);
    transition: transform var(--transition) ease;
  }

  .folder .front-side,
  .folder .back-side {
    position: absolute;
    transition: transform var(--transition);
    transform-origin: bottom center;
  }

  .folder .back-side::before,
  .folder .back-side::after {
    content: "";
    display: block;
    background-color: white;
    opacity: 0.5;
    width: var(--folder-W);
    height: var(--folder-H);
    position: absolute;
    transform-origin: bottom center;
    border-radius: 15px;
    transition: transform 350ms;
    z-index: 0;
  }

  .container:hover .back-side::before {
    transform: rotateX(-5deg) skewX(5deg);
  }
  .container:hover .back-side::after {
    transform: rotateX(-15deg) skewX(12deg);
  }

  .folder .front-side {
    z-index: 1;
  }

  .container:hover .front-side {
    transform: rotateX(-40deg) skewX(15deg);
  }

  .folder .tip {
    background: linear-gradient(135deg, #ff9a56, #ff6f56);
    width: 80px;
    height: 20px;
    border-radius: 12px 12px 0 0;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    position: absolute;
    top: -10px;
    z-index: 2;
  }

  .folder .cover {
    background: linear-gradient(135deg, #ffe563, #ffc663);
    width: var(--folder-W);
    height: var(--folder-H);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
    border-radius: 10px;
  }

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
    padding: 10px 35px;
    position: relative;
  }

  .custom-file-upload:hover {
    background: rgba(255, 255, 255, 0.4);
  }

  .custom-file-upload input[type="file"] {
    display: none;
  }

  /* Tax Card Variant */
  .tax-card {
    position: absolute;
    top: -20px;
    left: calc(50% - 75px);
    width: var(--folder-W);
    height: var(--folder-H);
    background: linear-gradient(135deg, ${
      theme.palette.primary.main
    }, #0a265fff);
    border-radius: 10px;
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
    transition: transform var(--transition) ease;
    display: flex;
    flex-direction: column;
    padding: 12px;
    overflow: hidden;
  }

  /* Chip */
  .tax-card::before {
    content: "";
    position: absolute;
    top: 12px;
    left: 12px;
    width: 35px;
    height: 28px;
    background: linear-gradient(135deg, #ffd89b, #f9ca24);
    border-radius: 4px;
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  /* Card number lines */
  .tax-card::after {
    content: "";
    position: absolute;
    bottom: 25px;
    left: 12px;
    width: 70%;
    height: 3px;
    background: rgba(255, 255, 255, 0.6);
    border-radius: 2px;
    box-shadow: 0 8px 0 rgba(255, 255, 255, 0.4), 0 16px 0 rgba(255, 255, 255, 0.3);
  }

  .container:hover .tax-card {
    transform: rotateY(10deg) rotateX(5deg);
  }

  /* Logo Variant - Clear Circle with Shadow */
  .logo {
  position: absolute;
  top: -20px;
  left: calc(50% - 75px);
  width: 150px;
  height: 100px;
  background: #ffffff;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
  border: 1px solid #2c529eff;
  border-radius: 5%;
  transition: all var(--transition) ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 15px;
}

.logo-icon {
  width: 40px;
  height: 40px;
    background: linear-gradient(135deg, ${
      theme.palette.primary.main
    }, #0a265fff);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
  font-weight: bold;
}

.logo-text {
  font-family: 'Arial', sans-serif;
  font-size: 14px;
  font-weight: 700;
  color: #0a265fff;
  letter-spacing: 2px;
}`
);
