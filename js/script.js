// Bucks2Bar JavaScript Functions

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initializeApp();
});

// Initialize the application
function initializeApp() {
    // Add smooth scrolling for navigation links
    setupSmoothScrolling();
    
    // Add enter key support for calculator
    setupKeyboardSupport();
    
    // Add input validation
    setupInputValidation();
    
    // Initialize tooltips if Bootstrap tooltips are available
    if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }
}

// Setup smooth scrolling for navigation links
function setupSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Close mobile menu if open
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse.classList.contains('show')) {
                    const navbarToggler = document.querySelector('.navbar-toggler');
                    navbarToggler.click();
                }
            }
        });
    });
}

// Setup keyboard support for the calculator
function setupKeyboardSupport() {
    const amountInput = document.getElementById('amount');
    const drinkPriceInput = document.getElementById('drinkPrice');
    
    if (amountInput && drinkPriceInput) {
        [amountInput, drinkPriceInput].forEach(input => {
            input.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    calculateDrinks();
                }
            });
        });
    }
}

// Setup input validation
function setupInputValidation() {
    const inputs = document.querySelectorAll('input[type="number"]');
    
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            // Remove any negative values
            if (this.value < 0) {
                this.value = 0;
            }
            
            // Limit decimal places to 2
            if (this.value.includes('.')) {
                const parts = this.value.split('.');
                if (parts[1].length > 2) {
                    this.value = parseFloat(this.value).toFixed(2);
                }
            }
        });
    });
}

// Main calculation function
function calculateDrinks() {
    const amountInput = document.getElementById('amount');
    const drinkPriceInput = document.getElementById('drinkPrice');
    const resultDiv = document.getElementById('result');
    const drinkCountSpan = document.getElementById('drinkCount');
    
    // Get input values
    const amount = parseFloat(amountInput.value) || 0;
    const drinkPrice = parseFloat(drinkPriceInput.value) || 0;
    
    // Validate inputs
    if (amount <= 0) {
        showError('Please enter a valid amount greater than 0');
        return;
    }
    
    if (drinkPrice <= 0) {
        showError('Please enter a valid drink price greater than 0');
        return;
    }
    
    // Calculate number of drinks
    const numberOfDrinks = Math.floor(amount / drinkPrice);
    const remainder = (amount % drinkPrice).toFixed(2);
    
    // Update result display
    drinkCountSpan.textContent = numberOfDrinks;
    
    // Add remainder information if applicable
    let resultHTML = `
        <h4 class="alert-heading">
            <i class="bi bi-cup-hot"></i> You can afford:
        </h4>
        <p class="mb-0 display-6 fw-bold text-success">${numberOfDrinks}</p>
        <p class="mb-0">drink${numberOfDrinks !== 1 ? 's' : ''}</p>
    `;
    
    if (remainder > 0) {
        resultHTML += `<p class="mt-2 text-muted">with $${remainder} left over</p>`;
    }
    
    resultDiv.querySelector('.alert').innerHTML = resultHTML;
    
    // Show result with animation
    resultDiv.style.display = 'block';
    
    // Add celebration effect for large numbers
    if (numberOfDrinks >= 10) {
        addCelebrationEffect();
    }
    
    // Track the calculation (for analytics if needed)
    trackCalculation(amount, drinkPrice, numberOfDrinks);
}

// Show error message
function showError(message) {
    const resultDiv = document.getElementById('result');
    
    resultDiv.innerHTML = `
        <div class="alert alert-danger alert-lg">
            <h4 class="alert-heading">
                <i class="bi bi-exclamation-triangle"></i> Oops!
            </h4>
            <p class="mb-0">${message}</p>
        </div>
    `;
    
    resultDiv.style.display = 'block';
    
    // Hide error after 3 seconds
    setTimeout(() => {
        resultDiv.style.display = 'none';
    }, 3000);
}

// Add celebration effect for large numbers
function addCelebrationEffect() {
    const drinkCountSpan = document.getElementById('drinkCount');
    
    // Add pulse animation
    drinkCountSpan.classList.add('pulse');
    
    // Remove animation after 2 seconds
    setTimeout(() => {
        drinkCountSpan.classList.remove('pulse');
    }, 2000);
    
    // Create confetti effect (simple version)
    createConfetti();
}

// Simple confetti effect
function createConfetti() {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7'];
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
        createConfettiPiece(colors[Math.floor(Math.random() * colors.length)]);
    }
}

// Create individual confetti piece
function createConfettiPiece(color) {
    const confetti = document.createElement('div');
    confetti.style.cssText = `
        position: fixed;
        width: 10px;
        height: 10px;
        background: ${color};
        top: -10px;
        left: ${Math.random() * 100}%;
        opacity: 1;
        transform: rotate(${Math.random() * 360}deg);
        pointer-events: none;
        z-index: 9999;
        border-radius: 50%;
    `;
    
    document.body.appendChild(confetti);
    
    // Animate confetti falling
    const animation = confetti.animate([
        { transform: `translateY(0) rotate(0deg)`, opacity: 1 },
        { transform: `translateY(100vh) rotate(720deg)`, opacity: 0 }
    ], {
        duration: 3000,
        easing: 'cubic-bezier(0.5, 0, 0.5, 1)'
    });
    
    // Remove confetti after animation
    animation.onfinish = () => {
        document.body.removeChild(confetti);
    };
}

// Track calculation for analytics (placeholder)
function trackCalculation(amount, drinkPrice, result) {
    // This would typically send data to an analytics service
    console.log('Calculation tracked:', {
        amount: amount,
        drinkPrice: drinkPrice,
        result: result,
        timestamp: new Date().toISOString()
    });
}

// Preset quick calculations
function quickCalculate(amount, price) {
    document.getElementById('amount').value = amount;
    document.getElementById('drinkPrice').value = price;
    calculateDrinks();
}

// Format currency display
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// Add scroll effect to navbar
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Add loading state to buttons
function addLoadingState(button) {
    const originalText = button.innerHTML;
    button.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status"></span>Calculating...';
    button.disabled = true;
    
    setTimeout(() => {
        button.innerHTML = originalText;
        button.disabled = false;
    }, 500);
}

// Easter egg: Konami code
let konamiCode = [];
const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // Up, Up, Down, Down, Left, Right, Left, Right, B, A

document.addEventListener('keydown', function(e) {
    konamiCode.push(e.keyCode);
    
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        activateEasterEgg();
        konamiCode = [];
    }
});

// Easter egg activation
function activateEasterEgg() {
    document.body.style.transform = 'rotate(180deg)';
    
    setTimeout(() => {
        document.body.style.transform = 'rotate(0deg)';
        alert('🎉 You found the secret! Here\'s a free virtual drink! 🍹');
    }, 2000);
}

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        calculateDrinks,
        formatCurrency,
        quickCalculate
    };
}
