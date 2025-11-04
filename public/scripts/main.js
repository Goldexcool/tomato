// Configuration
const API_URL = 'https://tensorflow-model-api.onrender.com/api/analyze';

// Disease information
const DISEASES = {
    'Healthy': { icon: '🍃', name: 'Healthy Leaf', color: '#43A047' },
    'Bacterial_spot': { icon: '🦠', name: 'Bacterial Spot', color: '#E53935' },
    'Early_blight': { icon: '🍂', name: 'Early Blight', color: '#FF6F00' },
    'Late_blight': { icon: '💀', name: 'Late Blight', color: '#B71C1C' },
    'Leaf_Mold': { icon: '🍄', name: 'Leaf Mold', color: '#6A1B9A' },
    'Septoria_leaf_spot': { icon: '⚫', name: 'Septoria Leaf Spot', color: '#4E342E' },
    'Spider_mites': { icon: '🕷️', name: 'Spider Mites', color: '#BF360C' },
    'Target_Spot': { icon: '🎯', name: 'Target Spot', color: '#E65100' },
    'Yellow_Leaf_Curl_Virus': { icon: '🌀', name: 'Yellow Leaf Curl Virus', color: '#F57F17' },
    'Tomato_mosaic_virus': { icon: '�', name: 'Tomato Mosaic Virus', color: '#827717' }
};

// Scroll Functions
function scrollToTest() {
    document.getElementById('test-section').scrollIntoView({ behavior: 'smooth' });
}

// File Upload Handling
document.getElementById('fileInput').addEventListener('change', handleFileSelect);

const dropzone = document.getElementById('dropzone');
dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.style.backgroundColor = '#f0f9f0';
});

dropzone.addEventListener('dragleave', () => {
    dropzone.style.backgroundColor = 'white';
});

dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.style.backgroundColor = 'white';
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFile(files[0]);
    }
});

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        handleFile(file);
    }
}

function handleFile(file) {
    if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
        document.getElementById('previewImage').src = e.target.result;
        document.getElementById('dropzone').style.display = 'none';
        document.getElementById('preview').style.display = 'block';
    };
    reader.readAsDataURL(file);

    // Upload and analyze
    uploadImage(file);
}

function resetUpload() {
    document.getElementById('dropzone').style.display = 'block';
    document.getElementById('preview').style.display = 'none';
    document.getElementById('idle').style.display = 'block';
    document.getElementById('results').style.display = 'none';
    document.getElementById('error').style.display = 'none';
    document.getElementById('loading').style.display = 'none';
    document.getElementById('fileInput').value = '';
}

