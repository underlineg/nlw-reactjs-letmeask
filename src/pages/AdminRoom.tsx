
import { useHistory, useParams } from 'react-router-dom';
import logoImg from '../assets/images/logo.svg';
import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';
import { useAuth } from '../hooks/useAuths';

import '../styles/room.scss';
import deleteImg from '../assets/images/delete.svg';
import checkImg from '../assets/images/check.svg'
import answerImg from '../assets/images/answer.svg'


import { Question } from '../components/Question/index';
import { useRoom } from '../hooks/useRoom';
import { database } from '../services/firebase';




type RoomParams = {
    id: string;

}



export function AdminRoom(){
    //"<RoomParams> é um generic"
    const {user} = useAuth();
    const history = useHistory();
    const params = useParams<RoomParams>();
    const roomId = params.id;
    const { title, questions } = useRoom(roomId);

    

    async function handleEndRoom() {
        console.log("deletando a sala?")
        await database.ref(`rooms/${roomId}`).update({
            endedAt: new Date()
        })

        history.push('/')
    }


    async function handleDeleteQuestion(questionId: string){
        console.log("Startou sozinho?")
        if (window.confirm('Tem certez que deseja excluir essa pergunta?')){
            await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
        }
    }

    async function handleCheckQuestionAnswered(questionId: string){
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isAnswered: true
        })

        console.log("marcar respondida")
    }
    async function handleHighlightQuestion(questionId: string){
        console.log("dar highlight")

        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isHighlighted: true
        })

    }

    

    return(
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="Letmeask" /> 
                    <div>
                        <RoomCode code={roomId} />
                        <Button isOutlined  onClick={  handleEndRoom }>Encerrar sala</Button>
                    </div>
                </div>
            </header>
            <main className="content">
                 <div className="room-title">
                     <h1>Sala {title}</h1>
                     { questions.length > 0 && <span>{questions.length} perguntas</span> }
                 </div>
                 
                 {/* {JSON.stringify(questions)} */}
                 <div className="question-list">
                     {/* o react precisa de uma key em toda listagem que faz nos mapings dos arrays */}
                    { questions.map(question => {
                        return( 
                            <Question
                                key={question.id}
                                content={question.content}
                                author={question.author}
                                isAnswered = {question.isAnswered}
                                isHighlighted = {question.isHighlighted}
                            >
                                { !question.isAnswered && (
                                    // isso é um fragment
                                    <>
                                    <button
                                        type="button"
                                        onClick={() => handleCheckQuestionAnswered(question.id)}
                                    >
                                     <img src={checkImg} alt="Marcar pergunta respondida" />
                                    </button>

                                    <button

                                        type="button"
                                        onClick={() => handleHighlightQuestion(question.id)}
                                        >
                                        <img src={answerImg} alt="Dar destaque à pergunta" />
                                    </button>
                                    </>
                                )}

                                <button
                                
                                    type="button"
                                    onClick={() => handleDeleteQuestion(question.id)}
                                >
                                    <img src={deleteImg} alt="Deletar pergunta" />
                                </button>

                                
                            </Question>                            
                        )
                    }) }
                 </div>
            </main>
        </div>
    )
}

//algoritimo de reconciliação esstudar 