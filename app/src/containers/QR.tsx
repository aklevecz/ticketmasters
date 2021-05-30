import { useEffect, useRef } from "react";
import dotImage from "../assets/dot.png";
import smilerImage from "../assets/smiler.png";
import QRCode from "qrcode";

type Props = {
  qr: string;
  ticketId?: number;
  booped?: boolean;
  canvasClass?: string;
};

export default function QR({ qr, ticketId, booped, canvasClass }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!qr) return;
    QRCode.toCanvas(canvasRef.current, qr);

    const dotCanvas = dotRef.current;
    if (!dotCanvas) {
      return;
    }
    const qrCanvas = canvasRef.current;
    if (!qrCanvas) {
      return;
    }
    const image = new Image();
    image.src = dotImage;
    image.onload = () => {
      const ctx = dotCanvas.getContext("2d");
      const w = image.width * 0.2;
      const h = image.height * 0.2;
      dotCanvas.width = w;
      dotCanvas.height = h;
      image.width = w;
      image.height = h;

      if (!ctx) {
        return;
      }
      ctx.drawImage(image, 0, 0, w, h);

      const newQrDim = dotCanvas.width * 0.3;
      if (booped) {
        const smilerImg = new Image();
        smilerImg.src = smilerImage;
        smilerImg.onload = () => {
          ctx.drawImage(
            smilerImg,
            w * 0.5 - newQrDim * 0.5,
            h * 0.5 - newQrDim * 0.5,
            newQrDim,
            newQrDim
          );
        };
      } else {
        ctx.drawImage(
          qrCanvas,
          w * 0.5 - newQrDim * 0.5,
          h * 0.5 - newQrDim * 0.5,
          newQrDim,
          newQrDim
        );
      }

      if (!ticketId || !booped) {
        ctx.lineWidth = 20;
        ctx.strokeRect(0, 0, w, h);
        ctx.strokeStyle = "black";

        return;
      }

      ctx.font = "100px Arial";
      const ticketIdString = ticketId.toString();
      ctx.fillText(ticketIdString, 20, dotCanvas.height * 0.16);

      const gradient = ctx.createLinearGradient(0, 0, 170, 0);
      gradient.addColorStop(0, "magenta");
      gradient.addColorStop(0.5, "blue");
      gradient.addColorStop(1.0, "red");
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 20;
      ctx.strokeRect(0, 0, w, h);
    };
  }, [qr, ticketId, booped]);

  return (
    <div>
      <canvas className={canvasClass} ref={dotRef}></canvas>
      <canvas style={{ display: "none" }} ref={canvasRef}></canvas>
    </div>
  );
}