// Export results as modal with scrollable content
async function exportResults() {
    // Create modal overlay
    const modalOverlay = document.createElement('div');
    modalOverlay.id = 'reportModal';
    modalOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: fadeIn 0.3s ease;
    `;
    
    // Create modal container
    const modalContainer = document.createElement('div');
    modalContainer.style.cssText = `
        background: white;
        width: 90%;
        max-width: 900px;
        height: 85vh;
        border-radius: 16px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        animation: slideUp 0.4s ease;
    `;
    
    // Header
    const modalHeader = document.createElement('div');
    modalHeader.style.cssText = `
        background: linear-gradient(135deg, #E53935 0%, #C62828 100%);
        color: white;
        padding: 30px;
        text-align: center;
        border-bottom: 4px solid #B71C1C;
    `;
    modalHeader.innerHTML = `
        <h1 style="margin: 0 0 10px 0; font-size: 32px; font-weight: 700;">🍅 Complete Project Report</h1>
        <p style="margin: 0; font-size: 16px; opacity: 0.95;">Tomato Leaf Disease Classifier - AI-Powered Diagnosis</p>
        <p style="margin: 10px 0 0 0; font-size: 14px; opacity: 0.85;">Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
    `;
    
    // Scrollable content area
    const modalContent = document.createElement('div');
    modalContent.id = 'modalScrollContent';
    modalContent.style.cssText = `
        flex: 1;
        overflow-y: auto;
        padding: 40px;
        background: #FAFAFA;
    `;
    
    // Results section (if available)
    const resultsElement = document.getElementById('results');
    if (resultsElement && resultsElement.style.display !== 'none') {
        const resultsSection = document.createElement('div');
        resultsSection.style.cssText = `
            background: white;
            padding: 30px;
            border-radius: 12px;
            margin-bottom: 30px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            border-left: 6px solid #43A047;
        `;
        
        const resultsTitle = document.createElement('h2');
        resultsTitle.textContent = '📊 Analysis Results';
        resultsTitle.style.cssText = 'color: #E53935; margin: 0 0 20px 0; font-size: 26px; border-bottom: 2px solid #E0E0E0; padding-bottom: 12px;';
        resultsSection.appendChild(resultsTitle);
        
        const resultsClone = resultsElement.cloneNode(true);
        resultsClone.style.display = 'block';
        resultsSection.appendChild(resultsClone);
        
        modalContent.appendChild(resultsSection);
    }
    
    // All accordion sections
    const sections = [
        { id: 'abstract-content', title: 'Abstract', icon: '📄' },
        { id: 'principle-content', title: 'Principle', icon: '🔬' },
        { id: 'architecture-content', title: 'Theoretical Modelling and Architecture', icon: '🏗️' },
        { id: 'training-content', title: 'Training Parameters', icon: '⚙️' },
        { id: 'classification-content', title: 'Classification Report', icon: '📊' },
        { id: 'deployment-content', title: 'Deployment', icon: '🚀' },
        { id: 'ui-content', title: 'User Interface Demo', icon: '🖥️' },
        { id: 'conclusion-content', title: 'Conclusion', icon: '✅' },
        { id: 'references-content', title: 'References', icon: '📚' },
        { id: 'acknowledgement-content', title: 'Acknowledgement', icon: '🙏' }
    ];
    
    sections.forEach((section, index) => {
        const contentElement = document.getElementById(section.id);
        if (contentElement) {
            const sectionDiv = document.createElement('div');
            sectionDiv.style.cssText = `
                background: white;
                padding: 30px;
                border-radius: 12px;
                margin-bottom: 30px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                border-left: 6px solid ${index % 3 === 0 ? '#E53935' : index % 3 === 1 ? '#FF9800' : '#43A047'};
            `;
            
            const sectionHeader = document.createElement('div');
            sectionHeader.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 2px solid #E0E0E0; padding-bottom: 12px;';
            
            const sectionTitle = document.createElement('h2');
            sectionTitle.textContent = `${section.icon} ${section.title}`;
            sectionTitle.style.cssText = 'color: #E53935; margin: 0; font-size: 24px;';
            
            const exportBtn = document.createElement('button');
            exportBtn.textContent = '📥 Export Postcard';
            exportBtn.style.cssText = `
                background: #E53935;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 600;
                transition: background 0.3s;
            `;
            exportBtn.onmouseover = () => exportBtn.style.background = '#C62828';
            exportBtn.onmouseout = () => exportBtn.style.background = '#E53935';
            exportBtn.onclick = () => exportPostcard(section.id, section.title);
            
            sectionHeader.appendChild(sectionTitle);
            sectionHeader.appendChild(exportBtn);
            sectionDiv.appendChild(sectionHeader);
            
            const contentClone = contentElement.cloneNode(true);
            contentClone.style.cssText = 'font-size: 15px; line-height: 1.8; color: #333;';
            sectionDiv.appendChild(contentClone);
            
            modalContent.appendChild(sectionDiv);
        }
    });
    
    // Footer with buttons
    const modalFooter = document.createElement('div');
    modalFooter.style.cssText = `
        background: #212121;
        color: white;
        padding: 20px 30px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-top: 3px solid #E53935;
    `;
    
    const footerText = document.createElement('p');
    footerText.style.cssText = 'margin: 0; font-size: 14px;';
    footerText.textContent = '© 2025 Tomato Leaf Disease Classifier | AI-Powered Agricultural Diagnostics';
    
    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = 'display: flex; gap: 15px;';
    
    const downloadFullBtn = document.createElement('button');
    downloadFullBtn.textContent = '⬇️ Download Full Report';
    downloadFullBtn.style.cssText = `
        background: #43A047;
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 8px;
        cursor: pointer;
        font-size: 15px;
        font-weight: 600;
        transition: background 0.3s;
    `;
    downloadFullBtn.onmouseover = () => downloadFullBtn.style.background = '#2E7D32';
    downloadFullBtn.onmouseout = () => downloadFullBtn.style.background = '#43A047';
    downloadFullBtn.onclick = async () => {
        try {
            downloadFullBtn.textContent = '⏳ Generating...';
            downloadFullBtn.disabled = true;
            
            const canvas = await html2canvas(modalContent, {
                scale: 2,
                backgroundColor: '#FAFAFA',
                logging: false,
                useCORS: true,
                allowTaint: true,
                windowWidth: 900
            });

            canvas.toBlob((blob) => {
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                const timestamp = new Date().toISOString().slice(0, 10);
                link.download = `tomato-disease-full-report-${timestamp}.png`;
                link.href = url;
                link.click();
                URL.revokeObjectURL(url);
                
                downloadFullBtn.textContent = '✅ Downloaded!';
                setTimeout(() => {
                    downloadFullBtn.textContent = '⬇️ Download Full Report';
                    downloadFullBtn.disabled = false;
                }, 2000);
            });
        } catch (error) {
            console.error('Export error:', error);
            alert('Failed to export full report. Please try again.');
            downloadFullBtn.textContent = '⬇️ Download Full Report';
            downloadFullBtn.disabled = false;
        }
    };
    
    const closeBtn = document.createElement('button');
    closeBtn.textContent = '✖ Close';
    closeBtn.style.cssText = `
        background: #757575;
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 8px;
        cursor: pointer;
        font-size: 15px;
        font-weight: 600;
        transition: background 0.3s;
    `;
    closeBtn.onmouseover = () => closeBtn.style.background = '#616161';
    closeBtn.onmouseout = () => closeBtn.style.background = '#757575';
    closeBtn.onclick = () => document.body.removeChild(modalOverlay);
    
    buttonContainer.appendChild(downloadFullBtn);
    buttonContainer.appendChild(closeBtn);
    
    modalFooter.appendChild(footerText);
    modalFooter.appendChild(buttonContainer);
    
    // Assemble modal
    modalContainer.appendChild(modalHeader);
    modalContainer.appendChild(modalContent);
    modalContainer.appendChild(modalFooter);
    modalOverlay.appendChild(modalContainer);
    
    // Add to body
    document.body.appendChild(modalOverlay);
    
    // Close on overlay click
    modalOverlay.onclick = (e) => {
        if (e.target === modalOverlay) {
            document.body.removeChild(modalOverlay);
        }
    };
    
    // Add CSS animations if not already added
    if (!document.getElementById('modalStyles')) {
        const style = document.createElement('style');
        style.id = 'modalStyles';
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes slideUp {
                from { transform: translateY(50px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            #modalScrollContent::-webkit-scrollbar {
                width: 12px;
            }
            #modalScrollContent::-webkit-scrollbar-track {
                background: #f1f1f1;
                border-radius: 10px;
            }
            #modalScrollContent::-webkit-scrollbar-thumb {
                background: #888;
                border-radius: 10px;
            }
            #modalScrollContent::-webkit-scrollbar-thumb:hover {
                background: #555;
            }
        `;
        document.head.appendChild(style);
    }
}

