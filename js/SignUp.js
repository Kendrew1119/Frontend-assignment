// Signup.js - Registration functionality for Signup page

document.addEventListener('DOMContentLoaded', function() {
    // Get form elements
    const signupForm = document.getElementById('signupForm');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');
    const signupBtn = document.querySelector('.signup-btn');
    const agreeTermsCheckbox = document.getElementById('agreeTerms');
    
    // Get all form inputs for validation
    const formInputs = {
        firstName: document.getElementById('firstName'),
        lastName: document.getElementById('lastName'),
        username: document.getElementById('username'),
        email: document.getElementById('email'),
        phone: document.getElementById('phone'),
        gender: document.getElementById('gender'),
        dateOfBirth: document.getElementById('dateOfBirth'),
        address: document.getElementById('address'),
        postcode: document.getElementById('postcode'),
        password: passwordInput,
        confirmPassword: confirmPasswordInput
    };

    // Password requirements elements
    const passwordRequirements = {
        length: document.getElementById('length'),
        uppercase: document.getElementById('uppercase'),
        lowercase: document.getElementById('lowercase'),
        number: document.getElementById('number'),
        special: document.getElementById('special')
    };

    // Form submission handler
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        handleSignup();
    });

    // Password validation
    passwordInput.addEventListener('input', validatePassword);
    confirmPasswordInput.addEventListener('input', validatePasswordMatch);

    // Real-time validation for other fields
    formInputs.username.addEventListener('blur', validateUsername);
    formInputs.email.addEventListener('blur', validateEmail);
    formInputs.phone.addEventListener('blur', validatePhone);

    // Clear error messages on input
    Object.values(formInputs).forEach(input => {
        input.addEventListener('input', clearMessages);
    });

    function handleSignup() {
        // Validate all fields
        const validationResult = validateAllFields();
        
        if (!validationResult.isValid) {
            showErrorMessage(validationResult.message);
            validationResult.focusElement?.focus();
            return;
        }

        // Check terms agreement
        if (!agreeTermsCheckbox.checked) {
            showErrorMessage('Please agree to the Terms & Conditions and Privacy Policy');
            agreeTermsCheckbox.focus();
            return;
        }

        // Show loading state
        showLoadingState(true);

        // Simulate API call
        setTimeout(() => {
            const registrationResult = registerUser();
            
            if (registrationResult.success) {
                showSuccessMessage('Account created successfully! Redirecting to login...');
                
                setTimeout(() => {
                    window.location.href = 'Login.html';
                }, 2000);
            } else {
                showErrorMessage(registrationResult.message);
                showLoadingState(false);
            }
        }, 2000);
    }

    function validateAllFields() {
        // Required fields validation
        for (const [fieldName, input] of Object.entries(formInputs)) {
            if (!input.value.trim()) {
                return {
                    isValid: false,
                    message: `${fieldName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} is required`,
                    focusElement: input
                };
            }
        }

        // Specific field validations
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formInputs.email.value)) {
            return {
                isValid: false,
                message: 'Please enter a valid email address',
                focusElement: formInputs.email
            };
        }

        const phoneRegex = /^[\+]?[0-9]{10,15}$/;
        if (!phoneRegex.test(formInputs.phone.value.replace(/[\s\-\(\)]/g, ''))) {
            return {
                isValid: false,
                message: 'Please enter a valid phone number',
                focusElement: formInputs.phone
            };
        }

        // Age validation (must be at least 13 years old)
        const birthDate = new Date(formInputs.dateOfBirth.value);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        if (age < 13) {
            return {
                isValid: false,
                message: 'You must be at least 13 years old to register',
                focusElement: formInputs.dateOfBirth
            };
        }

        // Password validation
        const passwordValidation = validatePasswordStrength(formInputs.password.value);
        if (!passwordValidation.isValid) {
            return {
                isValid: false,
                message: 'Please meet all password requirements',
                focusElement: formInputs.password
            };
        }

        // Password confirmation
        if (formInputs.password.value !== formInputs.confirmPassword.value) {
            return {
                isValid: false,
                message: 'Passwords do not match',
                focusElement: formInputs.confirmPassword
            };
        }

        // Username and email uniqueness
        const existingUsers = JSON.parse(localStorage.getItem('verdra_users') || '[]');
        
        const usernameExists = existingUsers.some(user => 
            user.username.toLowerCase() === formInputs.username.value.toLowerCase()
        );
        if (usernameExists) {
            return {
                isValid: false,
                message: 'Username already exists. Please choose a different one.',
                focusElement: formInputs.username
            };
        }

        const emailExists = existingUsers.some(user => 
            user.email.toLowerCase() === formInputs.email.value.toLowerCase()
        );
        if (emailExists) {
            return {
                isValid: false,
                message: 'Email already registered. Please use a different email or try logging in.',
                focusElement: formInputs.email
            };
        }

        return { isValid: true };
    }

    function registerUser() {
        try {
            const existingUsers = JSON.parse(localStorage.getItem('verdra_users') || '[]');
            
            const newUser = {
                id: 'user-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
                username: formInputs.username.value.trim(),
                email: formInputs.email.value.trim().toLowerCase(),
                password: formInputs.password.value,
                firstName: formInputs.firstName.value.trim(),
                lastName: formInputs.lastName.value.trim(),
                phone: formInputs.phone.value.trim(),
                gender: formInputs.gender.value,
                dateOfBirth: formInputs.dateOfBirth.value,
                address: formInputs.address.value.trim(),
                postcode: formInputs.postcode.value.trim(),
                newsletter: document.getElementById('newsletter').checked,
                createdAt: new Date().toISOString(),
                lastLogin: null
            };

            existingUsers.push(newUser);
            localStorage.setItem('verdra_users', JSON.stringify(existingUsers));

            return { success: true, user: newUser };
        } catch (error) {
            console.error('Registration error:', error);
            return {
                success: false,
                message: 'Registration failed. Please try again.'
            };
        }
    }

    function validatePassword() {
        const password = passwordInput.value;
        const requirements = validatePasswordStrength(password);

        // Update visual indicators
        Object.keys(requirements.checks).forEach(key => {
            const element = passwordRequirements[key];
            if (element) {
                if (requirements.checks[key]) {
                    element.classList.add('valid');
                } else {
                    element.classList.remove('valid');
                }
            }
        });

        return requirements.isValid;
    }

    function validatePasswordStrength(password) {
        const checks = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /\d/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        };

        const isValid = Object.values(checks).every(check => check);

        return { isValid, checks };
    }

    function validatePasswordMatch() {
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        
        const matchInput = confirmPasswordInput;
        
        if (confirmPassword && password !== confirmPassword) {
            matchInput.style.borderColor = 'var(--error-red)';
            return false;
        } else {
            matchInput.style.borderColor = 'rgba(45, 80, 22, 0.2)';
            return true;
        }
    }

    function validateUsername() {
        const username = formInputs.username.value.trim();
        const usernameInput = formInputs.username;

        if (username.length < 3) {
            usernameInput.style.borderColor = 'var(--error-red)';
            return false;
        }

        // Check if username contains only allowed characters
        const usernameRegex = /^[a-zA-Z0-9_]+$/;
        if (!usernameRegex.test(username)) {
            usernameInput.style.borderColor = 'var(--error-red)';
            return false;
        }

        usernameInput.style.borderColor = 'rgba(45, 80, 22, 0.2)';
        return true;
    }

    function validateEmail() {
        const email = formInputs.email.value.trim();
        const emailInput = formInputs.email;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            emailInput.style.borderColor = 'var(--error-red)';
            return false;
        }

        emailInput.style.borderColor = 'rgba(45, 80, 22, 0.2)';
        return true;
    }

    function validatePhone() {
        const phone = formInputs.phone.value.trim();
        const phoneInput = formInputs.phone;
        const phoneRegex = /^[\+]?[0-9]{10,15}$/;

        if (!phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))) {
            phoneInput.style.borderColor = 'var(--error-red)';
            return false;
        }

        phoneInput.style.borderColor = 'rgba(45, 80, 22, 0.2)';
        return true;
    }

    function showLoadingState(loading) {
        if (loading) {
            signupBtn.classList.add('loading');
            signupBtn.disabled = true;
        } else {
            signupBtn.classList.remove('loading');
            signupBtn.disabled = false;
        }
    }

    function showErrorMessage(message) {
        errorMessage.textContent = message;
        errorMessage.classList.add('show');
        successMessage.classList.remove('show');
        
        // Auto-hide after 7 seconds
        setTimeout(() => {
            errorMessage.classList.remove('show');
        }, 7000);
    }

    function showSuccessMessage(message) {
        successMessage.textContent = message;
        successMessage.classList.add('show');
        errorMessage.classList.remove('show');
    }

    function clearMessages() {
        errorMessage.classList.remove('show');
        successMessage.classList.remove('show');
    }
});

// Global function for password toggle
function togglePassword(fieldId) {
    const field = document.getElementById(fieldId);
    const button = field.nextElementSibling.nextElementSibling; // Get the toggle button
    
    if (field.type === 'password') {
        field.type = 'text';
        button.textContent = '🙈';
    } else {
        field.type = 'password';
        button.textContent = '👁️';
    }
}