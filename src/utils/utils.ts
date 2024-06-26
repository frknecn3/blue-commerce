import { addDoc, arrayRemove, arrayUnion, collection, doc, getDocs, onSnapshot, orderBy, query, setDoc, updateDoc, where } from "firebase/firestore";
import { cache } from "react";
import { db, storage } from "../firebase/config";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 as randomUUID } from 'uuid';
import { ProductParams, ReviewParams, User } from "../constants/constants";
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import { ReadonlyURLSearchParams } from 'next/navigation'
import { Option } from "../constants/constants";



export const getProducts = cache(async (params?) => {
  console.log('params:', params)
  let { sort = '', category = '' } = params || {};

  const baseQuery = query(collection(db, 'products'));

  // Define an array to hold additional query constraints
  const additionalConstraints: any[] = [];

  if (category) {
    additionalConstraints.push(where('category', '==', category));
  }

  if (sort) {
    additionalConstraints.push(orderBy('price', sort === 'ascendingprice' ? 'asc' : 'desc'));
  }

  // Combine the base query with additional constraints
  const newQuery = query(baseQuery, ...additionalConstraints);

  const querySnapshot = await getDocs(newQuery);
  const docs = querySnapshot.docs.map((product) => product.data() as ProductParams); // Access the documents array

  return docs;
})

export const getSpecificProduct = async (id: string): Promise<ProductParams | null> => {
  if (id) {
    const q = query(collection(db, "products"), where("id", "==", id));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.docs.length > 0) {
      const doc = querySnapshot.docs[0].data();
      return doc as ProductParams;
    } else {
      return null;
    }
  }
  else { console.log('id is ', typeof id) }
};

export const getAllProductsOfUser = async (id: string): Promise<ProductParams[] | null> => {
  const q = query(collection(db, "products"), where("seller", "==", id))
  try {
    const querySnapshot = await getDocs(q)
    const docs = querySnapshot.docs.map((product) => product.data())
    return docs as ProductParams[];
  }
  catch (err) {
    console.log(err)
  }
}

export const uploadDocument = async (user, data) => {
  try {
    // Add a new document with an auto-generated ID to a collection
    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, {
      allProducts: arrayUnion(data.id)
    })
    const docRef = await addDoc(collection(db, "products"), data);
  } catch (e) {
    console.error("Error adding document: ", e);
  }

}

export const getCart = async (id: string): Promise<ProductParams[] | null> => {
  const user = await getUser(id);

  if (!user || !id) {
    console.log('first condition ran');
    console.log(getAnonymousCart());
    const promises: Promise<ProductParams>[] = getAnonymousCart().map(async (i) => {
      return await getSpecificProduct(i);
    });

    const products = await Promise.all(promises);
    return products as ProductParams[];
  } else {
    console.log('second condition ran');
    const q = query(collection(db, 'users'), where('userID', '==', id));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const preprocessDoc = querySnapshot.docs[0].data().cart || [];
      const Promises = preprocessDoc.map(async (productId: string) => {
        return await getSpecificProduct(productId);
      });
      const products1 = await Promise.all(Promises);

      const products = products1.filter(product => product !== null && product !== undefined);

      if (products) {
        localStorage.setItem('cart', JSON.stringify(products));
        return products as ProductParams[];
      } else {
        return null;
      }
    } else {
      return null; // No documents found
    }
  }
};

export const listenCart = (id: string, dispatch?: (action: {}) => void): Promise<ProductParams[] | null> => {
  return new Promise((resolve, reject) => {
    const q = query(collection(db, "users"), where("userID", "==", id));

    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      try {
        if (!querySnapshot.empty) {
          const preprocessDoc = querySnapshot.docs[0].data().cart;
          const Promises = preprocessDoc.map(async (product: string) => {
            return await getSpecificProduct(product);
          });

          const doc = await Promise.all(Promises);

          if (doc) {
            resolve(doc as ProductParams[]);
            dispatch ? dispatch({ type: 'UPDATE_USER', payload: { cart: doc } }) : ''
          } else {
            resolve(null);
          }
        } else {
          resolve(null); // No documents found
        }
      } catch (error) {
        console.error('Error in onSnapshot:', error);
        reject(error);
      }
    });

    return () => unsubscribe();
  });
};

export const addToCart = async (uid: string, productId: string): Promise<String | undefined> => {

  const user = await getUser(uid)

  if (user) {
    try {
      const userRef = doc(db, "users", uid);
      await updateDoc(userRef, {
        cart: arrayUnion(productId)
      })
      reloadCart(uid)
      return 'Successful'
    } catch (err) { console.log(err) }
  }
  else {
    addToAnonymousCart(productId)
  }


}

