//여기서 user인증을 모두 처리함 그래서 resolver마다 일일히 인증 검사를 하는 번거로움을 줄여줌
export const isAuthenticated = (request)=>{
    if(!request.user){
        throw Error("you need to login to perform this action");
    }
    return ;
};