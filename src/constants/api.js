export const fetchProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'products'));
      return(querySnapshot)
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }