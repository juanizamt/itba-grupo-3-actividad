// frontend/src/NewPostForm.jsx

import React, { useState } from 'react';

function NuevoPost({ onPostSubmit }) {
    // Estado para nuevo post: { title, content, author } [cite: 125]
    const [formData, setFormData] = useState({ title: '', content: '', author: '' });
    const [statusMessage, setStatusMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatusMessage('Publicando...');
        
        if (!formData.title || !formData.content || !formData.author) {
            setStatusMessage('Error: Todos los campos son obligatorios.');
            return;
        }

        const success = await onPostSubmit(formData);

        if (success) {
            setStatusMessage('✅ ¡Post publicado con éxito!');
            setFormData({ title: '', content: '', author: '' }); // Limpia formulario
            setTimeout(() => setStatusMessage(''), 3000);
        } else {
            setStatusMessage('❌ Error al publicar.');
        }
    };

    return (
        <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', maxWidth: '600px', margin: '0 auto 40px auto' }}>
            <h3>Crear Nueva Publicación</h3>
            
            {/* Reutilizamos clases de formulario para el layout [cite: 130] */}
            <form onSubmit={handleSubmit} className="contact-form" style={{ maxWidth: 'unset' }}> 
                <div>
                    <label htmlFor="title">Título:</label>
                    <input
                        type="text" id="title" name="title" value={formData.title} onChange={handleChange}
                        className="form-input-field" required
                    />
                </div>

                <div>
                    <label htmlFor="author">Autor:</label>
                    <input
                        type="text" id="author" name="author" value={formData.author} onChange={handleChange}
                        className="form-input-field" required
                    />
                </div>
                
                <div>
                    <label htmlFor="content">Contenido:</label>
                    <textarea
                        id="content" name="content" rows="5" value={formData.content} onChange={handleChange}
                        className="form-input-field" required
                    ></textarea>
                </div>

                <button type="submit" className="btn btn-submit-margin" disabled={statusMessage === 'Publicando...'}>
                    {statusMessage.includes('...') ? statusMessage : 'Publicar Post'}
                </button>
                
                {statusMessage && !statusMessage.includes('...') && (
                    <p style={{ marginTop: '10px', color: statusMessage.startsWith('✅') ? 'green' : 'red' }}>
                        {statusMessage}
                    </p>
                )}
            </form>
        </div>
    );
}

export default NuevoPost;