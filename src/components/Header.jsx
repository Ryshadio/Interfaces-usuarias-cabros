import { useState } from 'react';

const Header = ({ loggedIn, onLogin, onLogout, onOpenCreate }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const success = onLogin({ username, password });
    if (success) {
      setPassword('');
    }
  };

  return (
    <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Tracker de Eventos</h1>
        <p className="text-sm text-gray-500">
          Administra, filtra y revisa eventos universitarios sin backend.
        </p>
      </div>
      <div>
        {!loggedIn ? (
          <form onSubmit={handleSubmit} className="flex flex-wrap gap-2 items-center">
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Usuario"
              className="border rounded px-3 py-1.5 text-sm w-32"
            />
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Contrasena"
              className="border rounded px-3 py-1.5 text-sm w-32"
            />
            <button
              type="submit"
              className="px-4 py-1.5 bg-blue-600 text-white rounded text-sm font-semibold"
            >
              Entrar
            </button>
          </form>
        ) : (
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenCreate}
              className="px-4 py-2 bg-yellow-400 text-blue-900 rounded-lg shadow-sm hover:bg-yellow-500 font-semibold"
            >
              + Crear evento
            </button>
            <button
              onClick={onLogout}
              className="px-3 py-2 border rounded-lg text-sm"
            >
              Cerrar sesion
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
