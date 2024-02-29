'use client'
import Fuse from "fuse.js"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import ProductCard from "../../../components/ProductCard"
import { getAllProducts } from "../../../utils/utils"
import '../../../components/css/index.css'

const SearchPage = () =>{

    const search = useSearchParams()
    const searchQuery = search?search.get('q'):null
    const [searchResults,setSearchResults] = useState([])

    useEffect(()=>{

        const modify = async () =>{
            try{
                const fuzzyOptions = {
                    keys: ['name'], // Specify the field to search against
                    includeScore: true,
                    threshold: 0.4, // Adjust the threshold based on your preference
                  };
                const prods = await getAllProducts();
                const fuse = new Fuse(prods,fuzzyOptions)
                const fuzzyResults = fuse.search(searchQuery)
                const results =fuzzyResults.map((result)=>result.item)
                console.log(results)
                  setSearchResults(results)
            }catch (error) {console.log(error)}
        }

        modify()

    },[searchQuery])

    return(
        <div className="grid-container">
            {searchResults.map((i)=>(<ProductCard params={i}/>))}
        </div>
    )

}

export default SearchPage