export const removeFromCart = async (uid: string, productId: string): Promise<string | undefined> => {

  const user = await getUser(uid)

  if (user) {
    try {
      if (!db || !uid || !productId) {
        console.error("Invalid parameters for removeFromCart");
        return undefined;
      }

      const userRef = doc(db, "users", uid);
      await updateDoc(userRef, {
        cart: arrayRemove(productId)
      });
      reloadCart(uid)
      localStorage.setItem('cart', JSON.stringify(await getCart(uid)))
      return 'Successful';
    } catch (err) {
      console.error(err);
    }
  }
  else {
    removeFromAnonymousCart(productId)
  }
}

export const getUser = async (id: string): Promise<User | null> => {
  const q = query(collection(db, "users"), where("userID", "==", id))
  const querySnapshot = await getDocs(q)
  const doc = querySnapshot.docs[0] ? querySnapshot.docs[0].data() : ''
  if (typeof doc === 'object') {
    return doc as User;
  } else {
    return null;
  }
}

export const uploadMedia = async (file): Promise<string | null> => {
  if (!file) {
    return null;
  }
  // get the ref of the place where the file is going to be uploaded
  const fileRef = ref(storage, file.name + randomUUID());

  try {
    // upload the file to the reference of the location
    const uploadTaskSnapshot = await uploadBytes(fileRef, file);

    // Get and return the download URL
    return await getDownloadURL(uploadTaskSnapshot.ref);
  } catch (error) {
    console.error('Error uploading media:', error);
    return null;
  }
};

export const reloadCart = async (id: string, dispatch?: (action: { type: string, payload: { cart: ProductParams[], user?: User | {} } }) => void) => {
  const cart = await getCart(id);

  dispatch ? dispatch({
    type: 'UPDATE_USER',
    payload: { cart: cart, user: {} }
  }) : ('')

  try {
    localStorage.setItem('cart', JSON.stringify(cart))
  } catch (err) { console.log(err) }
}

export const checkUser = async (user: any) => {
  try {
    const q = query(collection(db, "users"), where("userID", "==", user.uid))
    const querySnapshot = await getDocs(q)
    if (querySnapshot.docs.length === 0) {
      const usersRef = doc(db, 'users', user.uid)
      const newUser: User = {
        userID: user.uid,
        photoURL: user.photoURL,
        name: user.displayName,
        cart: [],
        allProducts: [],
        wishlist: []

      }
      await setDoc(usersRef, newUser)
      console.log('user is new, creating an account')
    }
    else {
      console.log('successfully logged in')
    }

  }
  catch (err) { console.log(err) }
}



export const addToAnonymousCart = (productId: string): void => {
  let tempCart = JSON.parse(localStorage.getItem('tempCart')) || [];
  tempCart.push(productId);
  localStorage.setItem('tempCart', JSON.stringify(tempCart));
};

export const removeFromAnonymousCart = (productId: string): void => {
  let tempCart = JSON.parse(localStorage.getItem('tempCart')) || [];
  const updatedCart = tempCart.filter((i: string) => i !== productId)
  localStorage.setItem('tempCart', JSON.stringify(updatedCart));
}

export const getAnonymousCart = (): string[] => {
  try { return JSON.parse(localStorage.getItem('tempCart')) }
  catch (error) { console.log(error) }
}

export const getAllProducts = async (): Promise<ProductParams[]> => {
  try {
    const docQuery = query(collection(db, 'products'))
    const querySnapshot = await getDocs(docQuery)
    const docs = querySnapshot.docs.map((i) => { return i.data() as ProductParams })
    return docs
  } catch (err) { console.log(err) }
}

export const getReviews = async (id: string): Promise<ReviewParams[]> => {

  const product = await getSpecificProduct(id)
  const reviews = product.reviews
  const updatedReviews = reviews.map(async (review: ReviewParams) => {
    const userObj = await getUser(review.sender)
    return { ...review, userObj }
  })

  const docPromise = await Promise.all(updatedReviews)
  const finalDocs = docPromise.flat()
  return finalDocs as ReviewParams[];
};






export const handleSortCategory = (e: Option, router: AppRouterInstance, queryparams: ReadonlyURLSearchParams, pathname: string) => {
  const current = new URLSearchParams(Array.from(queryparams.entries())); // -> has to use this form
  current.set('sort', e.value)


  const search = current.toString();

  const query = search ? `?${search}` : "";

  router.replace(`${pathname}${query}`, { scroll: false });
};