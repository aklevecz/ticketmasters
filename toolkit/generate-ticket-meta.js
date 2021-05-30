const fs = require("fs");
const path = require("path");

const ticketBaseURI =
  "ipfs://QmPqMyvudwbGoQm7wAj9VrvohC1tq5oUaxoNZX1iD42gjA/tickets";

for (let i = 1; i <= 100; i++) {
  const metaObject = {
    name: `Ticket: ${i}`,
    description: `This is your fucking ticket: ${i}`,
    image: `${ticketBaseURI}/tm-${i}.png`,
    attributes: [
      { display_type: "number", trait_type: "Generation", value: 1 },
    ],
  };
  const metaString = JSON.stringify(metaObject);
  fs.writeFileSync(
    path.join(__dirname, `../ticket-meta/tm-${i}.json`),
    metaString
  );
}
