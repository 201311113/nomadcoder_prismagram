import { prisma } from "../../../../generated/prisma-client";


export default{
    Mutation:{
        sendMessage: async(_,args,{request,isAuthenticated})=>{ //room, 상대방은 있을수도 없을 수 도있다
            isAuthenticated(request);
            const {user} = request;
            const {roomId, message, toId} = args;
            let room;
            if(roomId === undefined){   //room이 없으면 새로 만들기
               if(user.id !== toId){  // 내가 나에게 보내는 룸 안나오게
                room = await prisma.createRoom({
                    participants:{
                        connect:[   //내가 보낸사람 , 나에게 방을 둘다 만들어야징?
                            {id:toId},
                            {id:user.id}
                        ]
                    }
                }).$fragment(ROOM_FRAGMENT);
               }// fragment로 참여자 id들 정보를가져옴
            }else{  //room이 있으면 메시지만 넣어줌
                room = await prisma.room({id:roomId}).$fragment(ROOM_FRAGMENT);
            }
            if(!room){
                throw Error("chat room is not existed");
            }
            //getTo는 request의 유저정보가 아닌 방을 만들거나 찾으면서 얻은 참가자 id를 의미함
            const getTo = room.participants.filter(
                participant => participant.id !== user.id
            )[0];   //상대 아이디와 
            return prisma.createMessage({
                text: message,
                from:{
                    connect:{id:user.id}
                },
                to:{
                    connect:{
                        id: roomId ? getTo.id : toId
                    }
                },
                room:{
                    connect:{
                        id:room.id
                    }
                }
            });
        }
    }
};