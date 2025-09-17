const { ManagementClient } = require('auth0');

module.exports = async (req, res) => {
  // Enable CORS for all origins (you can restrict this to your domain later)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    res.status(405).json({ 
      success: false, 
      error: 'Method not allowed. Only POST requests are accepted.' 
    });
    return;
  }

  try {
    const { userId, applicationData } = req.body;

    // Validate required data
    if (!userId || !applicationData) {
      res.status(400).json({ 
        success: false, 
        error: 'Missing required data: userId and applicationData are required.' 
      });
      return;
    }

    // Initialize Auth0 Management API client
    const management = new ManagementClient({
      domain: process.env.AUTH0_DOMAIN,
      clientId: process.env.AUTH0_M2M_CLIENT_ID,
      clientSecret: process.env.AUTH0_M2M_CLIENT_SECRET,
      scope: 'read:users update:users'
    });

    // Update user metadata in Auth0
    const updatedUser = await management.updateUser(
      { id: userId },
      {
        user_metadata: {
          application: {
            firstName: applicationData.firstName,
            lastName: applicationData.lastName,
            dateOfBirth: applicationData.dateOfBirth,
            email: applicationData.email,
            phone: applicationData.phone,
            submissionDate: applicationData.submissionDate,
            status: applicationData.status,
            lastUpdated: new Date().toISOString()
          }
        }
      }
    );

    // Log successful submission (for debugging)
    console.log(`Application submitted successfully for user: ${userId}`);
    console.log(`Application data:`, applicationData);

    // Return success response
    res.status(200).json({
      success: true,
      message: 'Application submitted successfully and saved to Auth0',
      userId: userId,
      submissionDate: applicationData.submissionDate
    });

  } catch (error) {
    // Log error for debugging
    console.error('Error processing application submission:', error);

    // Return error response
    res.status(500).json({
      success: false,
      error: 'Failed to submit application. Please try again.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};