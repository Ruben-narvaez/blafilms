import React, { useState, useEffect } from 'react'
import './App.css'
import placeholderImg from './placeholder.png'
import { ReactComponent as ChevronLeft } from './chevron-left.svg'
import { ReactComponent as ChevronRight } from './chevron-right.svg'

function App() {

  const [searchResult, setSearchResult] = useState()
  const [currentPage, setCurrentPage] = useState(1)
  const [searchBoxTemporal, setSearchBoxTemporal] = useState()
  const [searchBoxSubmit, setSearchBoxSubmit] = useState("")

  
  const handleInputChange = e => {  

    const { value } = e.target
    setSearchBoxTemporal(value)

  }

  const handleSubmit = e => {

    e.preventDefault()
    setSearchBoxSubmit(searchBoxTemporal)
    setCurrentPage(1)
    e.target.reset()
  }
  
  useEffect(() => {

    const search = async () => {  
      const response = await fetch(
        `http://www.omdbapi.com/?apikey=a461e386&s=${searchBoxSubmit}&page=${currentPage}`,
        )
        
      const data = await response.json()
          setSearchResult(data)      
    } 
    search()

  }, [searchBoxSubmit, currentPage])

  return (

    <div className="App">
      
      <form className="search" onSubmit={handleSubmit}>
        <input type="text" onChange={handleInputChange} placeholder="Search..." />
        <button type="submit">Search</button>
      </form>
      {!searchResult || searchResult.Search === undefined ? (
        <h5 className="introduce-title">Write a movie title (or a word...) on the search bar</h5>
      ) : (
        <div className="search-results">
          <div className="chevron">
              {currentPage > 1 && (<ChevronLeft onClick={() => setCurrentPage(currentPage - 1)} />)}
          </div>
            <div className="search-results-list">
              {/* En la línea de abajo añado una suma del idx al key porque a veces se repetía una película y me saltaba un fallo en la consola de que había dos child con el mismo key */}
              {searchResult.Search.map((result, idx) => (
                <div key={result.imdbID + idx} className="search-item">
                  <img
                    src={result.Poster === 'N/A' ? placeholderImg : result.Poster}
                    alt="poster"
                  />
                  <div className="search-item-data">
                    <div className="title">{result.Title}</div>
                    <div className="meta">{`${result.Type} | ${result.Year}`}</div>
                  </div>
                </div>
              ))}
            </div>
          <div className="chevron">
            {searchResult.Search.length > 9 && (<ChevronRight onClick={() => setCurrentPage(currentPage + 1)} />)}
          </div>
        </div>
        )}
      
    </div>
  )
}

export default App
