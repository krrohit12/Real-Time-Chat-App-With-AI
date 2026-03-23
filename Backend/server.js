import 'dotenv/config';
import http from 'http'
import app from './app.js'
import { Server } from 'socket.io'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose';
import projectModel from './models/project.model.js';
import { generateResult } from './services/ai.service.js';
const port = process.env.PORT || 3000
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*'
    }
});

io.use(async(socket, next) => {
    try {
        const token = socket.handshake.auth?.token || socket.handshake.headers.authorization?.split(' ')[1];
        const projectId = socket.handshake.query.projectId
        console.log(projectId)
        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return next(new Error('Authentication error'))
        }

        socket.project=await projectModel.findById(projectId) ;

        if (!token) {
            return next(new Error('Authentication error'))
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return next(new Error('Authentication error'))
        }
        socket.user = decoded;
        next();

    } catch (err) {
        next(err);
    }

})



io.on('connection', socket => {
    socket.roomId=socket.project._id.toString();
    console.log('a user connected')
    socket.join(socket.roomId)

    socket.on( 'project-message',async data=>{
        try {
            const message=data.message;
            const aiIsPresent=message.includes('@ai');

            const messageData = { message, sender: socket.user };

            await projectModel.findByIdAndUpdate(socket.roomId, {
                $push: { messages: messageData }
            });

            socket.broadcast.to(socket.roomId).emit('project-message', messageData)

            if(aiIsPresent){
                const prompt=message.replace('@ai','');
                const result=await generateResult(prompt)

                const aiMessage = {
                    message: result,
                    sender: { _id:'ai', email:'AI' }
                };

                const parsedResult = JSON.parse(result);
                const updateData = { $push: { messages: aiMessage } };
                if (parsedResult.fileTree) {
                    updateData.$set = { fileTree: parsedResult.fileTree };
                }

                await projectModel.findByIdAndUpdate(socket.roomId, updateData);

                io.to(socket.roomId).emit('project-message', aiMessage)
                return
            }
        } catch(err) {
            console.error('AI error:', err.message);
            io.to(socket.roomId).emit('project-message',{
                message: JSON.stringify({ text: `Error: ${err.message}` }),
                sender:{ _id:'ai', email:'AI' }
            })
        }
    })
    socket.on('disconnect', () => {
        console.log('user disconnected')
        socket.leave(socket.roomId)
     });
});
server.listen(port, () => {
    console.log(`server is running on ${port}`);
})