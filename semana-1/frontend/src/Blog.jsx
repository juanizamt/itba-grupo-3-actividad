// frontend/src/Blog.jsx

import React, { useState, useEffect } from 'react';
import Post from './Post';
import NewPostForm from './NewPostForm'; // Importa el componente del formulario

const API_URL = 'http://localhost:3001/api/posts';

function Blog() {
    // Estado principal para guardar el array de posts 
    const [posts, setPosts] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    // Carga los posts al montar el componente [cite: 125]
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch(API_URL);
                if (!response.ok) {
                    throw new Error('Error al cargar posts');
                }
                const data = await response.json();
                setPosts(data);
                setCargando(false);
            } catch (err) {
                console.error("Error al obtener posts:", err);
                setError("Error: No se pudo conectar al servidor. Asegúrate de que el backend esté corriendo.");
                setCargando(false);
            }
        };
        fetchPosts();
    }, []);

    // Función para crear un nuevo post
    const handleNewPost = async (newPostData) => {
        // ... (Lógica de fetch para POST /api/posts, igual que en el backend) ...
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newPostData)
            });

            if (!response.ok) throw new Error('Error al crear el post');
            const createdPost = await response.json();
            
            // Actualiza el estado con el nuevo post
            setPosts(prevPosts => [createdPost, ...prevPosts]); 
            return true;
        } catch (error) {
            console.error('Error al enviar el nuevo post:', error);
            return false;
        }
    };

    // Función para añadir un comentario a un post específico
    const handleAddComment = async (postId, commentData) => {
        // ... (Lógica de fetch para POST /api/posts/:id/comments) ...
        try {
            const response = await fetch(`${API_URL}/${postId}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(commentData)
            });

            if (!response.ok) throw new Error('Error al añadir el comentario');
            const newComment = await response.json();

            // Actualiza el estado del post específico
            setPosts(prevPosts => prevPosts.map(post => 
                post.id === postId 
                    ? { ...post, comments: [...post.comments, newComment] } // Añade el nuevo comentario
                    : post
            ));
            return true;
        } catch (error) {
            console.error('Error al enviar el comentario:', error);
            return false;
        }
    };


    if (cargando) {
        return <div className="featured-products">Cargando Blog...</div>;
    }

    if (error) {
        return <div className="featured-products" style={{ color: 'red' }}>{error}</div>;
    }
    
    return (
        <main className="featured-products contact-main-padded">
            <h1 className="featured-title">Blog de Hermanos Jota</h1>
            
            <NewPostForm onPostSubmit={handleNewPost} /> {/* Formulario de Creación */}

            <h2 style={{ marginTop: '40px' }}>Últimas Publicaciones</h2>
            <hr />

            {/* Contenedor de posts. Añade estilos simples para el layout. */}
            <div className="posts-container" style={{ display: 'flex', flexDirection: 'column', gap: '30px', maxWidth: '800px', margin: '20px auto' }}>
                {posts.map(post => (
                    <Post 
                        key={post.id} 
                        post={post} 
                        onCommentSubmit={handleAddComment} 
                    />
                ))}
            </div>
        </main>
    );
}

export default Blog;