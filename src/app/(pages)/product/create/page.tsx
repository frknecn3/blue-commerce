'use client'
import { addDoc, arrayUnion, collection, doc, setDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useEffect, useLayoutEffect, useState } from "react";
import { categories, ProductParams } from "../../../../constants/constants";
import { db, storage } from "../../../../firebase/config";
import './style.css'
import { v4 as randomUUID } from 'uuid';
import { redirect, useRouter } from "next/navigation";
import { uploadMedia } from "../../../../utils/utils";
import Image from "next/image";


const CreateProduct = () => {
    
    const [img,setImg] = useState(null)
    const [user,setUser] = useState<{uid:string} | null>(null)
    const router = useRouter()

    useLayoutEffect(()=>{
        const user = JSON.parse(localStorage.getItem('user'))
        setUser(user)
        user?'':redirect('/login')
    },[])




    const handleImageChange = (event) => {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onloadend = () => {
                setImg({
                    file: file,
                    src: reader.result,
                });
            };

            reader.readAsDataURL(file);
        }
    };

    const handleForm = async (e)=>{
        e.preventDefault()

        const image = await uploadMedia(e.target[0].files[0])
        
        const data:ProductParams = {
            version:1,
            datePublished: new Date().toString(),
            id:randomUUID(),
            name:e.target[1].value,
            price:`${e.target[2].value} $`,
            quantity:1,
            photoURL:image,
            seller:user.uid,
            desc:e.target[3].value,
            category:e.target[4].value,
            


        }
        const uploadDocument = async () => {
            console.log(user.uid)
            try {
              // Add a new document with an auto-generated ID to a collection
              const userRef = doc(db, "users", user.uid);
              await updateDoc(userRef,{
                allProducts:arrayUnion(data.id)
              })
              const docRef = await addDoc(collection(db, "products"), data);
            } catch (e) {
              console.error("Error adding document: ", e);
            }
            
    }
    await uploadDocument()
    router.push('/')
    }

    return (
        user?
        <div className="justify-center items-center flex">
            <div className="border-2 border-neutral-600 p-[30px] rounded-xl inline-block">
            <form onSubmit={handleForm} className="text-[30px] flex flex-row justify-center items-center gap-10">
                <div className="justify-start flex flex-col">
                    <label htmlFor="image"><img className="rounded-xl" src={img?img.src:"https://uxwing.com/wp-content/themes/uxwing/download/video-photography-multimedia/upload-image-icon.png"} width={img?450:150} alt="" /></label>
                    <input type="file" id="image" onChange={handleImageChange} hidden />
                </div>

                <div>
                <div className="justify-start flex flex-col">
                    <label htmlFor="name">Name</label>
                    <input type="text" id="name" />
                </div>
                <div className="justify-start flex flex-col">
                    <label htmlFor="price">Price</label>
                    <input type="number" id="price" />
                </div>
                <div className="justify-end flex flex-col">
                    <label htmlFor="desc">Description</label>
                    <textarea id="desc" />
                </div>
                <div className="justify-end flex flex-col">
                    <label htmlFor="category">Category</label>
                    <select id="category">
                        {categories.map((i,key)=>(<option key={key}>{i}</option>))}
                    </select>
                </div>
                </div>
                <button>Upload Product</button>
            </form>
        </div>
        </div>:''
    );
}
export default CreateProduct;