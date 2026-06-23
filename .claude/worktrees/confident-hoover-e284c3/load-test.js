import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 20 },   // ramp up to 20 users
    { duration: '3m', target: 20 },   // stay at 20 for 3 min
    { duration: '2m', target: 0 },    // ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<600', 'p(99)<1000'],
    http_req_failed: ['rate<0.1'],
  },
};

export default function () {
  // Test homepage load
  let res = http.get('https://rentalhub.ng');
  check(res, {
    'homepage status 200': (r) => r.status === 200,
    'homepage loads fast': (r) => r.timings.duration < 500,
  });

  sleep(1);

  // Test properties API
  res = http.get('https://rentalhub.ng/api/properties');
  check(res, {
    'properties API 200': (r) => r.status === 200,
  });

  sleep(2);
}
