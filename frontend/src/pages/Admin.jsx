import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { getAllAlgorithms, updateAlgorithm, upsertAlgorithmCode } from '../api/index';

function Admin() {
    const [algorithms, setAlgorithms] = useState([]);
    const [selectedAlgo, setSelectedAlgo] = useState(null);
    const [formData, setFormData] = useState({});
    const [codeData, setCodeData] = useState({ lang: 'java', code: '', highlight_map: '' });
    const [message, setMessage] = useState('');

    useEffect(() => {
        getAllAlgorithms().then((res) => setAlgorithms(res.data.data)).catch(console.error);
    }, []);

    const handleSelect = (algo) => {
        setSelectedAlgo(algo);
        setFormData({
            name: algo.name,
            category: algo.category,
            subcategory: algo.subcategory,
            description: algo.description,
            time_best: algo.time_best,
            time_avg: algo.time_avg,
            time_worst: algo.time_worst,
            space_complexity: algo.space_complexity,
            is_stable: algo.is_stable,
            order_index: algo.order_index
        });
        setMessage('');
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            await updateAlgorithm(selectedAlgo.slug, formData);
            setMessage('Algorithm metadata updated successfully');
        } catch (err) {
            setMessage('Error: ' + err.message);
        }
    };

    const handleSaveCode = async (e) => {
        e.preventDefault();
        try {
            let parsedMap = {};
            try {
                if (codeData.highlight_map.trim()) {
                    parsedMap = JSON.parse(codeData.highlight_map);
                }
            } catch (err) {
                return setMessage('Error: Invalid JSON in highlight map');
            }

            await upsertAlgorithmCode(selectedAlgo.slug, {
                lang: codeData.lang,
                code: codeData.code,
                highlight_map: parsedMap
            });
            setMessage(`Code for ${codeData.lang} updated successfully`);
        } catch (err) {
            setMessage('Error: ' + err.message);
        }
    };

    return (
        <div className="min-h-screen" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-12 flex gap-8">
                {/* Sidebar */}
                <div className="w-1/4 border-r pr-4" style={{ borderColor: 'var(--border)' }}>
                    <h2 className="text-xl font-bold mb-4">Algorithms</h2>
                    <ul className="space-y-2">
                        {algorithms.map((a) => (
                            <li key={a.slug}>
                                <button 
                                    className={`w-full text-left p-2 rounded ${selectedAlgo?.slug === a.slug ? 'bg-violet-600' : 'hover:bg-zinc-800'}`}
                                    onClick={() => handleSelect(a)}
                                >
                                    {a.name}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Editor */}
                <div className="flex-1">
                    {message && <div className="p-3 mb-4 rounded bg-zinc-800 text-green-400 border border-green-500/30">{message}</div>}
                    
                    {!selectedAlgo ? (
                        <p className="text-zinc-400">Select an algorithm to manage</p>
                    ) : (
                        <div>
                            <h2 className="text-2xl font-bold mb-6">Edit: {selectedAlgo.name}</h2>
                            
                            {/* Metadata form */}
                            <form onSubmit={handleSave} className="grid grid-cols-2 gap-4 mb-8">
                                {Object.keys(formData).map((key) => (
                                    <div key={key} className={key === 'description' ? 'col-span-2' : ''}>
                                        <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wide mb-1">{key}</label>
                                        {key === 'description' ? (
                                            <textarea 
                                                value={formData[key] || ''} 
                                                onChange={e => setFormData({ ...formData, [key]: e.target.value })}
                                                className="w-full p-2 bg-zinc-900 border border-zinc-700 rounded h-24"
                                            />
                                        ) : (
                                            <input 
                                                type={key === 'is_stable' ? 'checkbox' : 'text'}
                                                checked={key === 'is_stable' ? formData[key] : undefined}
                                                value={key !== 'is_stable' ? formData[key] || '' : undefined}
                                                onChange={e => setFormData({ ...formData, [key]: key === 'is_stable' ? e.target.checked : e.target.value })}
                                                className="w-full p-2 bg-zinc-900 border border-zinc-700 rounded"
                                            />
                                        )}
                                    </div>
                                ))}
                                <button type="submit" className="col-span-2 bg-violet-600 py-2 rounded font-bold mt-2">Save Metadata</button>
                            </form>

                            <hr className="border-zinc-700 mb-8" />

                            {/* Code snippet form */}
                            <h3 className="text-xl font-bold mb-4">Manage Code Snippets</h3>
                            <form onSubmit={handleSaveCode} className="flex flex-col gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wide mb-1">Language</label>
                                    <select 
                                        className="p-2 bg-zinc-900 border border-zinc-700 rounded"
                                        value={codeData.lang}
                                        onChange={e => setCodeData({ ...codeData, lang: e.target.value })}
                                    >
                                        <option value="java">Java</option>
                                        <option value="cpp">C++</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wide mb-1">Code</label>
                                    <textarea 
                                        value={codeData.code} 
                                        onChange={e => setCodeData({ ...codeData, code: e.target.value })}
                                        className="w-full p-2 bg-zinc-900 border border-zinc-700 rounded h-48 font-mono text-sm"
                                        placeholder="class Main { ... }"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wide mb-1">Highlight Map (JSON)</label>
                                    <textarea 
                                        value={codeData.highlight_map} 
                                        onChange={e => setCodeData({ ...codeData, highlight_map: e.target.value })}
                                        className="w-full p-2 bg-zinc-900 border border-zinc-700 rounded h-24 font-mono text-sm"
                                        placeholder='{"compare": [3, 4], "swap": [5]}'
                                    />
                                </div>
                                <button type="submit" className="bg-violet-600 py-2 rounded font-bold">Save Code Snippet</button>
                            </form>

                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default Admin;
