const Docs = ({params}:{
    params:{
        slug:string[];
    }
}) => {


    return params.slug?.length===2?
    (<h1>Viewing docs for feature {params.slug[0]} and concept {params.slug[1]}</h1>):
    params.slug?.length===1?<h1>Viewing docs for feature {params.slug[0]}</h1>:<h1>Docs home page</h1>
}

export default Docs;