import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '40s', target: 200 }, // Ανέβηκε στους 200 χρήστες (από 20)
    { duration: '40s', target: 400 }, // Κράτα τους 400 χρήστες
    { duration: '20s', target: 0 },
  ],
  thresholds: {
    // Πολύ αυστηρό: το 95% των αιτημάτων να απαντά σε < 200ms 
    // (Αν και η απαίτηση λέει 3s, εμείς το κάνουμε αυστηρό για να βρούμε το όριο)
    http_req_duration: ['p(95)<200'], 
    // Μηδενική ανοχή σε σφάλματα
    http_req_failed: ['rate<0.001'], 
  },
};

export default function () {
  const url = 'http://127.0.0.1:5050/api/lighting/rooms';
  const res = http.get(url);

  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time ok': (r) => r.timings.duration < 500,
  });

  sleep(0.5); // Μειώσαμε το sleep για να γίνονται πιο συχνά αιτήματα
}