import { isAuthenticated } from "../../../middlewares";
import {prisma} from "../../../../generated/prisma-client"
export default{             //개인이 좋아요를 누르거나 지우는 기능
    Mutation:{
        toggleLike: async(_,args ,{request}) => {
            isAuthenticated(request);
            const{postId} =args;
            const {user} = request;
            const filterOptions = {
                AND: [  //아이디와 그림(post) 아이디가 일치하는 것을 좋아요하려는 것
                    {
                        user:{
                            id: user.id
                        }
                    },
                    {
                        post:{
                            id:postId
                        }
                    }
                ]
            };
            try{
                const existingLike =await prisma.$exists.like(filterOptions);
                if(existingLike){  
                    await prisma.deleteManyLikes(filterOptions);
                }else{  //없으면 새롭게 like를 만들 것
                    await prisma.createLike({
                        user: {
                            connect:{
                                id : user.id
                            }
                        },
                        post: {
                            connect:{
                                id:postId
                            }
                        }
                    });
                }
            }catch{
                return false;
            }
            return true;
        }
    }
};