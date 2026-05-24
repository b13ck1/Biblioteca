import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const GestionUsuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cargarUsuarios = async () => {
            try {
                // 1. Recuperamos el token que guardamos en el Login
                const token = localStorage.getItem('token');

                // 2. Hacemos la petición enviando el token en los headers
                const res = await axios.get('${import.meta.env.VITE_API_URL}/api/admin/usuarios', {
                    headers: {
                        'Authorization': `Bearer ${token}` // Formato estándar Bearer
                    }
                });

                setUsuarios(res.data);
            } catch (error) {
                console.error("Error al cargar usuarios:", error.response?.data?.message);
                // Si el token expiró o es inválido, podrías redirigir al login
            } finally {
                setLoading(false);
            }
        };

        cargarUsuarios();
    }, []);

    return (
        <div className="p-8 mt-20 max-w-6xl mx-auto">
            <h1 className="text-3xl font-black uppercase italic mb-8">
                Gestión de <span className="text-indigo-600">Usuarios</span>
            </h1>
            
            <DataTable value={usuarios} loading={loading} paginator rows={10} className="shadow-lg rounded-2xl overflow-hidden">
                <Column field="idUsuario" header="ID" sortable />
                <Column field="nombre" header="Nombre" sortable />
                <Column field="correo" header="Correo" />
                <Column field="idRol" header="Rol" body={(rowData) => (
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${rowData.idRol === 1 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                        {rowData.idRol === 1 ? 'ADMIN' : 'USUARIO'}
                    </span>
                )} />
            </DataTable>
        </div>
    );
};

export default GestionUsuarios;