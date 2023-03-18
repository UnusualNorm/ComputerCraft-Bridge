import { Computer } from "./computer.js";
import { Server as HTTPServer } from "http";
import { WebSocketServer } from "ws";
import EventEmitter from "events";
import { join } from "path";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";

export function attachClientSource(server: HTTPServer, path = "/") {
  server.on("request", (request, response) => {
    if (request.url == path) {
      const clientSource = buildClientSource(
        request.headers.host || "127.0.0.1"
      );
      response.writeHead(200);
      response.end(clientSource, "utf-8");
    }
  });
}

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const sourcePath = join(__dirname, "./client/client.lua");
const clientSource = readFileSync(sourcePath, { encoding: "utf-8" });

function buildClientSource(host: string) {
  const connectionVariableDefinition = `ConnectionUrl = "ws://${host}"`;
  return `${connectionVariableDefinition}\n${clientSource}`;
}

export interface Server {
  on: (event: "connection", listener: (computer: Computer) => unknown) => this;
}

export class Server extends EventEmitter {
  private httpServer: HTTPServer;
  private socketServer: WebSocketServer;
  constructor(opts?: { server?: HTTPServer }) {
    super();
    if (!opts?.server)
      this.httpServer = (() => {
        const server = new HTTPServer();
        attachClientSource(server);
        return server;
      })();
    else this.httpServer = opts.server;

    this.socketServer = new WebSocketServer({ server: this.httpServer });
    this.socketServer.on("connection", (socket) => {
      const computer = new Computer(socket);
      this.emit("connection", computer);
    });
  }

  listen(
    port?: number,
    hostname?: string,
    backlog?: number,
    listeningListener?: () => void
  ) {
    this.httpServer.listen(port, hostname, backlog, listeningListener);
  }

  close() {
    this.socketServer.close();
    this.httpServer.close();
  }
}
