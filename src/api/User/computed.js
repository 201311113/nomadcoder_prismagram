import { prisma } from "../../../generated/prisma-client";

export default{
  User:{
    fullName: parent => {
      return `${parent.firstName} ${parent.lastName}`;
    },
    isFollowing: async(parent,_,{request})=>{
        const {user} = request;
        const {id:parentId} = parent;
        console.log(user);
        console.log(parent);
        try{
            console.log(user.id,"user");
            console.log(parentId,"parent")
            return await prisma.$exists.user({
                AND:[
                    {
                        id: user.id
                    },
                    {
                        following_some:{
                            id:parentId
                        }
                    }
                ]
            });
            
        }catch(error){
            console.log(error);
            return false;
        }
    },
    isSelf:(parent,_,{request})=>{
        const {user} = request;
        const {id:parentId} = parent;
        return user.id == parentId;
    }
  }
 
};