async function uploadImage(file, retryCount = 0) {
    const MAX_RETRIES = 3;
    const RETRY_DELAY = 3000; // 3 seconds
    
    // Hide idle state
    document.getElementById('idle').style.display = 'none';
    
    // Show loading with retry info
    const loadingElement = document.getElementById('loading');
    loadingElement.style.display = 'block';
    document.getElementById('results').style.display = 'none';
    document.getElementById('error').style.display = 'none';
    
    // Update loading message for retries
    const loadingText = loadingElement.querySelector('p');
    if (retryCount > 0) {
        loadingText.textContent = `🔄 Retry attempt ${retryCount}/${MAX_RETRIES}... The API may be waking up (this can take 1-2 minutes on Render.com)`;
    } else {
        loadingText.textContent = '🔬 Analyzing leaf image with AI model...';
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
        console.log(`[Attempt ${retryCount + 1}] Sending request to: ${API_URL}`);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout

        const response = await fetch(API_URL, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            },
            signal: controller.signal
        });

        clearTimeout(timeoutId);
        
        console.log(`Response status: ${response.status}`);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Server error response:', errorText);
            throw new Error(`Server error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log('Success! Response data:', data);
        displayResults(data);
        
    } catch (error) {
        console.error(`[Attempt ${retryCount + 1}] Error:`, error);
        
        // Retry logic for network errors
        if (retryCount < MAX_RETRIES && 
            (error.name === 'AbortError' || 
             error.message.includes('Failed to fetch') || 
             error.message.includes('NetworkError'))) {
            
            console.log(`Retrying in ${RETRY_DELAY/1000} seconds...`);
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
            return uploadImage(file, retryCount + 1);
        }
        
        // Show error after all retries exhausted
        document.getElementById('loading').style.display = 'none';
        document.getElementById('error').style.display = 'block';
        
        const errorTextEl = document.getElementById('errorText');
        if (error.name === 'AbortError') {
            errorTextEl.innerHTML = `
                <strong>⏱️ Request Timeout</strong><br>
                The API took too long to respond. This usually means:<br>
                • The Render.com server is cold starting (first request after inactivity)<br>
                • Please wait 1-2 minutes and try again<br>
                • Check API status at: <a href="https://tensorflow-model-api.onrender.com" target="_blank" style="color: #43A047;">API Health Check</a>
            `;
        } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            errorTextEl.innerHTML = `
                <strong>⚠️ Connection Failed</strong><br>
                Unable to reach the AI server after ${MAX_RETRIES} attempts.<br>
                • The Render.com API may be starting up (takes 1-2 minutes)<br>
                • Check your internet connection<br>
                • Verify API is online: <a href="https://tensorflow-model-api.onrender.com" target="_blank" style="color: #43A047;">Visit API</a><br>
                • Try again in a moment
            `;
        } else {
            errorTextEl.innerHTML = `<strong>❌ Error:</strong> ${error.message}`;
        }
    }
}

function displayResults(data) {
    try {
        document.getElementById('loading').style.display = 'none';
        document.getElementById('results').style.display = 'block';

        // Parse the API response
        const diseaseKey = data.disease || data.label || 'Unknown';
        const confidence = parseFloat(data.confidence) || 0;
        const isHealthy = data.is_healthy === true || diseaseKey.toLowerCase().includes('healthy');
        const allProbabilities = data.all_probabilities || {};

        // Get disease info
        const diseaseInfo = DISEASES[diseaseKey] || { 
            icon: '🦠', 
            name: diseaseKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), 
            color: '#E53935' 
        };
        
        // Set icon and disease name
        document.getElementById('resultIcon').textContent = diseaseInfo.icon;
        document.getElementById('diseaseName').textContent = diseaseInfo.name;
        
        // Set timestamp
        const now = new Date();
        document.getElementById('timestamp').textContent = `Analyzed on ${now.toLocaleDateString()} at ${now.toLocaleTimeString()}`;

        // Set confidence (cap at 100%)
        const displayConfidence = Math.min(confidence, 100);
        document.getElementById('confidencePercent').textContent = `${displayConfidence.toFixed(1)}%`;
        const progressFill = document.getElementById('progressFill');
        progressFill.style.width = `${displayConfidence}%`;
        
        if (isHealthy) {
            progressFill.classList.remove('diseased');
            progressFill.style.backgroundColor = '#43A047';
        } else {
            progressFill.classList.add('diseased');
            progressFill.style.backgroundColor = '#E53935';
        }

        // Create top 3 predictions from all_probabilities
        let predictions = [];
        if (Object.keys(allProbabilities).length > 0) {
            predictions = Object.entries(allProbabilities)
                .map(([key, value]) => ({
                    label: DISEASES[key] ? DISEASES[key].name : key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                    confidence: parseFloat(value) || 0
                }))
                .sort((a, b) => b.confidence - a.confidence)
                .slice(0, 3);
        } else {
            // Fallback if no probabilities provided
            predictions = [
                { label: diseaseInfo.name, confidence: displayConfidence },
                { label: 'Other Disease 1', confidence: Math.max(0, 100 - displayConfidence - 5) },
                { label: 'Other Disease 2', confidence: Math.max(0, 5) }
            ];
        }

        displayChart(predictions);
    } catch (error) {
        console.error('Display error:', error);
        document.getElementById('loading').style.display = 'none';
        document.getElementById('error').style.display = 'block';
        document.getElementById('errorText').textContent = `Error displaying results: ${error.message}`;
    }
}

function displayChart(predictions) {
    const ctx = document.getElementById('predictionChart');
    
    // Destroy existing chart if it exists
    if (window.predictionChart && typeof window.predictionChart.destroy === 'function') {
        window.predictionChart.destroy();
    }

    try {
        window.predictionChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: predictions.map(p => p.label),
                datasets: [{
                    label: 'Confidence %',
                    data: predictions.map(p => p.confidence),
                    backgroundColor: predictions.map((p, i) => {
                        if (i === 0) {
                            return p.label.toLowerCase().includes('healthy') ? '#43A047' : '#E53935';
                        }
                        return i === 1 ? '#FF9800' : '#BDBDBD';
                    }),
                    borderWidth: 0,
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            },
                            font: {
                                size: 12,
                                family: "'Poppins', sans-serif"
                            }
                        },
                        grid: {
                            color: '#F5F5F5'
                        }
                    },
                    x: {
                        ticks: {
                            font: {
                                size: 12,
                                family: "'Poppins', sans-serif",
                                weight: '500'
                            }
                        },
                        grid: {
                            display: false
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(33, 33, 33, 0.9)',
                        titleFont: {
                            size: 14,
                            family: "'Poppins', sans-serif"
                        },
                        bodyFont: {
                            size: 13,
                            family: "'Poppins', sans-serif"
                        },
                        padding: 12,
                        borderRadius: 8,
                        callbacks: {
                            label: function(context) {
                                return 'Confidence: ' + context.parsed.y.toFixed(2) + '%';
                            }
                        }
                    }
                }
            }
        });
    } catch (error) {
        console.error('Chart error:', error);
    }
}

// Accordion Functionality
function toggleAccordion(button) {
    const item = button.parentElement;
    const isActive = item.classList.contains('active');

    // Close all accordions
    document.querySelectorAll('.accordion-item').forEach(acc => {
        acc.classList.remove('active');
    });

    // Open clicked accordion if it wasn't active
    if (!isActive) {
        item.classList.add('active');
        
        // Initialize charts for classification section
        if (button.textContent.includes('Classification Report')) {
            setTimeout(initializeAccuracyChart, 100);
        }
    }
}

// Initialize Accuracy Chart
function initializeAccuracyChart() {
    const ctx = document.getElementById('accuracyChart');
    if (!ctx || window.accuracyChart) return;

    const epochs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const trainingAcc = [45, 52, 58, 62, 65, 67, 68.5, 69, 69.2, 69.6];
    const validationAcc = [42, 50, 56, 60, 63, 65, 66, 67.5, 68, 69.6];

    window.accuracyChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: epochs,
            datasets: [{
                label: 'Training Accuracy',
                data: trainingAcc,
                borderColor: '#E53935',
                backgroundColor: 'transparent',
                tension: 0.3
            }, {
                label: 'Validation Accuracy',
                data: validationAcc,
                borderColor: '#43A047',
                backgroundColor: 'transparent',
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Training Progress'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Epoch'
                    }
                }
            }
        }
    });
}

// Export Postcard Functionality
async function exportPostcard(contentId, sectionName) {
    const content = document.getElementById(contentId);
    if (!content) return;

    try {
        // Create a temporary container with fixed dimensions
        const tempContainer = document.createElement('div');
        tempContainer.style.width = '800px';
        tempContainer.style.padding = '40px';
        tempContainer.style.backgroundColor = 'white';
        tempContainer.style.position = 'absolute';
        tempContainer.style.left = '-9999px';
        
        // Add branding header
        tempContainer.innerHTML = `
            <div style="text-align: center; margin-bottom: 30px; border-bottom: 3px solid #E53935; padding-bottom: 20px;">
                <h1 style="color: #E53935; font-size: 32px; margin: 0;">🍅 Tomato Disease Classifier</h1>
                <h2 style="color: #43A047; font-size: 24px; margin: 10px 0 0 0;">${sectionName}</h2>
            </div>
            ${content.innerHTML}
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #E0E0E0; color: #666; font-size: 14px;">
                © 2025 Tomato Leaf Disease Classifier | AI-Powered Agriculture
            </div>
        `;
        
        document.body.appendChild(tempContainer);

        // Generate image using html2canvas
        const canvas = await html2canvas(tempContainer, {
            scale: 2,
            backgroundColor: '#ffffff',
            logging: false
        });

        // Remove temporary container
        document.body.removeChild(tempContainer);

        // Convert to blob and download
        canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.download = `tomato-classifier-${sectionName.toLowerCase().replace(/ /g, '-')}.png`;
            link.href = url;
            link.click();
            URL.revokeObjectURL(url);
        });

    } catch (error) {
        console.error('Export error:', error);
        alert('Error exporting postcard. Please try again.');
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    console.log('Tomato Disease Classifier loaded');
});
