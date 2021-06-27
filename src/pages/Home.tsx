import illustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'
import googleIconImg from '../assets/images/google-icon.svg'


import { useHistory } from 'react-router-dom';

import'../styles/auth.scss';
import { Button } from '../components/Button';

import { useAuth } from '../hooks/useAuths';
import { FormEvent, useState } from 'react';
import { database } from '../services/firebase';

//importar um arquivo svg vem do webback
//webback é um module bundler

export function Home() {
	const history = useHistory();
	const {user,  signInWithGoogle   } = useAuth();
    const [roomCode, setRoomCode] = useState('');
    
	async function handleJoinRoom(event:FormEvent){
		event.preventDefault();
		console.log("Abrindo form")

		if( roomCode.trim() === ''){
			alert('Digite o código da sala!');
			return;
		}

		const roomRef = await database.ref(`rooms/${roomCode}`).get();

		if( !roomRef.exists() ){
			alert("A sala não exise!");
			return;
		}

        if(roomRef.val().endedAt){
            alert('Essa sala já encerrou');
            return;
        }

		history.push(`/rooms/${roomCode}`);
	}
	async function handleCreateRoom(){
        if(!user){
           await signInWithGoogle()
        }

    	history.push('/rooms/new') 
	}
   return (
       <div id="page-auth">
            <aside>
                <img src={illustrationImg} alt="ilustração simbolizando perguntas e respostas" />

                <strong>Crie salas de Q&amp;A ao-vivo</strong>
                <p>Tire as dúvidas da sua audiência em tempo real</p>
            </aside>
            {/* Usa-se className para definir classes de css (pq "class") é uma palavra chave do próprio js para criação de classes de programação  */}
            <main >
                <div className="main-content">
                    <img src={logoImg} alt="Logo letmeask" />
                    <button onClick={handleCreateRoom} className="create-room">
                        <img src={googleIconImg} alt="Logo do google" />
                        Crie sua sala com o Google
                    </button>
                    <div className="separator">ou entre em uma sala</div>
                    <form onSubmit={handleJoinRoom}>
                        <input 
                            type="text" 
                            placeholder="Digite o código da sala"
							onChange={ event=>setRoomCode( event.target.value ) }
							value={roomCode}
                        />
                        
                        <Button type="submit">
                            Entrar na sala
                        </Button>
                    </form>
                </div>
            </main>
       </div>
   )
}