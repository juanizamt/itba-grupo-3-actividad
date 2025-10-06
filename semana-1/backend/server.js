const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

// Base de datos simulada (Posts en memoria)
let posts = [
    {
        id: 1,
        title: "Introducción a React Hooks",
        content: "Los Hooks nos permiten usar estado y otras funcionalidades de React sin escribir una clase. useEffect y useState son los más importantes.",
        author: "Juan Pérez",
        createdAt: new Date().toISOString(),
        comments: [
            { id: 101, author: "Maria G.", content: "Bastante útil! ¿Cómo se gestionan los formularios con Hooks?", createdAt: new Date().toISOString() }
        ]
    },
    {
        id: 2,
        title: "Consejos para el Backend con Express",
        content: "Mantener una estructura modular y usar middlewares para la validación de datos hace que tu API sea más robusta y fácil de mantener.",
        author: "Admin Jota",
        createdAt: new Date(Date.now() - 86400000).toISOString(), 
        comments: []
    }
];


app.use(cors());
app.use(express.json()); // Necesario para parsear el body de las peticiones POST


const generateId = () => Date.now();



app.get('/api/posts', (req, res) => {
    
    res.json(posts);
});



app.post('/api/posts', (req, res) => {
    const { title, content, author } = req.body; // Campos requeridos [cite: 131, 132, 133]

    if (!title || !content || !author) {
        return res.status(400).json({ error: "Faltan campos requeridos: título, contenido o autor." });
    }

    const newPost = {
        id: generateId(), // Genera ID
        title,
        content,
        author,
        createdAt: new Date().toISOString(),
        comments: [] // Inicializa la lista de comentarios vacía [cite: 113]
    };

    posts.unshift(newPost); // Agrega el post al inicio del array
    res.status(201).json(newPost);
});



app.post('/api/posts/:id/comments', (req, res) => {
    const postId = parseInt(req.params.id);
    const { author, content } = req.body; // Campos requeridos para el comentario [cite: 140, 141]

    if (!author || !content) {
        return res.status(400).json({ error: "Faltan campos requeridos: autor o contenido del comentario." });
    }

    const post = posts.find(p => p.id === postId);

    if (!post) {
        return res.status(404).json({ error: "Post no encontrado." });
    }

    const newComment = {
        id: generateId(),
        author,
        content,
        createdAt: new Date().toISOString()
    };

    post.comments.push(newComment);
    res.status(201).json(newComment);
});


// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor de Blog corriendo en http://localhost:${PORT}`);
});