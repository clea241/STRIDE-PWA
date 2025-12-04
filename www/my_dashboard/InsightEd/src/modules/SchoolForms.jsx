import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SchoolForms = () => {
    const navigate = useNavigate();

    // State to manage which form is currently open in the popup
    const [activeForm, setActiveForm] = useState(null);

    // Placeholder data for the list of forms
    const formsList = [
        { 
            id: 1, 
            name: "Facility Maintenance Request (FMR)", 
            description: "Submit requests for facility and equipment repair.",
            status: "Pending",
            emoji: "🛠️"
        },
        { 
            id: 2, 
            name: "Personnel Evaluation Form (PEF)", 
            description: "Annual evaluation and assessment of teaching staff.",
            status: "Complete",
            emoji: "🧑‍🏫"
        },
        { 
            id: 3, 
            name: "Quarterly Budget Report (QBR)", 
            description: "Report on expenditures and budget utilization for the quarter.",
            status: "Draft",
            emoji: "💰"
        },
        { 
            id: 4, 
            name: "Learning Resource Inventory (LRI)", 
            description: "Update and manage school textbooks and material inventory.",
            status: "Not Started",
            emoji: "📖"
        },
    ];

    // Handler to open the modal
    const handleFormClick = (form) => {
        setActiveForm(form);
    };

    // Handler to close the modal
    const closeModal = () => {
        setActiveForm(null);
    };

    // Handler for form submission (Placeholder logic)
    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`Successfully submitted data for: ${activeForm.name}`);
        closeModal();
    };

    const goBack = () => {
        navigate(-1); 
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans p-4 md:p-8 pb-24 relative"> 
            <div className="max-w-4xl mx-auto">
                
                {/* --- Header Section --- */}
                <header className="flex items-center justify-between mb-6">
                    <button 
                        onClick={goBack} 
                        className="text-[#004A99] hover:text-[#003B7A] transition duration-150 text-2xl"
                        aria-label="Go Back"
                    >
                        &larr;
                    </button>
                    <h1 className="text-3xl font-bold text-[#CC0000]">
                        School Forms
                    </h1>
                    <div className="w-6"></div> 
                </header>

                <p className="text-gray-600 mb-6 text-center md:text-left">
                    Click on a card below to fill out the specific form details.
                </p>

                {/* --- Forms List Grid --- */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {formsList.map((form) => (
                        <div 
                            key={form.id}
                            onClick={() => handleFormClick(form)}
                            className="bg-white p-5 rounded-xl shadow-lg border-l-4 border-[#004A99] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                        >
                            <div className="flex items-center mb-2">
                                <span className="text-2xl mr-2">{form.emoji}</span>
                                <h2 className="text-lg font-semibold text-gray-800 leading-tight">{form.name}</h2>
                            </div>
                            <p className="text-sm text-gray-500 mb-3">{form.description}</p>
                            
                            <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                                form.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                form.status === 'Complete' ? 'bg-green-100 text-green-800' :
                                form.status === 'Draft' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-200 text-gray-700'
                            }`}>
                                Status: {form.status}
                            </span>
                        </div>
                    ))}
                </div>

                {/* --- Empty State / Note --- */}
                <div className="mt-8 p-6 bg-white border-t-2 border-[#CC0000] rounded-xl shadow-md text-center">
                    <p className="text-sm text-[#CC0000] font-medium">
                        Need to start a new form? Click on any card to begin the process.
                    </p>
                </div>

            </div>

            {/* --- POP-OUT MODAL (The Form) --- */}
            {activeForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity">
                    
                    {/* Modal Content */}
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all scale-100">
                        
                        {/* Modal Header */}
                        <div className="bg-[#004A99] p-4 flex justify-between items-center text-white">
                            <h2 className="text-lg font-bold flex items-center">
                                <span className="mr-2 text-2xl">{activeForm.emoji}</span> 
                                {activeForm.name}
                            </h2>
                            <button 
                                onClick={closeModal}
                                className="text-white hover:text-gray-300 text-3xl leading-none focus:outline-none"
                            >
                                &times;
                            </button>
                        </div>

                        {/* Modal Body (The Input Fields) */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            
                            {/* Field: Date */}
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Date of Submission
                                </label>
                                <input 
                                    type="date" 
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004A99] focus:border-transparent transition"
                                />
                            </div>

                            {/* Field: Subject/Title */}
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Subject / Title
                                </label>
                                <input 
                                    type="text" 
                                    placeholder="e.g., Repair for Room 101 AC"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004A99] focus:border-transparent transition"
                                />
                            </div>

                            {/* Field: Priority Select */}
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Priority Level
                                </label>
                                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004A99] bg-white">
                                    <option>Low</option>
                                    <option>Normal</option>
                                    <option>High</option>
                                    <option>Urgent / Critical</option>
                                </select>
                            </div>

                            {/* Field: Description Textarea */}
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Details & Description
                                </label>
                                <textarea 
                                    rows="4" 
                                    placeholder="Enter the specific details required for this form..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004A99] focus:border-transparent transition resize-none"
                                ></textarea>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100 mt-4">
                                <button 
                                    type="button" 
                                    onClick={closeModal}
                                    className="px-5 py-2 rounded-lg text-gray-600 font-medium hover:bg-gray-100 transition"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="px-5 py-2 rounded-lg bg-[#CC0000] text-white font-bold hover:bg-[#A30000] shadow-md transition transform active:scale-95"
                                >
                                    Submit Form
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
};

export default SchoolForms;