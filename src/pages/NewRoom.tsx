import illustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'
import { Link, useHistory } from 'react-router-dom';

import'../styles/auth.scss';
import { Button } from '../components/Button';
import { FormEvent, useState } from 'react';
import { database } from '../services/firebase';
import { useAuth } from '../hooks/useAuths';

//importar um arquivo svg vem do webback
//webback é um module bundler





export function NewRoom() {
    const  history = useHistory();
    const { user } = useAuth();
    const [newRoom, setNewRoom] = useState('');

    async function handleCreateRoom(event:FormEvent) {
        event.preventDefault();

        // console.log(newRoom);
        if( newRoom.trim() === "" ) {
            alert("Digite o nome de uma sala!")

            return false;
        }

        //isso cria um array no firebase
        const roomRef = database.ref('rooms');


        const firebaseRoom = await roomRef.push({
            title: newRoom,
            authorId: user?.id
        });
        
        history.push(`/rooms/${firebaseRoom.key}`);

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
                    <h2>Crie uma nova sala</h2>
                    <form onSubmit={handleCreateRoom}>
                        <input 
                            type="text" 
                            placeholder="Nome da sala"

                            onChange = {event => setNewRoom(event.target.value)}
                            value = { newRoom }
                        />
                        
                        <Button type="submit">
                            Criar sala
                        </Button>
                    </form>
                    <p>
                        Quer entrar em uma sala existente? Clique <Link to="/">aqui</Link>
                    </p>
                </div>
            </main>
       </div>
   )
}