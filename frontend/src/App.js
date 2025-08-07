import React, { useState } from 'react';
import axios from 'axios';
import { Send, Sparkles, Loader2, CheckCircle, AlertCircle, Paperclip, X } from 'lucide-react';

function App() {
  const [recipients, setRecipients] = useState('');
  const [prompt, setPrompt] = useState('');
  const [generatedEmail, setGeneratedEmail] = useState({ subject: '', body: '' });
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [attachments, setAttachments] = useState([]);

  const generateEmail = async () => {
    if (!prompt.trim()) {
      setMessage({ type: 'error', text: 'Please enter a prompt for the email' });
      return;
    }

    setIsGenerating(true);
    setMessage({ type: '', text: '' });

    try {
      const baseURL = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000';
      const response = await axios.post(`${baseURL}/api/generate-email`, { prompt });
      setGeneratedEmail(response.data.email);
      setMessage({ type: 'success', text: 'Email generated successfully!' });
    } catch (error) {
      console.error('Error generating email:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.error || 'Failed to generate email' 
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const sendEmail = async () => {
    if (!recipients.trim() || !generatedEmail.subject || !generatedEmail.body) {
      setMessage({ type: 'error', text: 'Please fill in all required fields' });
      return;
    }

    setIsSending(true);
    setMessage({ type: '', text: '' });

    try {
      const formData = new FormData();
      formData.append('recipients', recipients);
      formData.append('subject', generatedEmail.subject);
      formData.append('body', generatedEmail.body);
      
      // Add attachments
      attachments.forEach(file => {
        formData.append('attachments', file);
      });

      const baseURL = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000';
      const response = await axios.post(`${baseURL}/api/send-email`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setMessage({ type: 'success', text: response.data.message });
      
      // Reset form after successful send
      setRecipients('');
      setPrompt('');
      setGeneratedEmail({ subject: '', body: '' });
      setAttachments([]);
    } catch (error) {
      console.error('Error sending email:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.error || 'Failed to send email' 
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    setAttachments(prev => [...prev, ...files]);
  };

  const removeAttachment = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            AI Email Sender
          </h1>
          <p className="text-white/80 text-lg">
            Generate and send professional emails with AI
          </p>
        </div>

        {/* Main Form */}
        <div className="glass-effect rounded-2xl p-8 mb-6">
          {/* Recipients Input */}
          <div className="mb-6">
            <label className="block text-white font-semibold mb-2">
              Recipients (comma-separated emails)
            </label>
            <input
              type="text"
              value={recipients}
              onChange={(e) => setRecipients(e.target.value)}
              placeholder="example@email.com, another@email.com"
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Prompt Input */}
          <div className="mb-6">
            <label className="block text-white font-semibold mb-2">
              Email Prompt
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the email you want to generate (e.g., 'Write a professional follow-up email after a job interview')"
              rows="4"
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Generate Button */}
          <button
            onClick={generateEmail}
            disabled={isGenerating}
            className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating Email...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate Email
              </>
            )}
          </button>
        </div>

        {/* Generated Email Section */}
        {generatedEmail.subject && (
          <div className="glass-effect rounded-2xl p-8 mb-6">
            <h2 className="text-2xl font-bold text-white mb-6">Generated Email</h2>
            
            {/* Subject */}
            <div className="mb-6">
              <label className="block text-white font-semibold mb-2">
                Subject
              </label>
              <input
                type="text"
                value={generatedEmail.subject}
                onChange={(e) => setGeneratedEmail({ ...generatedEmail, subject: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Body */}
            <div className="mb-6">
              <label className="block text-white font-semibold mb-2">
                Email Body
              </label>
              <textarea
                value={generatedEmail.body}
                onChange={(e) => setGeneratedEmail({ ...generatedEmail, body: e.target.value })}
                rows="8"
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Attachments Section */}
            <div className="mb-6">
              <label className="block text-white font-semibold mb-2">
                Attachments
              </label>
              <div className="space-y-3">
                {/* File Upload */}
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg border border-white/20 transition-colors duration-200 flex items-center gap-2">
                    <Paperclip className="w-4 h-4" />
                    Add Files
                    <input
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                      accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
                    />
                  </label>
                  <span className="text-white/60 text-sm">
                    Max 5 files, 10MB each
                  </span>
                </div>

                {/* Attachments List */}
                {attachments.length > 0 && (
                  <div className="space-y-2">
                    {attachments.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-white/10 rounded-lg px-3 py-2">
                        <div className="flex items-center gap-2">
                          <Paperclip className="w-4 h-4 text-white/60" />
                          <span className="text-white text-sm truncate">
                            {file.name}
                          </span>
                          <span className="text-white/60 text-xs">
                            ({(file.size / 1024 / 1024).toFixed(2)} MB)
                          </span>
                        </div>
                        <button
                          onClick={() => removeAttachment(index)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Send Button */}
            <button
              onClick={sendEmail}
              disabled={isSending}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
            >
              {isSending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Sending Email...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Send Email {attachments.length > 0 && `(${attachments.length} attachment${attachments.length > 1 ? 's' : ''})`}
                </>
              )}
            </button>
          </div>
        )}

        {/* Message Display */}
        {message.text && (
          <div className={`glass-effect rounded-lg p-4 flex items-center gap-3 ${
            message.type === 'success' ? 'border-green-500' : 'border-red-500'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-400" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-400" />
            )}
            <span className="text-white">{message.text}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default App; 