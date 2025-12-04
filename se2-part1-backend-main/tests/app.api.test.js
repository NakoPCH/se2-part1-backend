// __tests__/app.api.test.js

import request from 'supertest';
import app from '../app.js'; // Φορτώνουμε την Express εφαρμογή

describe('General API Handlers', () => {

  // Test 1: Έλεγχος του Health Check Endpoint
  test('GET /health should return 200 OK and "Healthy"', async () => {
    
    const response = await request(app).get('/health');

    // Assert 1: Έλεγχος HTTP Status Code
    expect(response.statusCode).toBe(200);
    
    // Assert 2: Έλεγχος του σώματος της απόκρισης
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Healthy');
  });

  // Test 2: Έλεγχος του 404 Not Found Handler
  // Αυτό είναι κρίσιμο για να καλύψεις τον 404 handler στο app.js
  test('GET to an unknown route should return 404 Not Found', async () => {
    
    // Στέλνουμε αίτημα σε μια ανύπαρκτη διαδρομή
    const response = await request(app).get('/api/not-a-real-route-1234');

    // Assert 1: Έλεγχος HTTP Status Code
    expect(response.statusCode).toBe(404);
    
    // Assert 2: Έλεγχος του σώματος της απόκρισης
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe('Not found');
  });

  // Test 3: Έλεγχος Central Error Handler (Απαιτείται Mocking ή αναγκαστικό throw)
  // Για να καλύψεις τον app.use(errorHandler), πρέπει να προκαλέσεις ένα σφάλμα.
  // Αυτό είναι πιο σύνθετο και συνήθως γίνεται με mocking ενός middleware/controller
  // που πετάει σφάλμα στον επόμενο handler (next(error)). 
  // Θα το αφήσουμε για αργότερα, όταν γράψουμε tests για τους controllers, όπου θα είναι πιο εύκολο να προκαλέσουμε σφάλμα.
});