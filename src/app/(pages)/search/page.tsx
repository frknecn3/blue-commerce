'use client'
import Fuse from "fuse.js"
import { useSearchParams } from "next/navigation"
import { Suspense, useEffect, useState } from "react"
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
            <Suspense>
            {searchResults.map((i,a)=>(<ProductCard params={i} key={a}/>))}
            </Suspense>
        </div>
    )

}

export default SearchPage