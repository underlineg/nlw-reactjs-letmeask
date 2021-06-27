import { title } from "process";
import { useEffect, useState } from "react";
import { database } from "../services/firebase";
import { useAuth } from "./useAuths";

type QuestionType = {
    id: string;
    author: {
        name: string;
        avatar: string
    }
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
    likeCount: number;
    hasLiked: boolean;
    likeId: string | undefined;
}

type FirebaseQuestions = Record< string, {
    author: {
        name: string;
        avatar: string
    }
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
    likes: Record< string, {
        authorId: string    
    }>
    
} >;



export function useRoom(roomId:string){
    const { user } = useAuth();
    const [ questions, setQuestions ] = useState<QuestionType[]>([]);
    const [title, setTitle] = useState('');

    //isso aqui é um hook
    //() => {} evento
    // [] = componente que mudar q vai disparar toda vez que o componente mudar
    useEffect( () => {
        const roomRef = database.ref(`rooms/${roomId}`);
        roomRef.on('value', room =>{
            const databaseRoom = room.val(); 
            const firebaseRoom : FirebaseQuestions =  databaseRoom.questions ?? {};

            //estudar depois sobre "desestruturação"
            const parsedQuestions = Object.entries(firebaseRoom).map( ([key, value] ) => {
                return{
                    id: key,
                    content: value.content,
                    author: value.author,
                    isHighlighted: value.isHighlighted,
                    isAnswered: value.isAnswered,
                    likeCount: Object.values( value.likes ?? {}  ).length,
                    hasLiked: Object.values( value.likes ?? {} ).some(like => like.authorId === user?.id), //deletar depois

                                                                                                                 //?.[0] retorna a propriedade 0 apenas se a chamada do firebase não tiver recebido nulo
                    likeId: Object.entries( value.likes ?? {}).find( ([key, like]) => like.authorId === user?.id ) ?.[0]
                } 
            })
            setTitle( databaseRoom.title );
            setQuestions(parsedQuestions);

        })

        
    },  
        [ roomId, user?.id ] 
    )  ;

    return { questions, title}

}