import http from "k6/http";
import { check, sleep } from "k6";

const BASE_URL = "<URL>";

export const options = {
  thresholds: {
    http_req_duration: ["p(95) < 2000", "p(99) < 3000"],
    checks: ["rate>0.95"],
  },
  stages: [
    { duration: "10s", target: 10 },
    { duration: "20s", target: 20 },
    { duration: "10s", target: 0 },
  ],
};

export default function () {
  const res = http.get(BASE_URL);
  check(res, {
    "status is 200": (r) => r.status === 200,
    "response time < 500ms": (r) => r.timings.duration < 500,
    "content is present": (r) => r.body.includes("OK"),
  });
  sleep(1);
}
