import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  addDoc, 
  doc, 
  getDoc, 
  updateDoc, 
  deleteDoc 
} from 'firebase/firestore';

// -----------------------------------------------------
// 1. REEMPLAZAR con la CONFIGURACIÓN DE TU PROYECTO FIREBASE
// -----------------------------------------------------
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_AUTH_DOMAIN",
  projectId: "TU_PROJECT_ID",
  storageBucket: "TU_STORAGE_BUCKET",
  messagingSenderId: "TU_MESSAGING_SENDER_ID",
  appId: "TU_APP_ID"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const PRODUCTOS_COLLECTION = 'inventario_carniceria'; // Nombre de tu colección
const inventarioCollection = collection(db, PRODUCTOS_COLLECTION);

// -----------------------------------------------------
// 2. FUNCIONES CRUD
// -----------------------------------------------------

// CREATE: Crea un nuevo producto
export const crearProducto = async (producto) => {
    try {
        const docRef = await addDoc(inventarioCollection, producto);
        console.log("Producto creado con ID: ", docRef.id);
        return docRef.id;
    } catch (e) {
        console.error("Error al crear el producto: ", e);
        throw new Error("No se pudo guardar el producto en la base de datos.");
    }
};

// READ (ALL): Obtiene todos los productos
export const obtenerTodosLosProductos = async () => {
    const productosSnapshot = await getDocs(inventarioCollection);
    const productosList = productosSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
    return productosList;
};

// READ (ONE): Obtiene un producto por su ID
export const obtenerProductoPorId = async (id) => {
    const docRef = doc(db, PRODUCTOS_COLLECTION, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
    } else {
        throw new Error("Producto no encontrado en Firebase.");
    }
};

// UPDATE: Actualiza un producto existente
export const actualizarProducto = async (id, nuevosDatos) => {
    const docRef = doc(db, PRODUCTOS_COLLECTION, id);
    await updateDoc(docRef, nuevosDatos);
};

// DELETE: Elimina un producto
export const eliminarProducto = async (id) => {
    const docRef = doc(db, PRODUCTOS_COLLECTION, id);
    await deleteDoc(docRef);
};