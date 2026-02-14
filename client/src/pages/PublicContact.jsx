import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../api/axios';

const PublicContact = () => {
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
    const [status, setStatus] = useState('idle'); // idle, submitting, success, error

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('submitting');
        try {
            await api.post('/leads', {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                notes: formData.message,
                source: 'Public Contact Form'
            });
            setStatus('success');
            setFormData({ name: '', email: '', phone: '', message: '' });
            setTimeout(() => setStatus('idle'), 3000);
        } catch (err) {
            console.error(err);
            setStatus('error');
            setTimeout(() => setStatus('idle'), 3000);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-slate-900 to-black flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-full max-w-lg bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl relative z-10"
            >
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">Get in Touch</h1>
                    <p className="text-gray-300">We'd love to hear from you. Send us a message!</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 ml-1">Full Name</label>
                        <input
                            required
                            type="text"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none transition-all text-white placeholder-gray-500"
                            placeholder="John Doe"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 ml-1">Email Address</label>
                        <input
                            required
                            type="email"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none transition-all text-white placeholder-gray-500"
                            placeholder="john@example.com"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 ml-1">Phone (Optional)</label>
                        <input
                            type="tel"
                            value={formData.phone}
                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none transition-all text-white placeholder-gray-500"
                            placeholder="+1 (555) 000-0000"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 ml-1">Message</label>
                        <textarea
                            rows="4"
                            value={formData.message}
                            onChange={e => setFormData({ ...formData, message: e.target.value })}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none transition-all text-white placeholder-gray-500 resize-none"
                            placeholder="Tell us about your project..."
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        disabled={status === 'submitting'}
                        className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all transform hover:-translate-y-1 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {status === 'submitting' ? (
                            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : status === 'success' ? (
                            <><CheckCircle className="mr-2" /> Sent Successfully</>
                        ) : status === 'error' ? (
                            <><AlertCircle className="mr-2" /> Failed to Send</>
                        ) : (
                            <><Send className="mr-2" size={20} /> Send Message</>
                        )}
                    </button>

                    <div className="text-center mt-4">
                        <a href="/login" className="text-sm text-gray-500 hover:text-blue-400 transition-colors">Admin Login</a>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default PublicContact;
