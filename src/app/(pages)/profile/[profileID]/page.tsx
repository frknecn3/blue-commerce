import ProductCard from "../../../../components/ProductCard";
import { getAllProductsOfUser, getUser } from "../../../../utils/utils";
import '../../../../components/css/index.css'

const Profile = async ({ params }: { params: { profileID: string } }) => {

    const user = await getUser(params.profileID.toString())
    const products = await getAllProductsOfUser(params.profileID)

    return (
        <div className="w-full">
            <div className="flex flex-col 2xl:flex-row justify-around items-center 2xl:items-start m-2 lg:p-20">
                <div className="w-[10rem] 2xl:sticky top-20 lg:w-[20rem] flex flex-col justify-center items-center mt-[2rem]">
                    <img src={user.photoURL} className='rounded-[50%] border-4 border-black' alt="" />
                    <p className="text-center text-[1.5rem]">{user.name}</p>
                </div>

                <div className="w-[10rem]"></div>

                <div className="w-full bg-blue-300 m-4 p-1 rounded-xl flex flex-col justify-center items-center">
                    <span className="text-center">All Products of This User</span>
                    <div className="w-full p-2 rounded-xl grid-container">
                        {products.map((product) => (<div className="mb-1" key={product.id}><ProductCard params={product} /></div>))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;