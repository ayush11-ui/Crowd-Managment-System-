// Form switching functionality
function switchToSignup() {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    loginForm.classList.add('hidden');
    signupForm.classList.remove('hidden');
    
    // Add animation effect
    signupForm.style.animation = 'slideIn 0.5s ease-out';
}

function switchToLogin() {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    signupForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
    
    // Add animation effect
    loginForm.style.animation = 'slideIn 0.5s ease-out';
}

// Button ripple effect
function createRipple(event) {
    const button = event.currentTarget;
    const ripple = button.querySelector('.btn-ripple');
    
    if (!ripple) return;
    
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    
    ripple.style.animation = 'ripple 0.6s linear';
    
    setTimeout(() => {
        ripple.style.animation = '';
    }, 600);
}

// Form validation
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    return password.length >= 6;
}

function validateForm(formType) {
    let isValid = true;
    const errors = [];
    
    if (formType === 'login') {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        if (!validateEmail(email)) {
            errors.push('Please enter a valid email address');
            isValid = false;
        }
        
        if (!validatePassword(password)) {
            errors.push('Password must be at least 6 characters long');
            isValid = false;
        }
    } else if (formType === 'signup') {
        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const organization = document.getElementById('signupOrganization').value;
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const agreeTerms = document.getElementById('agreeTerms').checked;
        
        if (name.trim().length < 2) {
            errors.push('Full name must be at least 2 characters long');
            isValid = false;
        }
        
        if (!validateEmail(email)) {
            errors.push('Please enter a valid email address');
            isValid = false;
        }
        
        if (organization.trim().length < 2) {
            errors.push('Organization name must be at least 2 characters long');
            isValid = false;
        }
        
        if (!validatePassword(password)) {
            errors.push('Password must be at least 6 characters long');
            isValid = false;
        }
        
        if (password !== confirmPassword) {
            errors.push('Passwords do not match');
            isValid = false;
        }
        
        if (!agreeTerms) {
            errors.push('You must agree to the Terms & Conditions');
            isValid = false;
        }
    }
    
    if (!isValid) {
        showError(errors);
    }
    
    return isValid;
}

// Show error messages
function showError(errors) {
    // Remove existing error messages
    const existingErrors = document.querySelectorAll('.error-message');
    existingErrors.forEach(error => error.remove());
    
    // Create error container
    const errorContainer = document.createElement('div');
    errorContainer.className = 'error-message';
    errorContainer.style.cssText = `
        background: rgba(255, 107, 107, 0.2);
        border: 1px solid rgba(255, 107, 107, 0.3);
        border-radius: 8px;
        padding: 15px;
        margin-bottom: 20px;
        font-family: 'Peace Sans', sans-serif;
        color: #ff6b6b;
        font-size: 0.9rem;
        animation: slideIn 0.3s ease-out;
    `;
    
    const errorList = document.createElement('ul');
    errorList.style.cssText = 'margin: 0; padding-left: 20px;';
    
    errors.forEach(error => {
        const errorItem = document.createElement('li');
        errorItem.textContent = error;
        errorList.appendChild(errorItem);
    });
    
    errorContainer.appendChild(errorList);
    
    // Insert error message at the top of the active form
    const activeForm = document.querySelector('.form-container:not(.hidden)');
    const form = activeForm.querySelector('form');
    form.insertBefore(errorContainer, form.firstChild);
    
    // Auto-remove error after 5 seconds
    setTimeout(() => {
        if (errorContainer.parentNode) {
            errorContainer.remove();
        }
    }, 5000);
}

// Show success message
function showSuccess() {
    const container = document.querySelector('.container');
    const successMessage = document.getElementById('successMessage');
    
    container.style.display = 'none';
    successMessage.classList.remove('hidden');
}

// Enter dashboard (redirect to main system)
function enterDashboard() {
    // Store login state
    localStorage.setItem('crowdManagementLoggedIn', 'true');
    localStorage.setItem('crowdManagementLoginTime', new Date().toISOString());
    
    // Redirect to dashboard
    window.location.href = 'dashboard.html';
}

// API Configuration
const API_BASE_URL = window.location.origin + '/api';

// API Helper function
async function makeAPICall(endpoint, options = {}) {
    const token = localStorage.getItem('crowdManagementToken');
    
    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        },
        ...options
    };

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || `HTTP error! status: ${response.status}`);
        }
        
        return data;
    } catch (error) {
        console.error('API call failed:', error);
        throw error;
    }
}

