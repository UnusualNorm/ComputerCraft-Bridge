import { Server } from "../dist/index.js";
const server = new Server();

const history = ["potato", "orange", "apple"];
const choices = ["apple", "orange", "banana", "strawberry"];

server.on("connection", async (computer) => {
  await computer.write("> ");
  const msg = await computer.read(
    undefined,
    history,
    (text) =>
      choices
        .filter(
          (choice) => choice.length > text.length && choice.startsWith(text)
        )
        .map((choice) => choice.substring(text.length)),
    "app"
  );
  await computer.print(msg);
});

server.listen(3000);
