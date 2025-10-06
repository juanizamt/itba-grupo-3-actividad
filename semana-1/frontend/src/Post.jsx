// frontend/src/Post.jsx

import React, { useState } from 'react';

// Helper para formatear la fecha [cite: 137]
const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
};

function Post({ post, onCommentSubmit }) {
    return (
        <article className="post-card" style={{ padding: '25px', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.05)', backgroundColor: '#fff' }}>
            {/* Información del Post [cite: 135, 136, 137] */}
            <h2>{post.title}</h2>
            <p style={{ color: '#555', fontSize: '0.9em' }}>
                Publicado por <strong>{post.author}</strong> el {formatDate(post.createdAt)}
            </p>
            <hr />
            <p>{post.content}</p>
            
            {/* Sección de Comentarios [cite: 138] */}
            <div className="comments-section" style={{ marginTop: '30px', paddingLeft: '15px', borderLeft: '3px solid #eee' }}>
                <h4>Comentarios ({post.comments.length})</h4>
                
                {/* Lista de Comentarios */}
                {post.comments.map(comment => (
                    <div key={comment.id} className="comment" style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '5px' }}>
                        <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>{comment.content}</p>
                        <p style={{ margin: 0, fontSize: '0.8em', color: '#888' }}>
                            Por {comment.author} el {formatDate(comment.createdAt)}
                        </p>
                    </div>
                ))}
                
                {/* Formulario para Añadir Comentario [cite: 139] */}
                <CommentForm postId={post.id} onCommentSubmit={onCommentSubmit} />
            </div>
        </article>
    );
}

// Componente separado para el formulario de comentario
function CommentForm({ postId, onCommentSubmit }) {
    // Estado para comentarios: { author, content } [cite: 125]
    const [formData, setFormData] = useState({ author: '', content: '' });
    const [statusMessage, setStatusMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatusMessage('Enviando...');
        
        if (!formData.author || !formData.content) {
            setStatusMessage('Error: Ambos campos son obligatorios.');
            return;
        }

        const success = await onCommentSubmit(postId, formData);

        if (success) {
            setStatusMessage('✅ Comentario publicado.');
            setFormData({ author: '', content: '' }); 
            setTimeout(() => setStatusMessage(''), 3000);
        } else {
            setStatusMessage('❌ Error al publicar.');
        }
    };

    return (
        <div style={{ marginTop: '20px' }}>
            <h5>Deja un comentario:</h5>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input
                    type="text" name="author" placeholder="Tu Nombre" value={formData.author} onChange={handleChange}
                    className="form-input-field" style={{ padding: '8px' }} required
                />
                <textarea
                    name="content" rows="2" placeholder="Tu Comentario" value={formData.content} onChange={handleChange}
                    className="form-input-field" style={{ padding: '8px' }} required
                ></textarea>
                <button type="submit" className="btn" style={{ maxWidth: '150px' }} disabled={statusMessage === 'Enviando...'}>
                    Comentar
                </button>
                {statusMessage && (
                    <p style={{ marginTop: '5px', fontSize: '0.9em', color: statusMessage.startsWith('✅') ? 'green' : 'red' }}>
                        {statusMessage}
                    </p>
                )}
            </form>
        </div>
    );
}

export default Post;