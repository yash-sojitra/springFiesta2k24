import React, { useEffect, useState } from 'react';
import '../styles/VotingPage.css';
import Navbar from '../components/Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import party_pooper1 from '../components/partyPooper1.svg';
import party_pooper2 from '../components/partyPooper2.svg';
import sprinklers1 from '../components/sprinklers1.svg';
import sprinklers2 from '../components/sprinklers2.svg';
import circus_tent from '../components/circusTent.svg';
import images from "../image.json";
import { Link, useNavigate } from 'react-router-dom';
import { decodeToken } from 'react-jwt';

function VotingPage() {
  const [data, setData] = useState([])
  const navigate = useNavigate()

  const fetchData = async () => {
    const response = await fetch('https://spring-fiesta-2k24-backend.onrender.com/candidate', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    const val = await response.json()
    setData(val)
    data.sort((a, b) => b.count - a.count)
  }

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line
  }, [])

  const UpdateLike = async (candi) => {

    if (localStorage.getItem('token')) {
      const decodedId = decodeToken(localStorage.getItem('token'))
      if (!decodedId.isVoted) {
        const response = await fetch(`https://spring-fiesta-2k24-backend.onrender.com/candidate/${candi.id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': localStorage.getItem('token')
          },
        })
        const val = await response.json()
        if (val.success) {
          localStorage.setItem('token', val.token)
          fetchData()
          alert('Voted Successfully')

        } else {
          alert('You have already voted')
        }
      } else {
        alert('You have already voted')
      }
    } else {
      navigate('/register')
    }
  }
  return (
    <div>
      <Navbar />
    <div className='main-body'>
      <div className="title">
        <p>VOTING PAGE</p>
      </div>
      <div className="search-container">
        <input type="text" placeholder="Search..." />
        <Link to="/"><FontAwesomeIcon icon={faSearch} className="search-icon" /></Link>
      </div>
      <div className='sprinklers'>
        <img src={sprinklers1} className="sprinklers1" alt="sprinklers1" />
        <img src={sprinklers2} className="sprinklers2" alt="sprinklers2" />
      </div>
      <div className="box">
        {data.map((candidate) => {
          return (
            <div className="box-container">
              <div className="main-image">
                <img src={`/images/${candidate.name}.svg`} alt="image1" />
              </div>
              <div className='container-details'>
                <text className='name'>{candidate.name}</text>
                <div className='voting-count'>
                  <button className='like-btn' onClick={() => UpdateLike(candidate)} >
                    <div className="like-img">
                      <img src={images[0].like} alt="Like" />
                    </div>
                    <h4>{candidate.count}</h4>
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <div className='canvas'>
        <img src={party_pooper1} className="party-pooper1" alt="party-pooper1" />
        <img src={circus_tent} className="circus" alt="circus" />
        <img src={party_pooper2} className="party-pooper2" alt="party-pooper2" />
      </div>
    </div>
    </div>
  );
}
export default VotingPage;