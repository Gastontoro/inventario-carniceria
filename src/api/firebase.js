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
// 1. CONFIGURACIÓN DE FIREBASE (Usa Variables de Entorno VITE_)
// -----------------------------------------------------
const firebaseConfig = {
  // CRÍTICO: Asegúrate de que tus variables en Vercel tienen el prefijo VITE_
  apiKey: import.meta.env.VITE_API_KEY, 
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const PRODUCTOS_COLLECTION = 'inventario_carniceria';
const inventarioCollection = collection(db, PRODUCTOS_COLLECTION);

// -----------------------------------------------------
// 2. FUNCIONES CRUD (Sintaxis de Cierre FINALMENTE Verificada)
// -----------------------------------------------------

/** CREATE: Guarda un nuevo producto */
export const crearProducto = async (producto) => {
    try {
        const docRef = await addDoc(inventarioCollection, producto);
        return docRef.id;
    } catch (e) {
        console.error("Error al crear el producto: ", e);
        throw new Error("No se pudo guardar el producto en la base de datos.");
    }
}; // <-- Cierre de crearProducto

/** READ (Todos): Obtiene todos los productos */
export const obtenerTodosLosProductos = async () => {
    try {
        const productosSnapshot = await getDocs(inventarioCollection);
        const productosList = productosSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        return productosList;
    } catch (e) {
        console.error("Error al obtener todos los productos: ", e);
        throw new Error("No se pudo cargar el inventario.");
    }
}; // <-- Cierre de obtenerTodosLosProductos

/** READ (Uno): Obtiene un producto por su ID */
export const obtenerProductoPorId = async (id) => {
    // eslint-disable-next-line no-useless-catch
    try {
        const docRef = doc(db, PRODUCTOS_COLLECTION, id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        } else {
            throw new Error(`El producto con ID ${id} no fue encontrado.`);
        }
    } catch (e) {
        throw e;
    }
}; // <-- Cierre de obtenerProductoPorId

/** UPDATE: Actualiza un producto existente */
export const actualizarProducto = async (id, nuevosDatos) => {
    try {
        const docRef = doc(db, PRODUCTOS_COLLECTION, id);
        await updateDoc(docRef, nuevosDatos);
    } catch (e) {
        console.error(`Error al actualizar el producto ${id}: `, e);
        throw new Error("No se pudieron guardar los cambios en la base de datos.");
    }
}; // <-- Cierre de actualizarProducto

/** DELETE: Elimina un producto */
export const eliminarProducto = async (id) => {
    try {
        const docRef = doc(db, PRODUCTOS_COLLECTION, id);
        await deleteDoc(docRef);
    } catch (e) {
        console.error(`Error al eliminar el producto ${id}: `, e);
        throw new Error("No se pudo eliminar el producto de la base de datos.");
    }
}; // <-- Cierre de eliminarProducto