// Real login process
async function simulateLogin(email, password) {
    try {
        const response = await makeAPICall('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        
        // Store token
        localStorage.setItem('crowdManagementToken', response.token);
        
        return {
            success: true,
            user: response.user
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
}

// Real signup process
async function simulateSignup(userData) {
    try {
        const response = await makeAPICall('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
        
        // Store token
        localStorage.setItem('crowdManagementToken', response.token);
        
        return {
            success: true,
            user: response.user
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Add ripple effect to all buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', createRipple);
    });
    
    // Handle login form submission
    const loginForm = document.querySelector('#loginForm form');
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (!validateForm('login')) {
            return;
        }
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const submitBtn = loginForm.querySelector('.btn-primary');
        
        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        
        try {
            const response = await simulateLogin(email, password);
            
            if (response.success) {
                // Store user data
                localStorage.setItem('crowdManagementUser', JSON.stringify(response.user));
                
                // Show success and redirect
                setTimeout(() => {
                    enterDashboard();
                }, 500);
            } else {
                showError([response.error || 'Login failed. Please check your credentials.']);
            }
        } catch (error) {
            showError(['An error occurred. Please try again.']);
        } finally {
            // Remove loading state
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    });
    
    // Handle signup form submission
    const signupForm = document.querySelector('#signupForm form');
    signupForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (!validateForm('signup')) {
            return;
        }
        
        const userData = {
            name: document.getElementById('signupName').value,
            email: document.getElementById('signupEmail').value,
            organization: document.getElementById('signupOrganization').value,
            password: document.getElementById('signupPassword').value
        };
        
        const submitBtn = signupForm.querySelector('.btn-primary');
        
        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        
        try {
            const response = await simulateSignup(userData);
            
            if (response.success) {
                // Store user data
                localStorage.setItem('crowdManagementUser', JSON.stringify(response.user));
                
                // Show success message
                showSuccess();
            } else {
                showError([response.error || 'Signup failed. Please try again.']);
            }
        } catch (error) {
            showError(['An error occurred. Please try again.']);
        } finally {
            // Remove loading state
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    });
    
    // Handle social login
    const socialButtons = document.querySelectorAll('.btn-social');
    socialButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Simulate Google OAuth (in real app, this would integrate with Google OAuth)
            button.classList.add('loading');
            button.disabled = true;
            
            setTimeout(() => {
                const userData = {
                    name: 'Google User',
                    email: 'user@gmail.com',
                    organization: 'Google',
                    provider: 'google'
                };
                
                localStorage.setItem('crowdManagementUser', JSON.stringify(userData));
                enterDashboard();
            }, 1500);
        });
    });
    
    // Enhanced input animations
    const inputs = document.querySelectorAll('.input-group input');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentNode.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentNode.classList.remove('focused');
            }
        });
        
        // Check if input has value on page load
        if (input.value) {
            input.parentNode.classList.add('focused');
        }
    });
    
    // Add parallax effect to background shapes
    document.addEventListener('mousemove', function(e) {
        const shapes = document.querySelectorAll('.shape');
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        shapes.forEach((shape, index) => {
            const speed = (index + 1) * 0.5;
            const xMovement = (x - 0.5) * speed * 20;
            const yMovement = (y - 0.5) * speed * 20;
            
            shape.style.transform = `translate(${xMovement}px, ${yMovement}px)`;
        });
    });
    
    // Check if user is already logged in
    const isLoggedIn = localStorage.getItem('crowdManagementLoggedIn');
    if (isLoggedIn) {
        const loginTime = new Date(localStorage.getItem('crowdManagementLoginTime'));
        const now = new Date();
        const timeDiff = now - loginTime;
        
        // Auto-logout after 24 hours
        if (timeDiff < 24 * 60 * 60 * 1000) {
            enterDashboard();
        } else {
            localStorage.removeItem('crowdManagementLoggedIn');
            localStorage.removeItem('crowdManagementLoginTime');
            localStorage.removeItem('crowdManagementUser');
        }
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Enter key on forms
    if (e.key === 'Enter' && e.target.tagName === 'INPUT') {
        const form = e.target.closest('form');
        if (form) {
            const submitBtn = form.querySelector('.btn-primary');
            if (submitBtn && !submitBtn.disabled) {
                submitBtn.click();
            }
        }
    }
    
    // Escape key to close errors
    if (e.key === 'Escape') {
        const errorMessages = document.querySelectorAll('.error-message');
        errorMessages.forEach(error => error.remove());
    }
});

// Prevent form submission on Enter in text inputs (except when focused on submit button)
document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && e.target.type !== 'submit' && e.target.tagName === 'INPUT') {
        e.preventDefault();
    }
});
