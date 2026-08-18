import CreateProductForm from './form'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic';

type Props = {}

const CreateProductPage = async (props: Props) => {

    const categories = await prisma.category.findMany({});

    const stores = await prisma.store.findMany({})

    return (

        <div className='mx-[5vw] md:mx-[7vw] lg:mx-[10vw] xl:mx-[15vw] py-[5vh]'>
            <CreateProductForm categories={categories} stores={stores} />
        </div>
    )
}

export default CreateProductPage