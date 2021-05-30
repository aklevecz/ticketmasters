const { createCanvas, loadImage } = require("canvas");
const path = require("path");
const fs = require("fs");

for (let i = 1; i <= 100; i++) {
  loadImage(path.join(__dirname, "../app/src/assets/dot.png")).then((image) => {
    const w = image.width * 0.2;
    const h = image.height * 0.2;
    const canvas = createCanvas(w, h);
    const ctx = canvas.getContext("2d");

    canvas.width = w;
    canvas.height = h;

    ctx.drawImage(image, 0, 0, w, h);

    loadImage(path.join(__dirname, "../app/src/assets/smiler.png")).then(
      (smiler) => {
        const newQrDim = canvas.width * 0.3;
        ctx.drawImage(
          smiler,
          w * 0.5 - newQrDim * 0.5,
          h * 0.5 - newQrDim * 0.5,
          newQrDim,
          newQrDim
        );

        ctx.font = "100px Arial";
        ticketId = i;
        const ticketIdString = ticketId.toString();
        ctx.fillText(ticketIdString, 25, canvas.height * 0.16);

        const gradient = ctx.createLinearGradient(0, 0, 170, 0);
        gradient.addColorStop(0, "magenta");
        gradient.addColorStop(0.5, "blue");
        gradient.addColorStop(1.0, "red");
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 20;
        ctx.strokeRect(0, 0, w, h);

        var data = canvas.toDataURL();
        data = data.replace(/^data:image\/\w+;base64,/, "");
        fs.writeFileSync(
          path.join(__dirname, `../tickets/tm-${ticketId}.png`),
          new Buffer.from(data, "base64")
        );
      }
    );
  });
}
