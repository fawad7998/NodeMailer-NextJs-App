'use client';
import { useState } from 'react';

export default function ContactForm() {
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('');
    const [emailDetails, setEmailDetails] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setEmailDetails(null);
        try {
            const res = await fetch('/api/sendmail', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, subject, message }),
            });

            const data = await res.json();
            if (data.success) {
                setStatus('Email sent successfully!');
                setEmailDetails({ email, subject, message });
                setEmail('');
                setSubject('');
                setMessage('');
            } else {
                setStatus(data.message || 'Failed to send email.');
                setEmailDetails(null);
            }
        } catch (err) {
            console.error('Error sending email:', err);
            setStatus('An error occurred. Please try again.');
            setEmailDetails(null);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">Contact Us</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="email"
                        placeholder="Your Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <textarea
                        placeholder="Your Message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    ></textarea>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition duration-300"
                    >
                        Send Email
                    </button>
                </form>

                {status && <p className="mt-4 text-center text-gray-600">{status}</p>}

                {emailDetails && (
                    <div className="mt-4 bg-green-100 p-4 rounded-lg overflow-hidden text-wrap shadow-lg text-gray-800">
                        <h3 className="text-lg font-semibold">Email Sent Details:</h3>
                        <p><strong>Email:</strong> {emailDetails.email}</p>
                        <p><strong>Subject:</strong> {emailDetails.subject}</p>
                        <p><strong>Message:</strong> {emailDetails.message}</p>
                    </div>
                )}

                {!emailDetails && status === 'Failed to send email.' && (
                    <div className="mt-4 bg-red-100 p-4 rounded-lg shadow-lg text-gray-800">
                        <p>An error occurred. Please check your email details and try again.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
