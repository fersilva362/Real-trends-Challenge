import * as React from "react";
import {useState} from 'react'
import SocketIO from "socket.io-client";
import CircularProgress from './CircularProgress';
import MercadoL from './MercadoL'
import logo from "~/assets/logo.svg";
import styles from "./Home.module.scss";
import avatar1 from '~/assets/avatar-1.jpg'
import avatar2 from '~/assets/avatar-2.jpg'
import avatar3 from '~/assets/avatar-3.jpg'
import avatar4 from '~/assets/avatar-4.jpg'
import {useRef} from 'react'
import Poll from './Poll'
import Novotes from './Novotes'

const socket = SocketIO.io("http://localhost:5000");

interface Product {
  title:string,
  description?:string,
  key:number,
  image:string,
  external?:string
}
interface Vote {
  user:string,
  review?:string,
  vote:Product['key']
}
interface State {
  products:Product[],
  votes:Vote[]
}

const Home: React.FC = () => {
  const [state, setState]=useState<State>({products:[],votes:[]})
 
  const [hideForm, setHideForm]=useState(false)
  const [newUser, setNewUser]=useState('')
  const [newReview, setNewReview]=useState('')
  const [status, setStatus]= useState('active')
  const [poll,setPoll]= useState<number>(0)
  const totalVotes=state.votes.length 
  
  function handleStatus(arg:string){
    setStatus(arg)
  }
  
 
  ///avatar y colores para los usuarios
 const imgRamdom=[avatar1,avatar2,avatar3,avatar4,avatar1,avatar2,avatar3,avatar4]
 const colors=['teal', '#C4421A','#f98f45']

//se carga el estado
  React.useEffect(() => {
    if(state.products.length===0){
    socket.on("state", (state: State) => setState(state));}
  }, []);

//para adicionar voto
let newState={...state}
    React.useEffect(()=>{
      if (!newUser) return
      if (state.products.length!==0){
    const userFilter=state.votes.filter(ele=>ele.user===newUser)
    
    if(poll!==0 && userFilter.length==0){
      newState.votes.push({user:newUser, vote:poll, review:newReview})
     } 
     else if (poll!==0 && userFilter.length!==0){
       newState.votes.map(ele=>{if(ele.user===newUser){ele.vote=poll} return ele})
     }
     
     
      socket.emit('poll', newState);
      setPoll(0);
      setNewReview('');setNewUser('');setStatus('active')
    }
    },[newUser, newReview, poll,status]) 

    function handlePoll(arg:number){      
      console.log(arg);setPoll(arg);setHideForm(!hideForm)
    }

    
    ///manejar reset
     React.useEffect(()=>{if (status==='reset'){ newState.votes=[];  socket.emit('reset',newState )
    ;}},[status]) 

    ////para ver el ultimo scroll item
  const scrollRef = React.useRef(null)
    
    React.useEffect(()=>{
      if( totalVotes!==0 ){scrollRef.current?.lastElementChild?.scrollIntoView(false);
         console.log(scrollRef.current.lastElementChild)}
       else return
        },[state.votes])
      
 
  ///// section control form con data user, review
  function handleSubmit(e){
    e.preventDefault()
    const novoUser=e.target.user.value;
    setNewUser(novoUser);    
    const novoReview=e.target.review.value
    setNewReview(novoReview)
    setHideForm(false)
  }

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <h1>
          <img  alt="RealTrends" src={logo} width={180} />
        </h1>
        <h3>Lets get this party started</h3>
      </header> 
      <div className={styles.container0}>
       <MercadoL status={status} state={state} handlePoll={handlePoll} />
       {/* Section de votes */}
       <div className={styles.containerI}>
      {totalVotes!==0 && (<div className={styles.containerII}>
      <h2> Why did you choose this answer?</h2>
      <div className={styles.opinion} ref={scrollRef}> {
                      state.votes.map((opinion:Vote,idx:number)=> {
                        return(
                            <div className={styles.review} key={idx}  >
                              
                              <img src={imgRamdom[idx]} width='50px' />
                              <div className={styles.uservote}>
                                <div className={styles.userdata}>
                                  <span  className={styles.span1}>{opinion.user} </span> 
                                  {/* <span> voted for option:</span> */}
                                  <span style={{backgroundColor:`${colors[opinion.vote-1]}`}} className={styles.opinionvote}><b>{opinion.vote}</b></span>  
                                </div>
                                <span className={styles.useropinion}>"{opinion.review||''}"</span>
                              </div>
                              
                            </div>
                        )
                      })
                      }
                  </div>
                 
                  </div>)}
{/* section que maneja formularo */}
{ totalVotes===0&& <h2 >Be the first in polling one product.<br/><span style={{color:'teal'}} >Please choose an option</span> </h2> }
       {hideForm   ? (
         <div className={styles.containForm}>
           <h2>Can you provide a product's review?</h2>
          <form className={styles.form} onSubmit={(e)=>handleSubmit(e)} >
            <input
              required
              type="text"
              id="user"
              placeholder="user"
              maxLength='10'
            />
            <br />
            <input
              type="text"
              id="review"
              maxLength='120'
              placeholder="why did you choose it?"
            />
            <br />
            <button style={{backgroundColor:`${colors[poll-1]}`}} type="submit">Submit</button>
            
            <br />
            <br />
          </form>
         </div>
         
       ) :
       <Poll handleStatus={handleStatus} status={status}/>}
       </div>
       </div>
    </main>
  );
};

export default Home;
