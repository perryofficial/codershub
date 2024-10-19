const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const bodyParser = require("body-parser");
const compiler = require('compilex');
const options = { stats: true }; //prints stats on console 
compiler.init(options);

app.use(bodyParser.json());
app.use("/Client", express.static("D:/FullStack Projects/Code_Collaborator/Client"))
app.use(cors())


// sockit server
const server = http.createServer(app);
const io = new Server(server);

const Port = process.env.Port || 5000;

const userSocketMap = {};

const getAllConnectedClients = (roomId) => {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId) => {
    return {
      socketId,
      username: userSocketMap[socketId],
    }
  });
}
io.on("connection", (socket) => {
  // console.log(`User connected: ${socket.id}`);
  socket.on("join-room", ({ roomId, username }) => {
    userSocketMap[socket.id] = username;
    socket.join(roomId);
    const clients = getAllConnectedClients(roomId);
    // notify to all user that new user has joined
    clients.forEach(({ socketId }) => {
      io.to(socketId).emit("joined-room",
        {
          clients,
          username,
          socketId: socket.id,
        });
    });
  });
  socket.on("code-change", ({ roomId, code }) => {
    socket.in(roomId).emit("code-change", { code });
  });

  socket.on("sync-code", ({ socketId, code }) => {
    io.to(socketId).emit("code-change", { code });
  });


  socket.on('disconnecting', () => {
    const rooms = [...socket.rooms];
    rooms.forEach((roomId) => {
      socket.in(roomId).emit("disconnected", {
        socketId: socket.id,
        username: userSocketMap[socket.id],
      })
    })
    delete userSocketMap[socket.id];
    socket.leave();
  })

});


app.get("/", (req, res) => {
  compiler.flush(()=>{
    console.log("Deleted")
  })
  res.sendFile("D:/FullStack Projects/Code_Collaborator/Client/src/component/Editor.js")
})

app.post("/compile", (req, res)=> {
  var code = req.body.code;
  var input = req.body.input;
  var lang = req.body.lang;

  try {
    if (lang == "Cpp" || lang == "C") {
      if (!input) {
        var envData = { OS: "windows", cmd: "g++", options: { timeout: 10000 } }; // (uses g++ command to compile )
        compiler.compileCPP(envData, code, function (data) {

          if (data.output) {
            res.send(data);
          } else {
            res.send({ output: "Error" })
          }
          //data.error = error message 
          //data.output = output value
        });
      } else {
        var envData = { OS: "windows", cmd: "g++", options: { timeout: 10000 } }; // (uses g++ command to compile )
        compiler.compileCPPWithInput(envData, code, input, function (data) {

          if (data.output) {
            res.send(data);
          } else {
            res.send({ output: "Error" })
          }
        });
      }
    }
    else if (lang == "Java") {
      if (!input) {
        var envData = { OS: "windows" };
        compiler.compileJava(envData, code, function (data) {

          if (data.output) {
            res.send(data);
          } else {
            res.send({ output: "Error" })
          }
        });
      }
      else {
        var envData = { OS: "windows" };
        compiler.compileJavaWithInput(envData, code, input, function (data) {

          if (data.output) {
            res.send(data);
          } else {
            res.send({ output: "Error" })
          }
        });
      }
    }
    else if (lang == "Python") {
      if (!input) {
        var envData = { OS: "windows" };
        compiler.compilePython(envData, code, function (data) {

          if (data.output) {
            res.send(data);
          } else {
            res.send({ output: "Error" })
          }
        });
      } else {
        var envData = { OS: "windows" };
        compiler.compilePythonWithInput(envData, code, input, function (data) {

          if (data.output) {
            res.send(data);
          } else {
            res.send({ output: "Error" })
          }
        });
      }
    }
  } catch (error) {
    console.log(error)
  }
})


server.listen(Port, () => {
  console.log(`Server is running on port ${Port}`);
})