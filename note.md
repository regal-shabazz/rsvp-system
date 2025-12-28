 // Global state management
        let guestData = null;
        let checkInStatus = 'awaiting'; // 'awaiting', 'checked-in', 'invalid'
        let isAdmin = false; // Will be determined by authentication

        // Initialize the page when loaded
        document.addEventListener('DOMContentLoaded', function() {
            initializePage();
        });

        function initializePage() {
            // TODO: Extract QR token from URL parameters
            // const urlParams = new URLSearchParams(window.location.search);
            // const token = urlParams.get('token');
            
            loadGuestData();
            updateUIState();
        }

        /**
         * Load guest data from backend
         * This function will make API calls to fetch guest information
         */
        async function loadGuestData() {
            try {
                // TODO: Replace with actual Firestore/backend call
                // const response = await fetch(`/api/guest/${token}`);
                // const data = await response.json();
                
                // Placeholder data for demonstration
                guestData = {
                    name: "Loading...",
                    partySize: "Loading...",
                    token: "Loading...",
                    status: "awaiting"
                };
                
                // Simulate loading delay
                setTimeout(() => {
                    // TODO: Replace with actual data from API
                    guestData = {
                        name: "Sarah & Michael Johnson",
                        partySize: "2 guests",
                        token: "WED2024-ABC123",
                        status: "awaiting" // or 'checked-in' or 'invalid'
                    };
                    
                    updateGuestDisplay();
                    updateCheckInStatus(guestData.status);
                }, 1500);
                
            } catch (error) {
                console.error('Error loading guest data:', error);
                updateCheckInStatus('invalid');
            }
        }

        /**
         * Update the check-in status and refresh UI
         * @param {string} status - 'awaiting', 'checked-in', or 'invalid'
         */
        function updateCheckInStatus(status) {
            checkInStatus = status;
            updateUIState();
            
            // TODO: Update status in backend/Firestore
            // await updateGuestStatusInDatabase(guestData.token, status);
        }

        /**
         * Handle check-in button click (admin only)
         */
        async function handleCheckInClick() {
            if (!isAdmin || checkInStatus !== 'awaiting') {
                return;
            }
            
            try {
                // Disable button during processing
                const button = document.getElementById('checkInButton');
                const buttonText = document.getElementById('buttonText');
                
                button.disabled = true;
                buttonText.textContent = 'Processing...';
                
                // TODO: Make API call to check in guest
                // await fetch(`/api/checkin/${guestData.token}`, { method: 'POST' });
                
                // Simulate API delay
                setTimeout(() => {
                    updateCheckInStatus('checked-in');
                }, 1000);
                
            } catch (error) {
                console.error('Error checking in guest:', error);
                // Re-enable button on error
                document.getElementById('checkInButton').disabled = false;
                document.getElementById('buttonText').textContent = 'Check In Guest';
            }
        }

        /**
         * Update guest information display
         */
        function updateGuestDisplay() {
            if (!guestData) return;
            
            document.getElementById('guestName').textContent = guestData.name;
            document.getElementById('partySize').textContent = guestData.partySize;
            document.getElementById('rsvpToken').textContent = guestData.token;
        }

        /**
         * Update UI state based on current status and admin privileges
         */
        function updateUIState() {
            const statusBadge = document.getElementById('statusBadge');
            const statusText = document.getElementById('statusText');
            const checkInButton = document.getElementById('checkInButton');
            const buttonText = document.getElementById('buttonText');
            const infoMessage = document.getElementById('infoMessage');
            
            // Update status badge
            statusBadge.className = 'inline-flex items-center px-4 py-2 rounded-full text-sm font-medium mb-2';
            
            switch (checkInStatus) {
                case 'awaiting':
                    statusBadge.classList.add('bg-amber-100', 'text-amber-800', 'border', 'border-amber-200');
                    statusText.textContent = 'Awaiting Check-In';
                    statusBadge.querySelector('div').classList.add('bg-amber-500');
                    break;
                    
                case 'checked-in':
                    statusBadge.classList.add('bg-green-100', 'text-green-800', 'border', 'border-green-200');
                    statusText.textContent = 'Checked In Successfully';
                    statusBadge.querySelector('div').classList.add('bg-green-500');
                    break;
                    
                case 'invalid':
                    statusBadge.classList.add('bg-red-100', 'text-red-800', 'border', 'border-red-200');
                    statusText.textContent = 'Invalid or Expired Pass';
                    statusBadge.querySelector('div').classList.add('bg-red-500');
                    break;
            }
            
            // Update button state
            if (!isAdmin) {
                checkInButton.style.display = 'none';
                infoMessage.textContent = 'Please present this screen to the event staff for check-in.';
            } else {
                checkInButton.style.display = 'block';
                infoMessage.textContent = 'Confirm guest entry before checking in.';
                
                if (checkInStatus === 'checked-in') {
                    checkInButton.disabled = true;
                    buttonText.textContent = 'Already Checked In';
                    checkInButton.classList.remove('bg-rose-500', 'hover:bg-rose-600');
                    checkInButton.classList.add('bg-gray-300');
                } else if (checkInStatus === 'invalid') {
                    checkInButton.disabled = true;
                    buttonText.textContent = 'Invalid Guest';
                    checkInButton.classList.remove('bg-rose-500', 'hover:bg-rose-600');
                    checkInButton.classList.add('bg-gray-300');
                } else {
                    checkInButton.disabled = false;
                    buttonText.textContent = 'Check In Guest';
                    checkInButton.classList.remove('bg-gray-300');
                    checkInButton.classList.add('bg-rose-500', 'hover:bg-rose-600');
                }
            }
        }

        // TODO: Add authentication check to determine if user is admin
        // This would typically be done via JWT token validation or session check
        function checkAdminStatus() {
            // Placeholder - replace with actual auth logic
            // isAdmin = await validateAdminToken();
            // updateUIState();
        }

        // TODO: Add real-time updates via WebSocket or polling
        // This would allow multiple admin devices to stay in sync
        function setupRealTimeUpdates() {
            // Example: WebSocket connection for live updates
            // const ws = new WebSocket('wss://your-backend.com/checkin-updates');
            // ws.onmessage = (event) => {
            //     const update = JSON.parse(event.data);
            //     if (update.token === guestData.token) {
            //         updateCheckInStatus(update.status);
            //     }
            // };
        }

       