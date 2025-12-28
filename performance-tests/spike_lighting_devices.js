import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '10s', target: 300 }, // Απότομη άνοδος σε 300 χρήστες (Spike!)
    { duration: '1m', target: 300 },  // Κράτα τους 300 για 1 λεπτό
    { duration: '10s', target: 0 },   // Απότομη πτώση
  ],
  thresholds: {
    // Εδώ μπορεί να είμαστε πιο ελαστικοί λόγω του spike
    http_req_duration: ['p(95)<1000'], 
    http_req_failed: ['rate<0.05'], 
  },
};

export default function () {
  // ΑΛΛΑΞΕ ΤΟ: Βάλε το δεύτερο route σου εδώ
  const BASE_URL = 'http://127.0.0.1:5050/api/lighting/devices';
  const res = http.get(BASE_URL);
  
  check(res, {
    'status is 200': (r) => r.status === 200,
  });
  
  sleep(1);
}